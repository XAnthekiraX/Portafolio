"use client"
import avatar from "../Images/avatar.webp"
import { useState } from "react"
import { Github, Linkedin} from "lucide-react"
import { motion } from "framer-motion"
import PropTypes from 'prop-types'

export default function AboutMe({name,presentation,accionButton,profession}) {
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
                    <div className="mb-8">
                        <div className="relative w-40 h-40 mx-auto overflow-hidden transition-transform duration-300 ease-in-out border-4 border-purple-800 rounded-full shadow-lg sm:w-52 sm:h-52 hover:scale-105">
                            <img
                                src={avatar}
                                alt="Jane Doe"
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <h1 className="mb-2 text-xl font-bold text-purple-500 transition-all duration-300 ease-in-out sm:text-4xl md:text-5xl hover:text-purple-400">
                        {name}
                    </h1>
                    <h2 className="mb-6 text-lg font-semibold text-gray-300 sm:text-2xl md:text-3xl">{profession}</h2>
                    <p className="mb-8 text-sm leading-relaxed text-gray-400 sm:text-lg xl:text-xl  sm:w-[70%]">
                        {presentation}.
                    </p>
                    <div className="flex justify-center mb-8 space-x-6">
                        <a
                            href="https://github.com/XAnthekiraX"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors duration-300 hover:text-purple-500"
                        >
                            <Github className="w-6 h-6" />
                            <span className="sr-only">GitHub</span>
                        </a>
                        <a
                            href="https://linkedin.com/in/janedoe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors duration-300 hover:text-purple-500"
                        >
                            <Linkedin className="w-6 h-6" />
                            <span className="sr-only">LinkedIn</span>
                        </a>
                    </div>
                    <button
                        onClick={handleViewPortfolio}
                        className="px-4 py-2 text-sm font-bold text-white transition-colors duration-300 bg-purple-600 rounded sm:text-lg hover:bg-purple-700"
                    >
                        {accionButton}
                    </button>
                </div>
            </div>
        </motion.section>
    )
}
AboutMe.propTypes={
    name:PropTypes.string,
    presentation:PropTypes.string,
    accionButton:PropTypes.string,
    profession:PropTypes.string,
}