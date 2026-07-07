import { useMemo, useState } from 'react';
import { HASHTAG_CATEGORIES } from '../constants/hashtagCategories';
import HashtagCategoryCard from './HashtagCategoryCard';
import './HashtagCategoryGrid.css';

const INITIAL_VISIBLE = 16;

export default function HashtagCategoryGrid({ selectedTopic = '', onCategorySelect }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HASHTAG_CATEGORIES;
    return HASHTAG_CATEGORIES.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.sampleTags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [query]);

  const popular = useMemo(
    () => filtered.filter((cat) => cat.popular),
    [filtered],
  );

  const rest = useMemo(
    () => filtered.filter((cat) => !cat.popular),
    [filtered],
  );

  const showAll = expanded || query.trim().length > 0;
  const visibleRest = showAll ? rest : rest.slice(0, Math.max(0, INITIAL_VISIBLE - popular.length));
  const hiddenCount = rest.length - visibleRest.length;

  return (
    <section className="hashtag-categories" aria-labelledby="hashtag-categories-heading">
      <div className="hashtag-categories__header">
        <h2 id="hashtag-categories-heading" className="hashtag-categories__title">
          Browse Hashtag Categories
        </h2>
        <p className="hashtag-categories__subtitle">
          Explore popular hashtag categories for YouTube, TikTok, Instagram, and Facebook.
        </p>
      </div>

      <div className="hashtag-categories__toolbar">
        <label className="hashtag-categories__search-label" htmlFor="hashtag-category-search">
          Search categories
        </label>
        <input
          id="hashtag-category-search"
          type="search"
          className="input hashtag-categories__search"
          placeholder="Search travel, food, fitness, beauty..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setExpanded(true);
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="hashtag-categories__empty">No categories match your search.</p>
      ) : (
        <>
          {popular.length > 0 && !query.trim() && (
            <div className="hashtag-categories__group">
              <p className="hashtag-categories__group-label">Popular categories</p>
              <div className="hashtag-categories__grid">
                {popular.map((category) => (
                  <HashtagCategoryCard
                    key={category.slug}
                    category={category}
                    selected={selectedTopic.toLowerCase() === category.title.toLowerCase()}
                    onSelect={onCategorySelect}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="hashtag-categories__group">
            {!query.trim() && popular.length > 0 && (
              <p className="hashtag-categories__group-label">All categories</p>
            )}
            <div className="hashtag-categories__grid">
              {(query.trim() ? filtered : visibleRest).map((category) => (
                <HashtagCategoryCard
                  key={category.slug}
                  category={category}
                  selected={selectedTopic.toLowerCase() === category.title.toLowerCase()}
                  onSelect={onCategorySelect}
                />
              ))}
            </div>
          </div>

          {!query.trim() && hiddenCount > 0 && (
            <div className="hashtag-categories__more-wrap">
              <button
                type="button"
                className="btn hashtag-categories__more-btn"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? 'Show less' : `Show ${hiddenCount} more categories`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
