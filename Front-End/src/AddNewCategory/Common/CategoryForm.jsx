import { useState } from "react";
import Button from "./Button";
import PropTypes from 'prop-types'

export default function CategoryForm({onClickF}) {
    const [categoryName, setCategoryName] = useState("");

    const handleSave = () => {
        // Lógica para guardar la categoría
    };


    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold text-purple-400">Nueva Categoría</h2>
            <div className="mb-4">
                <label htmlFor="categoryName" className="block mb-2 text-sm font-medium text-gray-300">
                    Nombre de la Categoría
                </label>
                <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 text-white placeholder-gray-400 transition duration-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingrese el nombre de la categoría"
                />
            </div>
            <div className="flex justify-end space-x-3">
                <Button text="Cancelar" onClick={onClickF} color="gray" icon="X" />
                <Button text="Guardar" onClick={handleSave} color="purple" icon="Save" />
            </div>
        </div>
    );
}

CategoryForm.propTypes={
    onClickF: PropTypes.func,
}