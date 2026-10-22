import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { parseReviewConflict, releaseReviewLockKeepalive } from '@/api';
import type { ReviewConflictDetails, ReviewState } from '@/api';
import {
  useClaimReviewLockMutation,
  useReleaseReviewLockMutation,
  useReviewLockPollQuery,
} from '@/api/hooks';
import {
  MESSAGES,
  REVIEW_CONFLICT_REASON,
  REVIEW_POLL_INTERVAL_MS,
  REVIEW_STATUS,
} from '@/constants';
import { useSession } from '@/features/auth';
import { isSameInstant } from '@/utils/date';
import { BANNER_ACTION, buildBanner } from '../banner';
import type { BannerAction } from '../banner';
import { conflictMessage, lockOwnerOf } from '../conflicts';

type LockedConflict = Extract<ReviewConflictDetails, { reason: 'LOCKED' }>;
type DecidedConflict = Extract<ReviewConflictDetails, { reason: 'ALREADY_REVIEWED' }>;

// Owns the claim / heartbeat / release lifecycle so components never manage timers.
// `baselineUpdatedAt` is the updatedAt of the content the reviewer is looking at.
export function useReviewSession(
  questionId: string,
  baselineUpdatedAt: string,
  isEnabled: boolean,
  onReload: () => void,
) {
  const { user } = useSession();
  const { mutateAsync: claimAsync, isPending: isClaiming } = useClaimReviewLockMutation();
  const { mutate: release } = useReleaseReviewLockMutation();

  const [holds, setHolds] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [locked, setLocked] = useState<LockedConflict>();
  const [decided, setDecided] = useState<DecidedConflict>();
  const [claimedUpdatedAt, setClaimedUpdatedAt] = useState<string>();

  const holdsRef = useRef(false);
  const onReloadRef = useRef(onReload);
  const activeRef = useRef(false);

  useEffect(() => {
    holdsRef.current = holds;
    onReloadRef.current = onReload;
  });

  const applyConflict = useCallback((conflict: ReviewConflictDetails) => {
    toast.error(conflictMessage(conflict));
    switch (conflict.reason) {
      case REVIEW_CONFLICT_REASON.LOCKED:
        // Holding the lock when someone else owns it means it lapsed and was taken over.
        setIsLost(holdsRef.current);
        setHolds(false);
        setLocked(conflict);
        return;
      case REVIEW_CONFLICT_REASON.ALREADY_REVIEWED:
        setHolds(false);
        setDecided(conflict);
        return;
      case REVIEW_CONFLICT_REASON.EDITED_SINCE_LOADED:
        // Reload so the stored updatedAt and the displayed content change together; never resubmit.
        setClaimedUpdatedAt(undefined);
        onReloadRef.current();
        return;
      default: {
        const unreachable: never = conflict;
        return unreachable;
      }
    }
  }, []);

  const handleError = useCallback(
    (error: unknown) => {
      const conflict = parseReviewConflict(error);
      if (conflict) applyConflict(conflict);
    },
    [applyConflict],
  );

  const applyAcquired = useCallback((state: ReviewState) => {
    setHolds(true);
    setIsLost(false);
    setLocked(undefined);
    setClaimedUpdatedAt(state.updatedAt);
  }, []);

  const claim = useCallback(
    () =>
      claimAsync(questionId)
        .then(applyAcquired, handleError)
        .finally(() => setAttempted(true)),
    [claimAsync, questionId, applyAcquired, handleError],
  );

  useEffect(() => {
    if (!isEnabled) return;
    activeRef.current = true;
    let cancelled = false;
    void claimAsync(questionId).then(
      (state) => {
        if (cancelled) {
          // Closed before the claim landed: free it instead of leaving it to lapse.
          if (!activeRef.current) release(questionId);
          return;
        }
        applyAcquired(state);
        setAttempted(true);
      },
      (error: unknown) => {
        if (cancelled) return;
        handleError(error);
        setAttempted(true);
      },
    );
    return () => {
      cancelled = true;
      activeRef.current = false;
      if (holdsRef.current) release(questionId);
    };
  }, [isEnabled, questionId, claimAsync, release, applyAcquired, handleError]);

  // Best effort on tab close: the page may be gone before the request settles.
  useEffect(() => {
    if (!isEnabled) return;
    const onPageHide = () => {
      if (holdsRef.current) releaseReviewLockKeepalive(questionId);
    };
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [isEnabled, questionId]);

  const poll = useReviewLockPollQuery(user?.id, questionId, {
    enabled: isEnabled && attempted && !decided,
    holdsLock: holds,
    intervalMs: REVIEW_POLL_INTERVAL_MS,
  });
  const polled = poll.data;

  useEffect(() => {
    if (poll.error) handleError(poll.error);
  }, [poll.error, handleError]);

  const isDecidedByPoll = polled !== undefined && polled.status !== REVIEW_STATUS.PENDING_REVIEW;
  useEffect(() => {
    if (!isDecidedByPoll) return;
    toast.info(MESSAGES.REVIEW_DECIDED_BY_OTHER);
  }, [isDecidedByPoll]);

  const hasLock = holds && !isDecidedByPoll;
  const latestUpdatedAt = polled?.updatedAt ?? claimedUpdatedAt;
  const isEdited =
    latestUpdatedAt !== undefined && !isSameInstant(latestUpdatedAt, baselineUpdatedAt);

  // Our own lock in stale poll data must not hide the conflict that revoked it.
  const polledOther = lockOwnerOf(polled?.reviewLock, user?.id);
  const isPolledFree = polled !== undefined && polled.reviewLock === null;
  const polledLock = polled?.reviewLock;
  const otherLock = hasLock
    ? undefined
    : polledOther && polledLock
      ? polledLock
      : isPolledFree
        ? undefined
        : locked;

  const isDecided = Boolean(decided) || isDecidedByPoll;
  const canClaim = isEnabled && attempted && !hasLock && !isDecided && !otherLock && !isEdited;

  const banner = isEnabled
    ? buildBanner({
        decided: isDecided
          ? { status: decided?.status, by: decided?.reviewedBy ?? null }
          : undefined,
        isEdited,
        isLost,
        otherLock,
        canClaim,
      })
    : null;

  const reload = () => {
    setClaimedUpdatedAt(undefined);
    onReload();
  };

  return {
    banner,
    // Without a session (non-pending questions) the decision bar is governed by the caller.
    canAct: !isEnabled || (hasLock && !isDecided && !isEdited),
    isClaiming,
    handleError,
    reload,
    runBannerAction: (action: BannerAction) =>
      action === BANNER_ACTION.RELOAD ? reload() : void claim(),
  };
}
