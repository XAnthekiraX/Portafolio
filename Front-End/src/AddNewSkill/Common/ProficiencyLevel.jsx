// ProficiencyLevel.js
import PropTypes from 'prop-types'
import { proficiencyOptions } from './ProficienciLevelValues'


export function ProficiencyLevel({ proficiencyText, setProficiencyText }) {
    return (
        <div className="mb-6">
            <label htmlFor="proficiency" className="flex items-center mb-2 text-sm font-bold text-gray-300">
            </label>
            <select
                value={proficiencyText}
                onChange={(e) => setProficiencyText(e.target.value)}
                className="w-full px-3 py-2 mt-2 leading-tight text-gray-300 transition-colors duration-300 bg-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-purple-500"
            >
                {proficiencyOptions.map((option, index) => (
                    <option key={index} value={option.value}>{option.name}</option>
                ))}
            </select>
        </div>
    )
}

ProficiencyLevel.propTypes = {
    proficiencyText: PropTypes.string.isRequired,
    setProficiencyText: PropTypes.func.isRequired,
}
