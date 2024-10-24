import { useState } from 'react'
import { Code, Briefcase, Menu, X, Phone } from "lucide-react"
import { motion } from 'framer-motion'
export default function Navigator() {
    const [isOpen, setIsOpen] = useState(false)


    const navItems = [
        { name: "Skills", href: "#Skills", icon: <Code/> },
        { name: "Projects", href: "#Project", icon: <Briefcase/> },
        { name: "Contact", href: "#Contact", icon: <Phone/> },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-[5] text-gray-100 bg-gray-900">
            <div className="container px-4 mx-auto ">
                <div className="flex items-center justify-between h-16 ">
                    <a href="" className="text-xl font-bold text-purple-500" >
                        AB
                    </a>

                    <div className="hidden space-x-4 md:flex">
                        {navItems.map((item) => (
                            <div key={item.name} className='flex gap-2 mx-3 group hover:text-purple-800'>
                                {item.icon}
                                <a href={item.href} >{item.name}</a>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hidden px-3 py-2 text-sm font-medium text-gray-300 transition duration-300 rounded-md md:block hover:text-white hover:bg-purple-700"
                    >
                        
                    </button>
                    <button
                        className="text-gray-300 md:hidden hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 md:hidden"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            item.name
                        ))}
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                // Add logout logic here
                            }}
                            className="block w-full px-3 py-2 text-base font-medium text-left text-gray-300 transition duration-300 rounded-md hover:text-white hover:bg-purple-700"
                        >
                            
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    )
}