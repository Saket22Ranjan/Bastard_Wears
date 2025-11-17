import React, { useState } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../api/client';
import './ImageUpload.scss';

const ImageUpload = ({ images = [], onImagesChange, maxImages = 4 }) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState(images);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (previews.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Local preview before upload
    const localPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...localPreviews]);

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const { data } = await API.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Merge uploaded URLs
      const newImages = [...images, ...data.images];
      setPreviews(newImages);
      onImagesChange(newImages);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onImagesChange(updated);
  };

  return (
    <div className="image-upload-section">
      <label className="upload-label">
        Product Images ({previews.length}/{maxImages})
      </label>

      <div className="upload-grid">
        {previews.map((img, i) => (
          <div key={i} className="image-preview-box">
            <img src={img} alt={`product-${i}`} className="preview-img" />
            <button type="button" className="remove-image-btn" onClick={() => removeImage(i)}>
              <FiX />
            </button>
          </div>
        ))}

        {previews.length < maxImages && (
          <label className={`upload-box ${uploading ? 'uploading' : ''}`}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              hidden
            />
            <div className="upload-icon">
              <FiUploadCloud />
            </div>
            <div className="upload-text">
              {uploading ? (
                <>
                  <strong>Uploading...</strong>
                  <span>Please wait</span>
                </>
              ) : (
                <>
                  <strong>Click to upload</strong>
                  <span>or drag & drop</span>
                </>
              )}
            </div>
          </label>
        )}
      </div>

      <div className="upload-info">
        <span>📁 Supported: JPG, PNG, WEBP</span>
        <span>📏 Max: 5MB per image</span>
      </div>
    </div>
  );
};

export default ImageUpload;
