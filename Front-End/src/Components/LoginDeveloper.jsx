import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";


export default function LoginDeveloper() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [toggleEye, setToggleEye] = useState(false)

    const handleVisibleEye = () => {
        setToggleEye(prevState => !prevState)

        console.log(toggleEye)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically handle the login logic
        console.log("Login attempted with:", { username, password })
    }

    return (
        <div className="flex items-center justify-center w-screen h-screen p-4 bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-auto sm:w-8/12 xl:w-4/12"
            >
                <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-gray-800 rounded-lg shadow-md">
                    <h2 className="mb-6 text-3xl font-bold text-center text-purple-400">Login</h2>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2 text-xl font-bold text-gray-300">
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-4 text-lg text-white bg-gray-700 border-gray-600 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-xl font-bold text-gray-300">
                            Contraseña
                        </label>
                        <div className="relative flex w-full h-full">
                            <input
                                id="password"
                                type={toggleEye ? "password" : "text"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="flex items-center justify-center w-full p-4 text-lg text-white bg-gray-700 border rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                placeholder="Enter your password"
                            />
                            <div className="absolute flex flex-col items-center justify-center w-8 h-8 top-4 end-2" onClick={handleVisibleEye}>
                                {toggleEye ?
                                    <Eye className="absolute" />
                                    :
                                    <EyeOff className="absolute" />
                                }
                            </div>
                        </div>

                    </div>
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
                                Sign In
                            </button>
                        </motion.div>
                    </div>
                    <div className="mt-4 text-center">
                        <a
                            href="#"
                            className="inline-block text-lg font-bold text-purple-400 align-baseline transition-colors duration-300 hover:text-purple-300"
                        >
                            Forgot Password?
                        </a>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
