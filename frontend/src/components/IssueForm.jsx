import { useState } from 'react';

function IssueForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    category: 'infrastructure',
    description: '',
    severity: 'low',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to submit issue
    console.log('Submitting issue:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="form-container" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Report an Issue</h3>
          <button id="close-form" aria-label="Close Form" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issue-category">Category</label>
            <select
              id="issue-category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="safety">Safety</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="issue-description">Description</label>
            <textarea
              id="issue-description"
              name="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="issue-severity">Severity</label>
            <div className="severity-options">
              {['low', 'medium', 'high'].map((level) => (
                <div key={level}>
                  <input
                    type="radio"
                    id={level}
                    name="severity"
                    value={level}
                    checked={formData.severity === level}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={level}>{level}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="issue-image">Upload Image (optional)</label>
            <input
              type="file"
              id="issue-image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div id="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="submit" className="primary-button">
              <i className="fas fa-paper-plane"></i> Submit
            </button>
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueForm;