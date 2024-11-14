import PropTypes from 'prop-types'

export default function Name({ name }) {
    return (
        <h1 className="mb-2 text-xl font-bold text-purple-500 transition-all duration-300 ease-in-out sm:text-4xl md:text-5xl hover:text-purple-400">
            {name}
        </h1>
    )
}


Name.propTypes = {
    name: PropTypes.string,
}