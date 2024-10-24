import { useState } from "react";
import AddNewProject from "../Common/AddSkills/AddNewProject";
import AddNewSkill from "../Common/AddSkills/AddNewSkill";


export default function SkillAndProject() {

    const [visibleTech, setVisibleTech] = useState(false)

    const changeCardTech = () => {
        setVisibleTech(prevState => !prevState)
    }

    console.log(visibleTech)
    return (
        <div className="relative w-screen h-screen overflow-y-auto ">
            <AddNewProject OnCLickF={changeCardTech} bool={visibleTech} />
            <AddNewSkill visibleTech={visibleTech} OnCLickF={changeCardTech} />
        </div>

    )
}
