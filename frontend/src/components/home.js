import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('/api/forms');
      setForms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await axios.delete(`/api/forms/${id}`);
        fetchForms();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading forms...</div>;
  }

  return (
    <div className="home-container">
      <header className="header">
        <h1>Form Builder</h1>
        <Link to="/form/create" className="create-btn">
          Create New Form
        </Link>
      </header>

      <div className="forms-grid">
        {forms.length === 0 ? (
          <div className="empty-state">
            <h2>No forms created yet</h2>
            <p>Create your first form to get started!</p>
            <Link to="/form/create" className="create-btn">
              Create Form
            </Link>
          </div>
        ) : (
          forms.map((form) => (
            <div key={form._id} className="form-card">
              <h3>{form.title}</h3>
              <p>{form.inputs.length} inputs</p>
              <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
              <div className="form-actions">
                <Link to={`/form/${form._id}`} className="btn-view">
                  View
                </Link>
                <Link to={`/form/${form._id}/edit`} className="btn-edit">
                  Edit
                </Link>
                <button
                  onClick={() => deleteForm(form._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
