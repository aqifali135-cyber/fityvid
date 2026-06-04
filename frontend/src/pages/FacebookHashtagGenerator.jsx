import HashtagLandingPage from '../components/HashtagLandingPage';
import { PAGE_SEO } from '../constants/seo';
import { FACEBOOK_HASHTAG_LANDING } from '../constants/hashtagLandingContent';

export default function FacebookHashtagGenerator() {
  return (
    <HashtagLandingPage
      seo={PAGE_SEO.facebookHashtagGenerator}
      hero={FACEBOOK_HASHTAG_LANDING.hero}
      content={FACEBOOK_HASHTAG_LANDING.content}
    />
  );
}
