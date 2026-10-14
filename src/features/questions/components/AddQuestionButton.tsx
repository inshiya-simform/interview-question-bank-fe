import { Button } from '@/components';
import { PERMISSIONS } from '@/constants';
import { withPermission } from '@/hoc';

export const AddQuestionButton = withPermission(Button, [PERMISSIONS.QUESTION_CREATE]);
