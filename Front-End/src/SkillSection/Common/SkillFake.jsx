import { Code, Server, Smartphone, Wrench } from "lucide-react"

export const skillCategories = [
    {
        name: "Front-End",
        name_esp: "Front-End",
        icon: <Code className="w-6 h-6" />,
        skills: [
            { name: "HTML", proficiency: 90 },
            { name: "CSS", proficiency: 85 },
            { name: "JavaScript", proficiency: 88 },
            { name: "React", proficiency: 82 },
            { name: "Vue.js", proficiency: 75 },
        ],
    },
    {
        name: "Back-End",
        name_esp: "Back-End",
        icon: <Server className="w-6 h-6" />,
        skills: [
            { name: "Node.js", proficiency: 80 },
            { name: "Python", proficiency: 75 },
            { name: "Java", proficiency: 70 },
            { name: "SQL", proficiency: 85 },
            { name: "GraphQL", proficiency: 72 },
        ],
    },
    {
        name: "Mobile Development",
        name_esp: "Desarrollo Mobil",
        icon: <Smartphone className="w-6 h-6" />,
        skills: [
            { name: "React Native", proficiency: 78 },
            { name: "Flutter", proficiency: 70 },
            { name: "iOS (Swift)", proficiency: 65 },
        ],
    },
    {
        name: "Tools/Technologies",
        name_esp: "Herramientas/Tecnologias",
        icon: <Wrench className="w-6 h-6" />,
        skills: [
            { name: "Git", proficiency: 88 },
            { name: "Docker", proficiency: 75 },
            { name: "AWS", proficiency: 70 },
        ],
    },
]
