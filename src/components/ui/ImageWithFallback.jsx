import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, fallbackSrc }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        } else {
            setHasError(true);
        }
    };

    if (hasError) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
                <span className="text-gray-400 text-xs">Image N/A</span>
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default ImageWithFallback;
