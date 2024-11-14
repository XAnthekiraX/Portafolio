// SkillNameInput.js
import PropTypes from 'prop-types'
import { Code } from 'lucide-react'

export function SkillNameInput({ skillName, setSkillName }) {
    return (
        <div className="mb-4">
            <label htmlFor="skillName" className="flex items-center mb-2 text-sm font-bold text-gray-300">
                <Code className="w-5 h-5 mr-2 text-purple-400" />
                Skill Name
            </label>
            <input
                type="text"
                id="skillName"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
                className="w-full px-3 py-2 leading-tight text-gray-300 transition-colors duration-300 bg-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-purple-500"
                placeholder="e.g., React, Spring"
            />
        </div>
    )
}

SkillNameInput.propTypes = {
    skillName: PropTypes.string.isRequired,
    setSkillName: PropTypes.func.isRequired,
}
