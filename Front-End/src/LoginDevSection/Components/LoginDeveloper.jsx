import { motion } from "framer-motion";
import LoginForm from "../Common/LoginForm";

export default function LoginDeveloper() {
    return (
        <div className="flex items-center justify-center w-screen h-screen p-4 bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-auto sm:w-8/12 xl:w-4/12"
            >
                <LoginForm/>
            </motion.div>
        </div>
    );
}
