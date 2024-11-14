import PropTypes from 'prop-types';
import { Upload } from "lucide-react";

export function ImageUploader({ onImageChange, imagePreview }) {
    return (
        <div>
            <label htmlFor="projectImage" className="block mb-1 text-sm font-medium text-gray-300">
                Project Image
            </label>
            <div className="flex items-center mt-1 space-x-4">
                <input
                    id="projectImage"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => document.getElementById("projectImage")?.click()}
                    className="flex items-center px-4 py-2 text-white bg-gray-700 rounded-md"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                </button>
                {imagePreview && <img src={imagePreview} alt="Project preview" className="h-32 rounded w-52" />}
            </div>
        </div>
    );
}

ImageUploader.propTypes = {
    onImageChange: PropTypes.func.isRequired,
    imagePreview: PropTypes.string,
};

