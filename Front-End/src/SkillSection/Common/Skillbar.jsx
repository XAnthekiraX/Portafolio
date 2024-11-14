import { motion } from 'framer-motion'
import PropTypes from 'prop-types'


export default function Skillbar({ skillName, skillLevel, language }) {
    const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Proficient", "Expert"]
    const proficiencyLevelsEs = ["Principiante", "Intermedio", "Avanzado", "Competente", "Experto"];
    const proficiencyIndex = proficiencyLevels.indexOf(skillLevel)

    // Función para traducir el nivel de habilidad si el idioma es español
    const getTranslatedSkillLevel = () => {
        if (language === "esp") {
            return proficiencyLevelsEs[proficiencyIndex] || skillLevel;
        }
        return skillLevel;
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">{skillName}</span>
                <span className="text-sm font-medium text-purple-400">{getTranslatedSkillLevel()}</span>
            </div>
            <div className="flex space-x-1">
                {proficiencyLevels.map((level, index) => (
                    <motion.div
                        key={level}
                        className={`h-2 w-full rounded-full ${index <= proficiencyIndex ? "bg-purple-600" : "bg-gray-700"
                            }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                ))}
            </div>
        </div>
    )
}

Skillbar.propTypes = {
    skillName: PropTypes.string.isRequired,
    skillLevel: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
}
