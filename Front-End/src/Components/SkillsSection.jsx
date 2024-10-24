import { useState } from "react";
import SkillCategory from "../Common/SkillSection/SkillCategory";
import { skillCategories } from '../Common/SkillSection/SkillFake';
import PropTypes from 'prop-types'

export default function SkillsSection({ language }) {

    const [loadCategory, setLoadCategory] = useState(false);

    const toggleLoadCategory = () => {
        setLoadCategory(true);
    }

    return (

        <section id="Skills" className="w-screen h-screen px-4 py-16 text-gray-100 animation" onMouseEnter={toggleLoadCategory} >
            <div className="container mx-auto">
                <h2 className="mb-12 text-4xl font-bold text-center text-purple-500">{language == "esp" ? "Habilidades" : "Skills"}</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {skillCategories.map((category, key) => (
                        <SkillCategory
                            key={key}
                            categoryName={category.name}
                            categoryNameEsp={category.name_esp}
                            categoryIcon={category.icon}
                            categorySkills={category.skills}
                            entermouse={loadCategory}
                            language={language}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

SkillsSection.propTypes = {
    language: PropTypes.string
}
