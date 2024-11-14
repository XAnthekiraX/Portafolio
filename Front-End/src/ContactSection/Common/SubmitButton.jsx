import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import LanguageSwitcher from '../../language/LanguageSwitcher';

export default function SubmitButton({ language }) {
    return (
        <motion.button
            type="submit"
            className="w-full px-6 py-3 font-semibold text-white transition duration-300 ease-in-out bg-purple-600 rounded-md"
            whileHover={{ backgroundColor: "#9333ea" }}
            whileTap={{ scale: 0.95 }}
        >
            <LanguageSwitcher textEsp="Enviar Mensaje" textEng="Send Message" language={language} />
        </motion.button>
    );
}

SubmitButton.propTypes = {
    language: PropTypes.string.isRequired,
};
