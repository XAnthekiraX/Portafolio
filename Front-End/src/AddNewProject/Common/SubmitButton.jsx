import PropTypes from 'prop-types';

export function SubmitButton({ label }) {
    return (
        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700">
            {label}
        </button>
    );
}

SubmitButton.propTypes = {
    label: PropTypes.string.isRequired,
};

