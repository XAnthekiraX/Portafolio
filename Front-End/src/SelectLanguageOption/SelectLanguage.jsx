import { useState } from 'react';
import PropTypes from 'prop-types';

export default function SelectLanguage({ onChangeF, value, txtEng, txtEsp }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (lang) => {
        onChangeF({ target: { value: lang } });
        setIsOpen(false);
    };
    
    return (
        <div className="fixed z-10 flex flex-col end-5 top-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-auto h-auto p-2 text-white bg-[#1f2335] border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {value === 'eng' ? txtEng : txtEsp}
            </button>
            {isOpen && (
                <ul className="w-auto mt-1 bg-gray-800 border border-white rounded-lg shadow-lg ">
                    <li
                        onClick={() => handleOptionClick('eng')}
                        className="p-4 text-white cursor-pointer hover:bg-blue-500"
                    >
                        {txtEng}
                    </li>
                    <li
                        onClick={() => handleOptionClick('esp')}
                        className="px-4 py-2 text-white cursor-pointer hover:bg-blue-500"
                    >
                        {txtEsp}
                    </li>
                </ul>
            )}
        </div>
    );
}

SelectLanguage.propTypes = {
    onChangeF: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    txtEng: PropTypes.string.isRequired,
    txtEsp: PropTypes.string.isRequired,
};
