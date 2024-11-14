import { Github, Linkedin } from "lucide-react"; // Asegúrate de importar los iconos correctos

export default function SocialLinks() {
    return (
        <div className="flex justify-center mb-8 space-x-6">
            <a
                href="https://github.com/XAnthekiraX"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors duration-300 hover:text-purple-500"
            >
                <Github className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
            </a>
            <a
                href="https://linkedin.com/in/janedoe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors duration-300 hover:text-purple-500"
            >
                <Linkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
            </a>
        </div>
    );
}

