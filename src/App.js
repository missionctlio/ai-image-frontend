import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import Thumbnails from './components/Thumbnails';
import FullImageViewer from './components/FullImageViewer';
import './App.css'; // Import the CSS file for styling

function App() {
    const [theme, setTheme] = useState('light');
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleDeleteImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    return (
        <div className={theme}>
            <ImageGenerator theme={theme} setTheme={setTheme} />
        </div>
    );
}

export default App;

