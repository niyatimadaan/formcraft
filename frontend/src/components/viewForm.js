import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`/api/forms/${id}`);
        setForm(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form:", error);
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await axios.post(`/api/forms/${id}/submit`, formData);
      alert("Form submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(error.response.data.errors || { general: "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }
  if (!form) {
    return <div className="error">Form not found</div>;
  }
  return (
    <div className="view-form-container">
      <div className="view-form-header">
        <h1 className="view-form-title">{form.title}</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {form.sections && form.sections.length > 0 ? (
          form.sections.map(section => (
            <div key={section.id} className="view-form-section">
              <h3 className="view-section-title">{section.title}</h3>
              <div className="view-inputs-grid">
                {form.inputs
                  .filter(input => input.section === section.id)
                  .sort((a, b) => a.order - b.order)
                  .map((input) => (
                    <div key={input.id} className="view-form-group">
                      <label>{input.title}</label>
                      <input
                        type={input.type}
                        name={input.id}
                        placeholder={input.placeholder}
                        value={formData[input.id] || ""}
                        onChange={handleChange}
                        required={input.required}
                      />
                      {errors[input.id] && <span className="error">{errors[input.id]}</span>}
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="view-inputs-grid">
            {form.inputs.map((input) => (
              <div key={input.id} className="view-form-group">
                <label>{input.title}</label>
                <input
                  type={input.type}
                  name={input.id}
                  placeholder={input.placeholder}
                  value={formData[input.id] || ""}
                  onChange={handleChange}
                  required={input.required}
                />
                {errors[input.id] && <span className="error">{errors[input.id]}</span>}
              </div>
            ))}
          </div>
        )}
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
            Back to Home
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary submit-btn">
            {submitting ? "Submitting..." : "Submit Form"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ViewForm;