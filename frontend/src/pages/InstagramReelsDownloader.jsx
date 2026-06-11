import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import PageHero from '../components/PageHero';
import DownloaderForm from '../components/DownloaderForm';
import HashtagSeoSections from '../components/HashtagSeoSections';
import { PAGE_SEO } from '../constants/seo';
import { INSTAGRAM_REELS_DOWNLOADER } from '../constants/instagramReelsDownloaderContent';
import { webApplicationSchema, faqPageSchema } from '../constants/structuredData';
import '../components/SeoProse.css';
import '../components/HashtagLanding.css';
import './FAQ.css';

export default function InstagramReelsDownloader() {
  const seo = PAGE_SEO.instagramReelsDownloader;
  const { hero, content, disclaimer } = INSTAGRAM_REELS_DOWNLOADER;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <JsonLd
        data={[webApplicationSchema, faqPageSchema(content.faq)]}
      />
      <PageHero title={hero.title} subtitle={hero.subtitle} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <DownloaderForm />
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose card seo-content hashtag-landing-prose">
          <HashtagSeoSections
            {...content}
            disclaimer={disclaimer}
            showBottomCta={false}
          />
        </div>
      </section>
    </>
  );
}
