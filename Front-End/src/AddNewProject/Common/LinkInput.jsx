import PropTypes from 'prop-types';

export function LinkInput({ id, label, value, onChange, placeholder }) {
    return (
        <div>
            <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-300">
                {label}
            </label>
            <input
                id={id}
                type="url"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-white bg-gray-700 rounded-md"
            />
        </div>
    );
}

LinkInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};
