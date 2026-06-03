import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import { PAGE_SEO } from '../constants/seo';
import '../components/SeoProse.css';

export default function About() {
  const seo = PAGE_SEO.about;

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} noSuffix />
      <PageHero
        title="About FityVid"
        subtitle="A simple online video downloader and hashtag tool for creators."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose card seo-content">
          <p>
            FityVid is a lightweight website that helps users download publicly accessible
            videos from YouTube, TikTok, Instagram, and Facebook, and generate hashtags for
            social media content.
          </p>
          <p>
            Our goal is to offer a clean, fast experience with HD download options when
            available, clear file size information, and a free hashtag generator for posts,
            reels, and shorts.
          </p>
          <p>
            FityVid only supports publicly accessible content. Please download only your own
            content or content you have permission to use. FityVid is not affiliated with
            YouTube, TikTok, Instagram, Facebook, Google, ByteDance, or Meta.
          </p>
          <p>
            <Link to="/how-it-works">How it works</Link> ·{' '}
            <Link to="/contact">Contact us</Link>
          </p>
        </div>
      </section>
    </>
  );
}
