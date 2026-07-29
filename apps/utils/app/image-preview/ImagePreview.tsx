"use client";
import React, { useState } from "react";

const ImagePreview = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setZoom(1); // Reset zoom to 1 when a new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.1);
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
  };

  return (
    <div className="mt-5 flex flex-col items-center">
      <label className="block mb-5">
        <span className="sr-only">Choose image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-base text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-base file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </label>
      {imageSrc && (
        <div className="flex flex-col items-center">
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            <button
              onClick={handleRotate}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Rotate
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Zoom In
            </button>
            <button
              onClick={handleZoomOut}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Zoom Out
            </button>
          </div>
          <div
            className="overflow-hidden border border-gray-300 flex justify-center items-center"
            style={{
              width: "300px",
              maxWidth: "100%",
              height: "300px",
            }}
          >
            <img
              src={imageSrc}
              alt="Preview"
              className="transition-transform duration-300 object-contain"
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
