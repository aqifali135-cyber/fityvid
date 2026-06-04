import HashtagLandingPage from '../components/HashtagLandingPage';
import { PAGE_SEO } from '../constants/seo';
import { INSTAGRAM_HASHTAG_LANDING } from '../constants/hashtagLandingContent';

export default function InstagramHashtagGenerator() {
  return (
    <HashtagLandingPage
      seo={PAGE_SEO.instagramHashtagGenerator}
      hero={INSTAGRAM_HASHTAG_LANDING.hero}
      content={INSTAGRAM_HASHTAG_LANDING.content}
    />
  );
}
