import { getCategoryCollageImages } from '../constants/hashtagCategories';
import './HashtagCategoryCard.css';

export default function HashtagCategoryCard({ category, selected, onSelect }) {
  const { slug, title, image, sampleTags } = category;
  const collageImages = getCategoryCollageImages(slug);

  return (
    <button
      type="button"
      className={`hashtag-category-card${selected ? ' hashtag-category-card--selected' : ''}`}
      onClick={() => onSelect(category)}
      aria-pressed={selected}
    >
      <div className="hashtag-category-card__media">
        <img
          className="hashtag-category-card__image hashtag-category-card__image--main"
          src={image}
          alt=""
          loading="lazy"
          width={640}
          height={400}
        />
        <div className="hashtag-category-card__collage" aria-hidden="true">
          <img
            className="hashtag-category-card__collage-img hashtag-category-card__collage-img--one"
            src={collageImages[0]}
            alt=""
            loading="lazy"
            width={200}
            height={130}
          />
          <img
            className="hashtag-category-card__collage-img hashtag-category-card__collage-img--two"
            src={collageImages[1]}
            alt=""
            loading="lazy"
            width={180}
            height={120}
          />
        </div>
        <span className="hashtag-category-card__count"># {sampleTags.length}</span>
      </div>
      <div className="hashtag-category-card__body">
        <h3 className="hashtag-category-card__title">{title}</h3>
        <p className="hashtag-category-card__tags">{sampleTags.join(' ')}</p>
      </div>
    </button>
  );
}
