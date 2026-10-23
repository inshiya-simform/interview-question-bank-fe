import type { Question } from '@/api';
import { Button, Icon, Popover } from '@/components';
import { cn } from '@/utils/cn';
import { useSaveQuestionButton } from '../hooks/useSaveQuestionButton';
import type { SaveButtonMode } from '../hooks/useSaveQuestionButton';
import { CollectionPicker } from './CollectionPicker';
import './SaveQuestionButton.css';

interface SaveQuestionButtonProps {
  question: Question;
  // "move" relabels the control for the Saved page, where every question is already saved.
  mode?: SaveButtonMode;
}

export function SaveQuestionButton({ question, mode = 'save' }: SaveQuestionButtonProps) {
  const button = useSaveQuestionButton(question, mode);

  return (
    <Popover
      isOpen={button.isOpen}
      onClose={button.close}
      label={button.pickerTitle}
      trigger={
        <Button
          variant="secondary"
          className={cn('save-btn', button.isSaved && !button.isMove && 'save-btn--saved')}
          aria-haspopup="dialog"
          aria-expanded={button.isOpen}
          aria-label={button.ariaLabel}
          onClick={button.toggle}
        >
          {!button.isMove && <Icon name="bookmark" size={16} filled={button.isSaved} />}
          {button.label}
          {button.isMove && <span aria-hidden="true">▾</span>}
        </Button>
      }
    >
      <CollectionPicker
        question={question}
        currentCollectionId={button.currentCollectionId}
        title={button.pickerTitle}
        onDone={button.close}
      />
    </Popover>
  );
}
