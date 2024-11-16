import PropTypes from 'prop-types'
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";

export default function Button({ text, onClick, color, icon }) {
    const IconComponent = icon === "X" ? X : Save;
    const bgColor = color === "gray" ? "bg-gray-600 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700";
    const ringColor = color === "gray" ? "focus:ring-gray-500" : "focus:ring-purple-500";

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex items-center px-4 py-2 text-white transition duration-200 rounded-md ${bgColor} focus:outline-none focus:ring-2 ${ringColor}`}
        >
            <IconComponent className="w-4 h-4 mr-2" />
            {text}
        </motion.button>
    );
}


Button.propTypes={
    text: PropTypes.string,
    onClick: PropTypes.func,
    color: PropTypes.string,
    icon: PropTypes.string,
}