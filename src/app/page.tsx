import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from '@/components/StructuredData';

export default function Home() {
  return (
    <div>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <Header />
      <LandingPage />
      <Footer />
    </div>
  );
}
