import Navbar from './Navbar';
import Footer from './Footer';
import AdsterraBanner from './AdsterraBanner';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <AdsterraBanner />
      <Footer />
    </>
  );
}
