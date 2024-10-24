import { motion } from 'framer-motion'
import { useState } from 'react'
import PropTypes from 'prop-types'


export default function Skillbar({ skillName, skillLevel }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">{skillName}</span>
                <span className="text-sm font-medium text-gray-300">{skillLevel}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                    className="bg-gradient-to-r from-purple-600 to-pink-500 h-2.5 rounded-full"
                    style={{ width: `${skillLevel}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skillLevel}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
            {isHovered && (
                <motion.div
                    className="absolute left-0 px-2 py-1 text-xs text-white bg-gray-700 rounded -top-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {skillLevel}% proficiency
                </motion.div>
            )}
        </div>
    )
}

Skillbar.propTypes = {
    skillName: PropTypes.string.isRequired,
    skillLevel: PropTypes.number.isRequired
}
