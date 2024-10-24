// import React from 'react'
import PropTypes from 'prop-types'
import CardSkills from '../Common/ProjectSection/CardSkills'
import {projects} from "../Common/ProjectSection/ProjectFake"

export default function ProjectSection({language}) {

    return (
        <section id='Project'  className="w-screen h-screen px-4 py-16 text-gray-100animation">
            <div className="container mx-auto">
                <h2 className="mb-12 text-4xl font-bold text-center text-purple-500">{language=="esp" ? "Proyectos destacados" : "Featured Projects"}</h2>
                <div  className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, key) => (
                        <CardSkills
                            key={key}
                            title={language =="esp" ? project.title_es : project.title}
                            description={language=="esp" ? project.description_es : project.description}
                            image={project.image}
                            techStack={project.techStack}
                            link={project.link}
                            language={language}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

ProjectSection.propTypes = {
    language: PropTypes.string,
}
