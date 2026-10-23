import type { AuditLog } from '@/api';
import {
  AUDIT_ACTION,
  AUDIT_COPY,
  AUDIT_FIELD_LABEL,
  AUDIT_JSON_INDENT,
  AUDIT_KEY_LABEL,
  AUDIT_MODULE,
} from '@/constants';
import { isRecord } from '@/utils/isRecord';
import { getStatusLabel, humanize } from './labels';
import { getChangedFields } from './summary';

type AuditLogLike = Pick<AuditLog, 'action' | 'module' | 'changes'>;

export interface TagLookup {
  tagName: (id: number) => string;
  categoryName: (id: number) => string;
}

export interface FieldDiff {
  key: string;
  label: string;
  from: string;
  to: string;
}

export interface DetailEntry {
  key: string;
  label: string;
  value: string;
}

// Every value is pre-formatted to plain text so the view can never render user data as markup.
export type AuditChangeView =
  | { kind: 'none' }
  | { kind: 'fields'; fields: FieldDiff[]; pendingReview: boolean }
  | { kind: 'details'; headline?: string; entries: DetailEntry[] }
  | { kind: 'raw'; json: string };

const STATUS_ACTIONS: readonly string[] = [
  AUDIT_ACTION.APPROVE,
  AUDIT_ACTION.REJECT,
  AUDIT_ACTION.REQUEST_CHANGES,
];

const DETAIL_ACTIONS: readonly string[] = [
  AUDIT_ACTION.CREATE,
  AUDIT_ACTION.GRANT_ACCESS,
  AUDIT_ACTION.REVOKE_ACCESS,
  AUDIT_ACTION.IMPORT,
  AUDIT_ACTION.EXPORT,
  AUDIT_ACTION.REGISTER,
];

const labelFor = (key: string): string => AUDIT_KEY_LABEL[key] ?? humanize(key);

function formatTagGroups(groups: unknown[], lookup: TagLookup): string {
  return groups
    .map((group) => {
      if (!isRecord(group) || typeof group.categoryId !== 'number') return JSON.stringify(group);
      const ids = Array.isArray(group.tagIds) ? group.tagIds : [];
      const names = ids.map((id) => (typeof id === 'number' ? lookup.tagName(id) : String(id)));
      return `${lookup.categoryName(group.categoryId)}: ${names.join(', ')}`;
    })
    .join('; ');
}

function formatTags(value: unknown[], lookup: TagLookup): string {
  if (value.length === 0) return AUDIT_COPY.EMPTY_VALUE;
  if (value.every((item) => typeof item === 'number')) {
    return value.map((id) => lookup.tagName(id)).join(', ');
  }
  return formatTagGroups(value, lookup);
}

function formatValue(key: string, value: unknown, lookup: TagLookup): string {
  if (value === null || value === undefined || value === '') return AUDIT_COPY.EMPTY_VALUE;
  if (key === 'tags' && Array.isArray(value)) return formatTags(value, lookup);
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value.length === 0 ? AUDIT_COPY.EMPTY_VALUE : value.join(', ');
  }
  return JSON.stringify(value);
}

function toFieldsView(changes: Record<string, unknown>, lookup: TagLookup): AuditChangeView {
  const fields = getChangedFields(changes).map((key): FieldDiff => {
    const diff = isRecord(changes[key]) ? changes[key] : {};
    return {
      key,
      label: AUDIT_FIELD_LABEL[key] ?? humanize(key),
      from: formatValue(key, diff.from, lookup),
      to: formatValue(key, diff.to, lookup),
    };
  });
  return { kind: 'fields', fields, pendingReview: changes.pendingReview === true };
}

function toStatusView(changes: Record<string, unknown>): AuditChangeView | null {
  const { fromStatus, toStatus, note, appliedDraft, discardedDraft } = changes;
  if (typeof fromStatus !== 'string' || typeof toStatus !== 'string') return null;

  const entries: DetailEntry[] = [];
  if (typeof note === 'string' && note) {
    entries.push({ key: 'note', label: labelFor('note'), value: note });
  }
  if (appliedDraft === true) {
    entries.push({ key: 'appliedDraft', label: labelFor('appliedDraft'), value: AUDIT_COPY.YES });
  }
  if (discardedDraft === true) {
    entries.push({
      key: 'discardedDraft',
      label: labelFor('discardedDraft'),
      value: AUDIT_COPY.YES,
    });
  }
  return {
    kind: 'details',
    headline: AUDIT_COPY.STATUS_CHANGE(getStatusLabel(fromStatus), getStatusLabel(toStatus)),
    entries,
  };
}

function toDetailEntries(changes: Record<string, unknown>, lookup: TagLookup): DetailEntry[] {
  return Object.entries(changes).map(([key, value]) => {
    // Show the override's reason directly instead of a JSON blob.
    if (key === 'duplicateOverride' && isRecord(value) && typeof value.reason === 'string') {
      return { key, label: AUDIT_COPY.DUPLICATE_OVERRIDE_REASON, value: value.reason };
    }
    return { key, label: labelFor(key), value: formatValue(key, value, lookup) };
  });
}

const toRawView = (changes: unknown): AuditChangeView => ({
  kind: 'raw',
  json: JSON.stringify(changes, null, AUDIT_JSON_INDENT) ?? '',
});

export function buildChangeView(log: AuditLogLike, lookup: TagLookup): AuditChangeView {
  const { action, module, changes } = log;
  if (changes === null || changes === undefined) return { kind: 'none' };
  if (!isRecord(changes)) return toRawView(changes);
  if (Object.keys(changes).length === 0) return { kind: 'none' };

  if (module === AUDIT_MODULE.QUESTION && action === AUDIT_ACTION.UPDATE) {
    const view = toFieldsView(changes, lookup);
    return view.kind === 'fields' && view.fields.length > 0 ? view : toRawView(changes);
  }
  if (STATUS_ACTIONS.includes(action)) return toStatusView(changes) ?? toRawView(changes);
  if (DETAIL_ACTIONS.includes(action)) {
    return { kind: 'details', entries: toDetailEntries(changes, lookup) };
  }
  return toRawView(changes);
}
