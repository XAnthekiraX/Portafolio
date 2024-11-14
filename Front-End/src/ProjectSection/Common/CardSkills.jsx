import { useState } from 'react'
import { motion } from "framer-motion"
import PropTypes from 'prop-types'

export default function CardSkills({ image, title, description, techStack, link , language }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className="relative flex items-center justify-center w-full h-auto overflow-hidden rounded-lg shadow-lg animation "
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <img
                src={image}
                alt={title}
                width={600}
                height={800}
                className="flex items-center justify-center object-cover w-full h-auto "
            />
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-start h-auto p-6 overflow-y-auto bg-gray-900 lg:justify-center bg-opacity-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <h3 className="mb-2 text-lg font-bold text-purple-400 lg:text-xl">{title}</h3>
                <p className="mb-4 text-sm text-gray-300 lg:text-lg">{description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {techStack.map((tech) => (
                        <span key={tech} className="px-2 py-1 text-sm text-purple-100 bg-purple-700 rounded">
                            {tech}
                        </span>
                    ))}
                </div>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-[50%] px-4 py-2 font-bold text-center text-sm text-white transition-colors duration-300 bg-purple-600 rounded hover:bg-purple-700"
                >
                {language =="esp" ? "Ver" : "View"}
                </a>
            </motion.div>
        </motion.div>
    )
}

CardSkills.propTypes={
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    techStack: PropTypes.array,
    link: PropTypes.string,
    language: PropTypes.string
}