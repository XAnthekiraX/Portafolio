import { Code, Server, Smartphone, Wrench } from "lucide-react";

export const skillCategories = [
    {
        name: "Front-End",
        name_esp: "Front-End",
        icon: <Code className="w-6 h-6" />,
        skills: [
            { name: "HTML", proficiency: "Expert" },
            { name: "CSS", proficiency: "Proficient" },
            { name: "JavaScript", proficiency: "Proficient" },
            { name: "React", proficiency: "Advanced" },
            { name: "Vue.js", proficiency: "Intermediate" },
        ],
    },
    {
        name: "Back-End",
        name_esp: "Back-End",
        icon: <Server className="w-6 h-6" />,
        skills: [
            { name: "Node.js", proficiency: "Advanced"  },
            { name: "Python", proficiency: "Expert" },
            { name: "Java", proficiency: "Intermediate" },
            { name: "SQL", proficiency: "Proficient" },
            { name: "GraphQL", proficiency: "Intermediate" },
        ],
    },
    {
        name: "Mobile Development",
        name_esp: "Desarrollo Mobile",
        icon: <Smartphone className="w-6 h-6" />,
        skills: [
            { name: "React Native", proficiency: "Advanced" },
            { name: "Flutter", proficiency: "Intermediate" },
            { name: "iOS (Swift)", proficiency: "Beginner" },
            { name: "Android (Kotlin)", proficiency: "Beginner" },
        ],
    },
    {
        name: "Tools/Technologies",
        name_esp: "Herramientas/ Tecnologias",
        icon: <Wrench className="w-6 h-6" />,
        skills: [
            { name: "Git", proficiency: "Proficient" },
            { name: "Docker", proficiency: "Intermediate" },
            { name: "AWS", proficiency: "Intermediate" },
            { name: "CI/CD", proficiency: "Intermediate" },
            { name: "Webpack", proficiency: "Intermediate" },
        ],
    },
]