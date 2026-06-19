import Navbar from './Navbar';
import Footer from './Footer';
import AdsterraPopunder from './AdsterraPopunder';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
      <AdsterraPopunder />
    </>
  );
}
