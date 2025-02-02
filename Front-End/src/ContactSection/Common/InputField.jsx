import PropTypes from 'prop-types';
import LanguageSwitcher from '../../language/LanguageSwitcher';

export default function InputField({ id, labelEsp, labelEng, placeholderEsp, placeholderEng, language }) {
    
    return (
        <div>
            <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-300">
                <LanguageSwitcher textEsp={labelEsp} textEng={labelEng} language={language} />
                
            </label>
            <input
                type="text"
                id={id}
                className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={language =="esp" ? placeholderEsp : placeholderEng}
            />
        </div>
    );
}

InputField.propTypes = {
    id: PropTypes.string.isRequired,
    labelEsp: PropTypes.string.isRequired,
    labelEng: PropTypes.string.isRequired,
    placeholderEsp: PropTypes.string.isRequired,
    placeholderEng: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
};
