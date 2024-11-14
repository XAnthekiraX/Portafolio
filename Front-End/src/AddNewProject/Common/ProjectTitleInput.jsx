import PropTypes from 'prop-types';

export function ProjectTitleInput({ value, onChange, labelText, placeHolder }) {
    return (
        <div>
            <label htmlFor="projectTitle" className="block mb-1 text-sm font-medium text-gray-300">
                {labelText}
            </label>
            <input
                id="projectTitle"
                type="text"
                value={value}
                onChange={onChange}
                required
                placeholder={placeHolder}
                className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
        </div>
    );
}

ProjectTitleInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    labelText: PropTypes.string,
    placeHolder: PropTypes.string,
};
