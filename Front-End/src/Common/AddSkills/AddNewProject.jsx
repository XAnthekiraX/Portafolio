import PropTypes from 'prop-types'
import { useState } from "react"
import { Home, Plus, Upload } from "lucide-react"
import { fakeSkills } from "./FakeSkills"
import { Link } from 'react-router-dom'

export default function AddNewProject({ OnCLickF }) {
    const [projectTitle, setProjectTitle] = useState("")
    const [description, setDescription] = useState("")
    const [technologies, setTechnologies] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [githubLink, setGithubLink] = useState("")
    const [demoLink, setDemoLink] = useState("")
    // const [isSubmitted, setIsSubmitted] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview()
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically handle the form submission,
        // such as adding the project to a database or state
        console.log("New project submitted:", {
            projectTitle,
            description,
            technologies,
            imageFile,
            githubLink,
            demoLink,
        })

    }


    return (
        <section className="absolute z-10 w-screen h-screen px-4 py-16 text-gray-100 bg-gray-900 " >
            <Link to="/" className='absolute top-0 w-16 h-16 m-3'><Home className="w-full h-full text-white aw-16 hover:text-purple-900" /></Link>
            <div className="container max-w-2xl mx-auto">
                <h2 className="mb-8 text-3xl font-bold text-center text-purple-400">Add New Project</h2>
                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="projectTitle" className="block mb-1 text-sm font-medium text-gray-300">
                                Titulo del Projecto
                            </label>
                            <input
                                id="projectTitle"
                                type="text"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                required
                                placeholder="Ingrese titulo del proyecto"
                                className="w-full px-3 py-2 text-white placeholder-gray-400 transition duration-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-300">
                                Descripcion
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="Ingrese una breve descripcion del proyecto"
                                className="w-full px-3 py-2 text-white placeholder-gray-400 transition duration-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-300">
                                Tecnologias
                            </label>
                            <div className='flex'>
                                <select
                                    id="category"
                                    value={technologies}
                                    onChange={(e) => setTechnologies(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 leading-tight text-gray-300 transition-colors duration-300 bg-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-purple-500"
                                >
                                    <option value="">Tecnologias</option>
                                    {
                                        fakeSkills.map((skill, index) => (

                                            <option value={index} key={index}>{skill.name}</option>
                                        )
                                        )
                                    }
                                </select>
                                <div className='flex items-center justify-center w-10 leading-tight text-gray-300 transition-colors duration-300 bg-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-purple-500' onClick={OnCLickF}>
                                    <Plus />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="projectImage" className="block mb-1 text-sm font-medium text-gray-300">
                                Project Image
                            </label>
                            <div className="flex items-center mt-1 space-x-4">
                                <input
                                    id="projectImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("projectImage")?.click()}
                                    className="flex items-center px-4 py-2 text-white transition duration-200 bg-gray-700 rounded-md hover:bg-gray-600"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Image
                                </button>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Project preview" className="object-cover w-16 h-16 rounded" />
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="githubLink" className="block mb-1 text-sm font-medium text-gray-300">
                                GitHub Repository Link
                            </label>
                            <input
                                id="githubLink"
                                type="url"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                                placeholder="https://github.com/yourusername/your-repo"
                                className="w-full px-3 py-2 text-white placeholder-gray-400 transition duration-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="demoLink" className="block mb-1 text-sm font-medium text-gray-300">
                                Live Demo Link
                            </label>
                            <input
                                id="demoLink"
                                type="url"
                                value={demoLink}
                                onChange={(e) => setDemoLink(e.target.value)}
                                placeholder="https://your-project-demo.com"
                                className="w-full px-3 py-2 text-white placeholder-gray-400 transition duration-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white transition duration-300 transform bg-purple-600 rounded hover:bg-purple-700 hover:scale-105 active:scale-95"
                            >
                                Add Project
                            </button>
                        </div>
                    </form>
                </div>
                {/* {isSubmitted && (
                    <div className="p-4 mt-6 text-white bg-purple-600 rounded-md animate-fade-in-down">
                        <p className="font-bold">Success</p>
                        <p>Your project has been successfully added to the portfolio.</p>
                    </div>
                )} */}
            </div>
        </section>
    )
}





AddNewProject.propTypes = {
    OnCLickF: PropTypes.func,
}


