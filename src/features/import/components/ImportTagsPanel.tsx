import { Button } from '@/components';
import { IMPORT_COPY } from '@/constants';
import { useImportTagsPanel } from '../hooks/useImportTagsPanel';
import './ImportTagsPanel.css';

export function ImportTagsPanel() {
  const { categories, feedback, copyTags } = useImportTagsPanel();

  return (
    <details className="idetails">
      <summary className="idetails__summary">{IMPORT_COPY.TAGS_SUMMARY}</summary>
      <div className="idetails__body">
        <div className="itags__bar">
          <Button variant="secondary" onClick={copyTags}>
            {IMPORT_COPY.TAGS_COPY}
          </Button>
          <p className="itags__feedback" role="status">
            {feedback}
          </p>
        </div>
        <dl className="itags__list" aria-label={IMPORT_COPY.TAGS_LIST_LABEL}>
          {categories.map((category) => (
            <div key={category.slug} className="itags__row">
              <dt>
                <code>{category.slug}</code>
              </dt>
              <dd>
                {category.tags.map((tag) => (
                  <code key={tag} className="itags__tag">
                    {tag}
                  </code>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
