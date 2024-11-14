import PropTypes from 'prop-types'

export default function Profession({ profession }) {
    return (
        <h2 className="mb-6 text-lg font-semibold text-gray-300 sm:text-2xl md:text-3xl">
            {profession}
        </h2>
    )
}

Profession.propTypes={
    profession: PropTypes.string,
}