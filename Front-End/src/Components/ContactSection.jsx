import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
export default function ContactSection({language}) {


    function languageFunc(textEsp, textEng) {
        if (language ==="esp") {
            return textEsp
        }else{
            return textEng
        }
    }

    return (
        <section id='Contact' className="flex items-center justify-center w-screen h-screen text-gray-100 animation">
            <div className="container max-w-2xl mx-auto">
                <h2 className="mb-12 text-4xl font-bold text-center text-purple-500">{languageFunc("Contactame", "Contact Me")}</h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-300">
                            {languageFunc("Nombre", "Name")}
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder={languageFunc("Tu nombre", "Your name")}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-300">
                            {languageFunc("Correo", "Email")}
                        </label>
                        <input
                            type="email"
                            id="email"

                            className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder={languageFunc("tu@correo.com","your@email.com")}
                        />

                    </div>
                    <div>
                        <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-300">
                            {languageFunc("Mensaje", "Message")}
                        </label>
                        <textarea
                            id="message"

                            rows={4}
                            className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder={languageFunc("Tu mensaje", "Your message")}
                        ></textarea>
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full px-6 py-3 font-semibold text-white transition duration-300 ease-in-out bg-purple-600 rounded-md"
                        whileHover={{ backgroundColor: "#9333ea" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {languageFunc("Enviar Mensaje", "Send Message")}
                    </motion.button>

                </form>
            </div>
        </section>
    )
}

ContactSection.propTypes={
    language: PropTypes.string
}