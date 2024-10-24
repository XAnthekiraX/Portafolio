import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'

export default function Circle({ children }) {

    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Función que actualiza la posición del cursor
    const handleMouseMove = (event) => {
        setPosition({
            x: event.clientX,
            y: event.clientY,
        });
    };


    // Efecto para añadir el evento de movimiento del mouse
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        // Limpieza del evento cuando el componente se desmonta
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="w-screen h-full overflow-hidden overflow-x-hidden overflow-y-auto bg-transparent">
            <div
                className="absolute w-0 h-0 opacity-0 lg:opacity-100 rounded-full bg-transparent shadow-[0_0_800px_100px_rgba(168,85,247,0.7)] pointer-events-none transition-transform duration-100 ease-out"
                style={{
                    transform: `translate(${position.x - 0}px, ${position.y - 0}px)`,
                }}
            ></div>
            <div className='w-screen h-auto opacity-80' >
                {
                    children
                }
            </div>

        </div>
    )
}

Circle.propTypes = {
    children: PropTypes.element
}