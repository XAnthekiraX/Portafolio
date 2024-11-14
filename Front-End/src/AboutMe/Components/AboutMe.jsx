import avatar from "../../Images/avatar.webp"
import { useState } from "react"
import { motion } from "framer-motion"
import PropTypes from 'prop-types'
import Avatar from "../Common/Avatar"
import Name from "../Common/Name"
import Profession from "../Common/Profession"
import Presentation from "../Common/Presentation"
import SocialLinks from "../Common/SocialLinks"
import ActionButton from "../Common/ActionButton"

export default function AboutMe({ name, profession, presentation, accionButton, loadCategoryF }) {
    const [isAnimating, setIsAnimating] = useState(false)

    const handleViewPortfolio = () => {
        setIsAnimating(true)
    }

    return (
        <motion.section
            className="z-[9] absolute flex items-center  justify-center w-screen h-screen min-h-screen overflow-hidden text-gray-100 bg-gray-900 select-none"
            animate={isAnimating ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="container px-4 py-16 mx-auto">
                <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
                    <Avatar avatar={avatar} />
                    <Name name={name} />
                    <Profession profession={profession} />
                    <Presentation presentation={presentation} />
                    <SocialLinks />
                    <ActionButton onClick={handleViewPortfolio} label={accionButton} categoryLoad={loadCategoryF}/>
                </div>
            </div>
        </motion.section>
    )
}
AboutMe.propTypes = {
    name: PropTypes.string,
    presentation: PropTypes.string,
    accionButton: PropTypes.string,
    profession: PropTypes.string,
    loadCategoryF: PropTypes.func,
}