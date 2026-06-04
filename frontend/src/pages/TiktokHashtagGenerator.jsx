import HashtagLandingPage from '../components/HashtagLandingPage';
import { PAGE_SEO } from '../constants/seo';
import { TIKTOK_HASHTAG_LANDING } from '../constants/hashtagLandingContent';

export default function TiktokHashtagGenerator() {
  return (
    <HashtagLandingPage
      seo={PAGE_SEO.tiktokHashtagGenerator}
      hero={TIKTOK_HASHTAG_LANDING.hero}
      content={TIKTOK_HASHTAG_LANDING.content}
    />
  );
}
