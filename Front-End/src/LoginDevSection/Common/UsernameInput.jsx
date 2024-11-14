import PropTypes from "prop-types";

export default function UsernameInput({ username, setUsername }) {
    return (
        <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-xl font-bold text-gray-300">
                Usuario
            </label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-4 text-lg text-white bg-gray-700 border-gray-600 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                placeholder="Ingrese su Usuario"
            />
        </div>
    );
}

UsernameInput.propTypes = {
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
};
