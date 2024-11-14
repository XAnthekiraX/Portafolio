import PropTypes from 'prop-types'

export default function Avatar({ avatar }) {
    return (
        <div className="mb-8">
            <div className="relative w-40 h-40 mx-auto overflow-hidden transition-transform duration-300 ease-in-out border-4 border-purple-800 rounded-full shadow-lg sm:w-52 sm:h-52 hover:scale-105">
                <img src={avatar} alt="Jane Doe" className="rounded-full" />
            </div>
        </div>
    )
}

Avatar.propTypes={
    avatar: PropTypes.string,
}