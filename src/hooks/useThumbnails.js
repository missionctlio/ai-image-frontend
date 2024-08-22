import { useState, useEffect } from 'react';
import { deleteImages } from '../api';

const useThumbnails = (propImages) => {
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

    return {
        images,
        showClearButton,
        selectedImage,
        handleClearImages,
        handleImageClick,
        handleCloseViewer,
        deleteImage,
    };
};

export default useThumbnails;
