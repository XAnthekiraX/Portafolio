// AddNewSkill.js
import { useState } from 'react'
import PropTypes from 'prop-types'
import { SkillNameInput } from '../Common/SkillNameInput'
import { CategorySelect } from '../Common/CategorySelect'
import { ProficiencyLevel } from '../Common/ProficiencyLevel'
import { ActionButtons } from '../Common/ActionButtons'
import AddCategoryCard from '../../AddNewCategory/Components/AddCategoryCard'

export default function AddNewSkill({ visibleTech, OnCLickF }) {
  const [skillName, setSkillName] = useState("")
  const [category, setCategory] = useState("")
  const [proficiencyText, setProficiencyText] = useState("Básico")
  const [visibleCard, setVisibleCard] = useState(false)

  const handleChangeCard =()=>{
    setVisibleCard(prevState =>!prevState)

    console.log(visibleCard )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataSkills = [skillName, category, proficiencyText]
    console.log(dataSkills);
    OnCLickF();
    clearValueSkills();
  }

  const clearValueSkills = () => {
    setSkillName("")
    setCategory("")
    setProficiencyText("")
  }

  return (
    <div className={`relative flex items-center justify-center w-screen h-screen p-4 bg-gray-900 bg-opacity-70 ${visibleTech ? 'z-[10]' : 'z-[9]'}`}>
      <form onSubmit={handleSubmit} className="w-full px-8 pt-6 pb-8 mb-4 bg-gray-800 rounded-lg shadow-md lg:w-5/12">
        <h2 className="mb-6 text-3xl font-bold text-center text-purple-400">Add New Skill</h2>

        <SkillNameInput skillName={skillName} setSkillName={setSkillName} />
        <CategorySelect category={category} setCategory={setCategory} OnCLickF={handleChangeCard} />
        <AddCategoryCard changeVisibleCard={handleChangeCard} visibleCard={visibleCard}/>
        <ProficiencyLevel proficiencyText={proficiencyText} setProficiencyText={setProficiencyText} />
        <ActionButtons handleSubmit={handleSubmit} OnCLickF={OnCLickF} ClearFunc={clearValueSkills}/>
      </form>
    </div>
  )
}

AddNewSkill.propTypes = {
  visibleTech: PropTypes.bool,
  OnCLickF: PropTypes.func,
}
