import { Hero } from "../../components/Hero"
import { About } from "../../components/About"
import { Skills } from "../../components/Skills"
import { Technologies } from "../../components/Technologies"
import { Projects } from "../../components/Projects"
import { Education } from "../../components/Education"
import { Services } from "../../components/Services"
import { Contact } from "../../components/Contact"

export function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Technologies />
      <Projects />
      <Education />
      <Services />
      <Contact />
    </div>
  )
}
