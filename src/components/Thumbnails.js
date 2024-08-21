import React, { useState, useEffect } from 'react';
import FullImageViewer from './FullImageViewer';
import { baseUrl } from '../api';
import { deleteImages } from '../api';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon from react-icons/fa

const Thumbnails = ({ images: propImages }) => {
    const [images, setImages] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (propImages) {
            setImages(propImages);
            setShowClearButton(propImages.length > 0);
        }
    }, [propImages]);

    const handleClearImages = async () => {
        const imageIds = images.map(image => {
            const imageUrl = image.imageUrl;
            return imageUrl.split('/').pop().replace('original_', '');
        });

        await deleteImages(imageIds);

        localStorage.removeItem('images');
        setImages([]);
        setShowClearButton(false);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseViewer = () => {
        setSelectedImage(null);
    };

    const deleteImage = async (imageToDelete) => {
        const index = images.findIndex(img => img.imageUrl === imageToDelete.imageUrl);

        if (index !== -1) {
            const imageUrl = images[index].imageUrl;
            const imageId = imageUrl.split('/').pop().replace('original_', '');

            await deleteImages([imageId]);

            const updatedImages = images.filter((_, i) => i !== index);
            localStorage.setItem('images', JSON.stringify(updatedImages));
            setImages(updatedImages);
        }
    };

    const theme = localStorage.getItem('theme') || 'light';
    
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
