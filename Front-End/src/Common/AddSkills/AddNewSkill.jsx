import { Ban, Code, Plus, Send, Sliders } from 'lucide-react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import {fakeCategories} from './FakeCategories'

export default function AddNewSkill({ visibleTech, OnCLickF }) {
  const [skillName, setSkillName] = useState("")
  const [category, setCategory] = useState("")
  const [proficiency, setProficiency] = useState(0)


  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataSkills = [skillName, category, proficiency]
    console.log(dataSkills)
    OnCLickF();
  }

  return (
    <div className={`absolute flex items-center justify-center w-screen h-screen p-4 bg-gray-900  bg-opacity-70 ${visibleTech ? 'z-[10]' : 'z-[9]'}`}>
      <form onSubmit={handleSubmit} className="w-full h-auto px-8 pt-6 pb-8 mb-4 bg-gray-800 rounded-lg shadow-md lg:w-5/12">
        <h2 className="mb-6 text-3xl font-bold text-center text-purple-400">Add New Skill</h2>
        <div className="mb-4 ">
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

        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 text-sm font-bold text-gray-300">
            Category
          </label>
          <div className='flex'>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 leading-tight text-gray-300 transition-colors duration-300 bg-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-purple-500"
            >
              <option value="">Tecnologias</option>
              {
                fakeCategories.map((skill, index) => (

                  <option value={index} key={index}>{skill.name}</option>
                )
                )
              }
            </select>
            <div className='flex items-center justify-center w-10 leading-tight text-gray-300 transition-colors duration-300 bg-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-purple-500' onClick={OnCLickF}>
              <Plus />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="proficiency" className="flex items-center mb-2 text-sm font-bold text-gray-300">
            <Sliders className="w-5 h-5 mr-2 text-purple-400" />
            Proficiency Level: {proficiency}%
          </label>
          <input
            type="range"
            id="proficiency"
            min="0"
            max="100"
            value={proficiency}
            onChange={(e) => setProficiency(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className='grid grid-cols-2 gap-5'>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors duration-300 bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline"
            >
              <Send className="w-5 h-5 mr-2" />
              Add Skill
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div
              onClick={OnCLickF}
              type=""
              className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors duration-300 bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline"
            >
              <Ban className="w-5 h-5 mr-2" />
              Add Skill
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}

AddNewSkill.propTypes = {
  visibleTech: PropTypes.bool,
  OnCLickF: PropTypes.func
}