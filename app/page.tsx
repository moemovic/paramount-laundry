import Booking from "@/components/Booking";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Faq, HoursCard } from "@/components/Interactive";
import { About, Cta, Footer, Header, Hero, HowItWorks, Services, VisitCopy } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Booking />
        <About />
        <section id="visit" className="section" style={{ paddingTop: 104, paddingBottom: 104 }}>
          <div className="container visit-grid">
            <VisitCopy />
            <HoursCard />
          </div>
        </section>
        <Faq />
        <Cta />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
