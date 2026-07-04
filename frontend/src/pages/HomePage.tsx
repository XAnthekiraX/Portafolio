import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Technologies } from "../components/Technologies";
import { Projects } from "../components/Projects";
import { Education } from "../components/Education";
import { Services } from "../components/Services";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Technologies />
      <Projects />
      <Education />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
