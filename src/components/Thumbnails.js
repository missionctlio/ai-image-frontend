import React, { useState, useEffect } from 'react';
import FullImageViewer from './FullImageViewer'; // Import the FullImageViewer component
import { baseUrl } from '../api';

const Thumbnails = ({ images: propImages }) => { // Receive images as a prop
    const [images, setImages] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (propImages) {
            setImages(propImages);
            setShowClearButton(propImages.length > 0);
        }
    }, [propImages]); // Update whenever propImages changes

    const handleClearImages = async () => {
        // Iterate over each image and delete it
        for (const [index, image] of images.entries()) {
            await deleteImage(index);
        }
        // Clear local storage and update state
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

    const deleteImage = async (index) => {
        const images = JSON.parse(localStorage.getItem('images')) || [];
        if (index >= 0 && index < images.length) {
            const imageUrl = images[index].imageUrl;
            const imageId = imageUrl.split('/').pop();
            const originalImageId = imageId.replace('original_', '');

            try {
                const response = await fetch(`${baseUrl}/delete-images/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image_ids: [imageId, originalImageId] })
                });

                if (response.ok) {
                    images.splice(index, 1);
                    localStorage.setItem('images', JSON.stringify(images));
                    setImages([...images]); // Refresh the images state
                } else {
                    alert('Error deleting image. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the image.');
            }
        }
    };

    // Determine the current theme from local storage
    const theme = localStorage.getItem('theme') || 'light';
    
    return (
        <div id="thumbnails-container">
            {showClearButton && (
                <button 
                    id="clearThumbnails" 
                    className={`theme-selector ${theme}-theme clear-images-button`} 
                    onClick={handleClearImages}
                >
                    Clear Images
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
                        <div className="delete-icon" onClick={() => deleteImage(index)}>
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
