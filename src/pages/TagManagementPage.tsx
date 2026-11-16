import { Button, Icon, PageHeader } from '@/components';
import { TAG_COPY } from '@/constants';
import { CategoryPanel, CategoryRail, TagDialogs } from '@/features/tag-management';
import { useTagManagementPage } from './useTagManagementPage';
import './TagManagementPage.css';

export function TagManagementPage() {
  const { dialog, openDialog, closeDialog, openCreateCategory } = useTagManagementPage();

  return (
    <>
      <PageHeader title={TAG_COPY.TITLE} subtitle={TAG_COPY.SUBTITLE}>
        <Button onClick={openCreateCategory}>
          <Icon name="plus" size={16} />
          {TAG_COPY.NEW_CATEGORY}
        </Button>
      </PageHeader>
      <div className="tag-management">
        <CategoryRail />
        <CategoryPanel onOpenDialog={openDialog} />
      </div>
      <TagDialogs dialog={dialog} onOpen={openDialog} onClose={closeDialog} />
    </>
  );
}
