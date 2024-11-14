// CategorySelect.js
import PropTypes from 'prop-types'
import { Plus } from 'lucide-react'
import { fakeCategories } from './FakeCategories'

export function CategorySelect({ category, setCategory, OnCLickF }) {
    return (
        <div className="mb-4">
            <label htmlFor="category" className="block mb-2 text-sm font-bold text-gray-300">
                Category
            </label>
            <div className="flex gap-1">
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-3 py-2 leading-tight text-gray-300 transition-colors duration-300 bg-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-purple-500"
                >
                    <option value="">Tecnologias</option>
                    {fakeCategories.map((skill) => (
                        <option value={skill.value} key={skill.value}>{skill.name}</option>
                    ))}
                </select>
                <div className="flex items-center justify-center w-10 text-white bg-gray-700 border rounded cursor-pointer hover:border-purple-500" onClick={OnCLickF}>
                    <Plus  />
                </div>
            </div>
        </div>
    )
}

CategorySelect.propTypes = {
    category: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired,
    OnCLickF: PropTypes.func.isRequired,
}
