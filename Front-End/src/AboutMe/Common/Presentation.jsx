import PropTypes from 'prop-types'

export default function Presentation({ presentation }) {
    return (
        <p className="mb-8 text-sm leading-relaxed text-gray-400 sm:text-lg xl:text-xl sm:w-[70%]">
            {presentation}.
        </p>
    )
}

Presentation.propTypes={
    presentation: PropTypes.string,
}