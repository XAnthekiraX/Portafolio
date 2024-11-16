import PropTypes from 'prop-types';
import { Plus } from "lucide-react";
import { fakeSkills } from "./FakeSkills";

export function TechnologiesSelect({ value, onChange, onAddClick }) {
    return (
        <div>
            <label htmlFor="technologies" className="block mb-1 text-sm font-medium text-gray-300">
                Tecnologias
            </label>
            <div className="flex gap-1">
                <select
                    id="technologies"
                    value={value}
                    onChange={onChange}
                    required
                    className="w-full px-3 py-2 text-gray-300 bg-gray-700 rounded-md hover:border focus:outline-none focus:border-purple-500"
                >
                    <option value="">Tecnologias</option>
                    {fakeSkills.map((skill, index) => (
                        <option value={skill.name} key={index}>{skill.name}</option>
                    ))}
                </select>
                <button type="button" className="flex items-center justify-center w-10 h-10 text-gray-300 bg-gray-700 border-purple-500 rounded hover:border" onClick={onAddClick}>
                    <Plus />
                </button>
            </div>
        </div>
    );
}

TechnologiesSelect.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
};

