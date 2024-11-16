import { motion } from "framer-motion";
import CategoryForm from "../Common/CategoryForm";
import PropTypes from 'prop-types'

export default function AddCategoryCard({changeVisibleCard, visibleCard}) {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`overflow-hidden bg-gray-800 border rounded-lg shadow-lg ${visibleCard ? "w-auto h-auto p-4 absolute" : " w-0 h-0 p-0"}`}
            >
                <CategoryForm  onClickF={changeVisibleCard}/>
            </motion.div>
        </div>
    );
}

AddCategoryCard.propTypes={
    changeVisibleCard: PropTypes.func,
    visibleCard: PropTypes.bool
}