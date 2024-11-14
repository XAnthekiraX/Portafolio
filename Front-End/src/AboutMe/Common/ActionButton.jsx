import PropTypes from 'prop-types';

export default function ActionButton({ onClick, label, categoryLoad }) {

    const clickFunctions =()=>{
        onClick();
        categoryLoad();
    }

    return (
        <button
            onClick={clickFunctions}
            className="px-4 py-2 text-sm font-bold text-white transition-colors duration-300 bg-purple-600 rounded sm:text-lg hover:bg-purple-700"
        >   
            {label}
        </button>
    );
}

ActionButton.propTypes = {
    onClick: PropTypes.func,
    categoryLoad: PropTypes.func,
    label: PropTypes.string,
};
