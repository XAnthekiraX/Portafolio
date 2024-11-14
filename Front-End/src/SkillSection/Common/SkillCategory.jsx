import Skillbar from './Skillbar'
import PropTypes from 'prop-types'

export default function SkillCategory({ categoryName, categoryNameEsp , categoryIcon, categorySkills, entermouse, language }) {
        
    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg animation">
            <div className="flex items-center justify-center mb-4">
                {categoryIcon}
                <h3 className="flex flex-wrap justify-center ml-2 text-purple-400 xl:text-xl ">{language == "esp" ? categoryNameEsp : categoryName}</h3>
            </div>
            <div className="space-y-4">
                {categorySkills.map((skill) => (
                    entermouse ? <Skillbar key={skill.name} skillName={skill.name} skillLevel={skill.proficiency} language={language} /> : <h1 key={skill.name}></h1>
                ))}
            </div>
        </div>
    )
}

SkillCategory.propTypes = {
    categoryName: PropTypes.string,
    categoryNameEsp: PropTypes.string,
    categoryIcon: PropTypes.element,
    categorySkills: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            proficiency: PropTypes.string
        })
    ),
    entermouse: PropTypes.bool,
    language: PropTypes.string
}
