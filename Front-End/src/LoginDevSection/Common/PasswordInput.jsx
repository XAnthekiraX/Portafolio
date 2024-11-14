import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

export default function PasswordInput({ password, setPassword }) {
    const [toggleEye, setToggleEye] = useState(true);

    const handleVisibleEye = () => {
        setToggleEye((prevState) => !prevState);
    };

    return (
        <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-xl font-bold text-gray-300">
                Contraseña
            </label>
            <div className="relative flex w-full h-full">
                <input
                    id="password"
                    type={toggleEye ? "password" : "text"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex items-center justify-center w-full p-4 text-lg text-white bg-gray-700 border rounded-lg focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Ingrese su contraseña"
                />
                <div
                    className="absolute flex flex-col items-center justify-center w-8 h-8 top-4 end-2"
                    onClick={handleVisibleEye}
                >
                    {toggleEye ? <Eye className="absolute" /> : <EyeOff className="absolute" />}
                </div>
            </div>
        </div>
    );
}

PasswordInput.propTypes = {
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
};
