import { useState } from 'react';
import eng from '../language/eng';
import esp from '../language/esp';
import SelectLanguage from '../Common/SelectLanguage';
import AboutMe from '../Components/AboutMe';
import ProjectSection from '../Components/ProjectSection';
import SkillsSection from '../Components/SkillsSection';
import ContactSection from '../Components/ContactSection';
import Footer from '../Components/Footer';
import Circle from '../Common/Circle';

export default function PageInitial() {
    const [language, setLanguage] = useState('esp'); // Idioma por defecto

    const translations = {
        eng, esp
    };



    const t = translations[language]

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value); // Cambiar el idioma según la opción seleccionada
    };
    return (
        <div className='relative grid content-center w-screen h-screen grid-cols-1 overflow-hidden ' >
            <SelectLanguage onChangeF={handleLanguageChange} value={language} txtEng={t.leng} txtEsp={t.lesp} />
            <AboutMe name={t.name} presentation={t.presentation} accionButton={t.accionButton} profession={t.profession} />
            <Circle>
                <SkillsSection language={language} />
                <ProjectSection language={language} />
                <ContactSection language={language} />
                <Footer language={language} />
            </Circle>
        </div>
    )
}
