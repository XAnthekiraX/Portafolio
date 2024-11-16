import { useState } from "react";
import AddNewProject from "../AddNewProject/Components/AddNewProject";
import AddNewSkill from "../AddNewSkill/Components/AddNewSkill";

export default function SkillAndProject() {

    const [visibleTech, setVisibleTech] = useState(false)

    const changeCardTech = () => {
        setVisibleTech(prevState => !prevState)
    }

    return (
        <div className="relative flex w-screen h-screen overflow-y-auto">
            <AddNewProject OnClickF={changeCardTech} bool={visibleTech} />
            <AddNewSkill visibleTech={visibleTech} OnCLickF={changeCardTech} />
            
        </div>

    )
}
