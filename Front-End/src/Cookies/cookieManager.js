// cookies.js
import Cookies from 'js-cookie';

// Establecer una cookie
export const setGlobalVariable = (name, value = false, options = {}) => {
    Cookies.set(name, value, {
        ...options,
        sameSite: 'Lax', // Cambia a 'None' si necesitas que esté disponible en contextos de terceros.
        secure: true     // Asegura que la cookie solo se envíe a través de HTTPS
    });
};

// Obtener una cookie
export const getGlobalVariable = (name) => {
    return Cookies.get(name);
};

// Eliminar una cookie
export const removeGlobalVariable = (name) => {
    Cookies.remove(name);
};
