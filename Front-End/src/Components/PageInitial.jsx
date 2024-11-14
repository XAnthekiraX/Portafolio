import { useState } from 'react';
import eng from '../language/eng';
import esp from '../language/esp';
import SelectLanguage from '../SelectLanguageOption/SelectLanguage';
import AboutMe from '../AboutMe/Components/AboutMe';
import ProjectSection from '../ProjectSection/Components/ProjectSection';
import SkillsSection from '../SkillSection/Components/SkillsSection';
import Footer from '../FooterSection/Footer';
import Circle from '../Layout/Circle';
import ContactSection from '../ContactSection/Components/ContactSection';

export default function PageInitial() {
    const [language, setLanguage] = useState('esp'); // Idioma por defecto
    const [loadCategory, setLoadCategory] = useState(false);

    const translations = {
        eng, esp
    };

    const toggleLoadCategory = () => {
        setLoadCategory(true);
    }
    const t = translations[language]

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value); // Cambiar el idioma según la opción seleccionada
    };
    return (
        <div className='relative grid content-center w-screen h-screen grid-cols-1 overflow-hidden ' >
            <SelectLanguage onChangeF={handleLanguageChange} value={language} txtEng={t.leng} txtEsp={t.lesp} />
            <AboutMe name={t.name} presentation={t.presentation} accionButton={t.accionButton} profession={t.profession} loadCategoryF={toggleLoadCategory} />
            <Circle>
                <SkillsSection language={language} loadCategory={loadCategory} />
                <ProjectSection language={language} />
                <ContactSection language={language} />
                <Footer language={language} />
            </Circle>
        </div>
    )
}
