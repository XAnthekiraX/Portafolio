// ActionButtons.js
import PropTypes from 'prop-types'
import { Send, Ban } from 'lucide-react'

export function ActionButtons({ handleSubmit, OnCLickF, ClearFunc }) {

    const closeCardAndClean =()=>{
        OnCLickF();
        ClearFunc();
    }

    return (
        <div className="grid grid-cols-2 gap-5">
            <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors duration-300 bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline"
            >
                <Send className="w-5 h-5 mr-2" />
                Add Skill
            </button>
            <div
                onClick={closeCardAndClean}
                className="flex items-center justify-center w-full px-4 py-2 font-bold text-white transition-colors duration-300 bg-purple-600 rounded cursor-pointer hover:bg-purple-700 focus:outline-none focus:shadow-outline"
            >
                <Ban className="w-5 h-5 mr-2" />
                Cancel
            </div>
        </div>
    )
}

ActionButtons.propTypes = {
    ClearFunc: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    OnCLickF: PropTypes.func.isRequired,
}
