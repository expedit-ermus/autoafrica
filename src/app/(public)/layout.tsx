import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 overflow-x-hidden relative">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
