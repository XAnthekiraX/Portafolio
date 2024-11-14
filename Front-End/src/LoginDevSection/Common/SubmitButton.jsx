import { motion } from "framer-motion";

export default function SubmitButton() {
    return (
        <div className="flex items-center justify-between">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
            >
                <button
                    type="submit"
                    className="w-full p-4 text-xl font-bold text-white transition-colors duration-300 bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline"
                >
                    Ingresar
                </button>
            </motion.div>
        </div>
    );
}
