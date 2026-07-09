import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Platforms from './pages/Platforms';
import HashtagGenerator from './pages/HashtagGenerator';
import StylishTextGenerator from './pages/StylishTextGenerator';
import TiktokHashtagGenerator from './pages/TiktokHashtagGenerator';
import InstagramHashtagGenerator from './pages/InstagramHashtagGenerator';
import YoutubeHashtagGenerator from './pages/YoutubeHashtagGenerator';
import FacebookHashtagGenerator from './pages/FacebookHashtagGenerator';
import InstagramReelsDownloader from './pages/InstagramReelsDownloader';
import YoutubeVideoDownloader from './pages/YoutubeVideoDownloader';
import TiktokVideoDownloader from './pages/TiktokVideoDownloader';
import InstagramVideoDownloader from './pages/InstagramVideoDownloader';
import FacebookVideoDownloader from './pages/FacebookVideoDownloader';
import DownloadGuide from './pages/DownloadGuide';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import Dmca from './pages/Dmca';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/hashtag-generator" element={<HashtagGenerator />} />
        <Route path="/stylish-text-generator" element={<StylishTextGenerator />} />
        <Route path="/tiktok-hashtag-generator" element={<TiktokHashtagGenerator />} />
        <Route path="/instagram-hashtag-generator" element={<InstagramHashtagGenerator />} />
        <Route path="/youtube-hashtag-generator" element={<YoutubeHashtagGenerator />} />
        <Route path="/facebook-hashtag-generator" element={<FacebookHashtagGenerator />} />
        <Route path="/instagram-reels-downloader" element={<InstagramReelsDownloader />} />
        <Route path="/youtube-video-downloader" element={<YoutubeVideoDownloader />} />
        <Route path="/tiktok-video-downloader" element={<TiktokVideoDownloader />} />
        <Route path="/instagram-video-downloader" element={<InstagramVideoDownloader />} />
        <Route path="/facebook-video-downloader" element={<FacebookVideoDownloader />} />
        <Route path="/download-guide" element={<DownloadGuide />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-and-conditions" element={<Terms />} />
        <Route path="/dmca" element={<Dmca />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
