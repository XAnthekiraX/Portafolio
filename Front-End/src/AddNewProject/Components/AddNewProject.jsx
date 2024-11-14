import { useState } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { ProjectTitleInput } from '../Common/ProjectTitleInput';
import DescriptionTextarea from '../Common/DescriptionTextarea';
import { TechnologiesSelect } from '../Common/TechnologiesSelect';
import { ImageUploader } from '../Common/ImageUploader';
import { LinkInput } from '../Common/LinkInput';
import { SubmitButton } from '../Common/SubmitButton';
import { Home } from 'lucide-react';

export default function AddNewProject({ OnClickF }) {
    const [projectTitle, setProjectTitle] = useState('');
    const [projectTitleEng, setProjectTitleEng] = useState('');
    const [description, setDescription] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [githubLink, setGithubLink] = useState('');
    const [demoLink, setDemoLink] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(file); // Guarda el archivo seleccionado en el estado 'imageFile'
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Genera una vista previa de la imagen
            };
            reader.readAsDataURL(file); // Lee el archivo de imagen como URL de datos
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita la recarga de página

        // Imprime en la consola los datos del proyecto que se van a enviar o guardar
        console.log("New project submitted:", {
            projectTitle,
            description,
            technologies,
            imagePreview,
            githubLink,
            demoLink,
        });

        // Aquí es donde se debería manejar el envío de datos, 
        // como guardarlos en una base de datos o enviarlos a un servidor
    }


    return (
        <section className="absolute z-10 w-screen h-screen px-4 py-16 text-gray-100 bg-gray-900">
            <Link to="/" className="absolute top-0 w-16 h-16 m-3"><Home /> </Link>
            <div className="container max-w-2xl mx-auto">
                <h2 className="mb-8 text-3xl font-bold text-center text-purple-400">Add New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
                        <ProjectTitleInput value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} labelText={"Titulo del Proyecto"} placeHolder={"Ingrese el titulo del proyecto"} />
                        <ProjectTitleInput value={projectTitleEng} onChange={(e) => setProjectTitleEng(e.target.value)} labelText={"Titulo en Ingles"} placeHolder={"Titulo en Ingles"}/>
                    </div>
                    <DescriptionTextarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    <TechnologiesSelect value={technologies} onChange={(e) => setTechnologies(e.target.value)} onAddClick={OnClickF} />
                    <ImageUploader onImageChange={handleImageChange} imagePreview={imagePreview} />
                    <LinkInput id="githubLink" label="GitHub Repository Link" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="https://github.com/yourusername/your-repo" />
                    <LinkInput id="demoLink" label="Live Demo Link" value={demoLink} onChange={(e) => setDemoLink(e.target.value)} placeholder="https://your-project-demo.com" />
                    <SubmitButton label="Add Project" />
                </form>
            </div>
        </section>
    );
}


AddNewProject.propTypes = {
    OnClickF: PropTypes.func,
}