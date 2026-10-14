import { Button } from '@/components';
import { PERMISSIONS } from '@/constants';
import { withPermission } from '@/hoc';

export const EditQuestionButton = withPermission(Button, [
  PERMISSIONS.QUESTION_EDIT_ANY,
  PERMISSIONS.QUESTION_EDIT_OWN,
]);
