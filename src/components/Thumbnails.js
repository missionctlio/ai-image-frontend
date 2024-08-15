import React from 'react';
import FullImageViewer from './FullImageViewer';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon from react-icons/fa
import useThumbnails from '../hooks/useThumbnails'; // Import useThumbnails hook
import useTheme from '../hooks/useTheme'; // Import useTheme hook
import { baseUrl } from '../api';

const Thumbnails = ({ images: propImages }) => {
    const {
        images,
        showClearButton,
        selectedImage,
        handleClearImages,
        handleImageClick,
        handleCloseViewer,
        deleteImage
    } = useThumbnails(propImages);
    const { theme } = useTheme();
    return (
        <div id="thumbnails-container">
            {showClearButton && (
                <button 
                    id="clearThumbnails" 
                    className={`theme-selector ${theme}-theme clear-images-button`} 
                    onClick={handleClearImages}
                >
                    <FaTrash size={24} /> {/* Trash icon */}
                </button>
            )}
            <div id="thumbnails" className="thumbnails">
                {images.map((image, index) => (
                    <div key={index} className="thumbnail-container">
                        <img
                            src={`${baseUrl}${image.imageUrl}`}
                            alt="Thumbnail"
                            className="thumbnail"
                            onClick={() => handleImageClick(image)}
                        />
                        <div className="description-container">
                            Aspect Ratio: {image.aspectRatio}
                        </div>
                        <div 
                            className="delete-icon" 
                            onClick={() => deleteImage(image)}
                        >
                            ×
                        </div>
                    </div>
                ))}
            </div>
            {selectedImage && (
                <FullImageViewer
                    image={selectedImage}
                    onClose={handleCloseViewer}
                />
            )}
        </div>
    );
};

export default Thumbnails;
