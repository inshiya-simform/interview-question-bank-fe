import type { IconName } from '@/components';
import { NOTIFICATION_TYPE } from '@/constants';
import type { NotificationType } from '@/constants';

export const NOTIFICATION_ICONS: Record<NotificationType, IconName> = {
  [NOTIFICATION_TYPE.QUESTION_APPROVED]: 'check',
  [NOTIFICATION_TYPE.CHANGES_REQUESTED]: 'alert',
  [NOTIFICATION_TYPE.QUESTION_REJECTED]: 'close',
  [NOTIFICATION_TYPE.NEW_CLIENT_QUESTION]: 'plus',
  [NOTIFICATION_TYPE.IMPORT_FINISHED]: 'upload',
  [NOTIFICATION_TYPE.PERMISSION_GRANTED]: 'members',
};
