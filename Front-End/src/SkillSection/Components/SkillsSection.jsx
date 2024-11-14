import SkillCategory from "../Common/SkillCategory";
import { skillCategories } from '../FakeDatas/FakeSkills';
import PropTypes from 'prop-types'

export default function SkillsSection({ language, loadCategory }) {

    

    
    return (

        <section id="Skills" className="relative flex items-center justify-center w-screen h-auto p-4 text-gray-100 animation" >
            <div className="container flex flex-col w-full h-auto">
                <h2 className="pt-10 mb-12 text-4xl font-bold text-center text-purple-500 xl:pt-0 lg:pt-8">{language == "esp" ? "Habilidades" : "Skills"}</h2>
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
    language: PropTypes.string,
    loadCategory: PropTypes.bool,
}
