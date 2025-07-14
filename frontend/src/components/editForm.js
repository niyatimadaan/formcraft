import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ input, deleteInput }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: input.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`draggable-input ${isDragging ? 'dragging' : ''}`}
    >
      <div className="form-input-preview">
        <label>{input.title}</label>
        <input
          type={input.type}
          placeholder={input.placeholder}
          readOnly
          className="readonly-input"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteInput(input.id);
          }}
          className="delete-input-btn"
          onMouseDown={(e) => e.stopPropagation()}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [inputs, setInputs] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddInput, setShowAddInput] = useState(false);
  const [inputType, setInputType] = useState('text');
  const [inputTitle, setInputTitle] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const inputTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await axios.get(`/api/forms/${id}`);
      const form = response.data;
      setFormTitle(form.title);
      setInputs(form.inputs || []);
      const formSections = form.sections || [{ id: 'default', title: 'Default Section', order: 0 }];
      setSections(formSections);
      // Set selected section after sections are loaded
      if (formSections.length > 0) {
        setSelectedSection(formSections[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form:', error);
      setLoading(false);
    }
  };

  const addInput = () => {
    if (inputs.length >= 20) {
      alert('Maximum 20 inputs allowed');
      return;
    }

    if (!inputTitle.trim()) {
      alert('Please provide a title for the input');
      return;
    }

    if (!selectedSection) {
      alert('Please select a section');
      return;
    }

    const sectionInputs = inputs.filter(input => input.section === selectedSection);
    const newInput = {
      id: uuidv4(),
      type: inputType,
      title: inputTitle,
      placeholder: inputPlaceholder,
      section: selectedSection,
      order: sectionInputs.length
    };

    setInputs([...inputs, newInput]);
    setInputTitle('');
    setInputPlaceholder('');
    setShowAddInput(false);
  };

  const deleteInput = (inputId) => {
    setInputs(inputs.filter(input => input.id !== inputId));
  };

  const addSection = () => {
    const sectionTitle = prompt('Enter section title:');
    if (sectionTitle) {
      const newSection = {
        id: uuidv4(),
        title: sectionTitle,
        order: sections.length
      };
      setSections([...sections, newSection]);
      setSelectedSection(newSection.id);
    }
  };

  const updateSectionTitle = (sectionId, newTitle) => {
    if (!newTitle.trim()) {
      alert('Section title cannot be empty');
      return;
    }
    
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, title: newTitle.trim() }
        : section
    ));
  };

  const handleSectionTitleEdit = (sectionId, currentTitle) => {
    const newTitle = prompt('Enter new section title:', currentTitle);
    if (newTitle !== null && newTitle !== currentTitle) {
      updateSectionTitle(sectionId, newTitle);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setInputs((items) => {
        // Find the active and over items
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);

        if (activeIndex === -1 || overIndex === -1) return items;

        const activeItem = items[activeIndex];
        const overItem = items[overIndex];

        // If moving to a different section
        if (activeItem.section !== overItem.section) {
          activeItem.section = overItem.section;
        }

        // Reorder the array
        const newItems = arrayMove(items, activeIndex, overIndex);

        // Update orders for items in the same section
        const sectionItems = newItems.filter(item => item.section === activeItem.section);
        sectionItems.forEach((item, index) => {
          item.order = index;
        });

        return newItems;
      });
    }
  };

  const updateForm = async () => {
    try {
      const formData = {
        title: formTitle,
        inputs: inputs,
        sections: sections
      };

      await axios.put(`/api/forms/${id}`, formData);
      navigate('/');
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Error updating form. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  return (
    <div className="create-form-container">
      <header className="form-header center">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="form-title-input"
          placeholder="Form Title"
        />
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="btn-cancel">
            Cancel
          </button>
          <button onClick={updateForm} className="btn-save">
            Update Form
          </button>
        </div>
      </header>

      <div className="form-builder">
        <div className="form-controls">
          <button
            onClick={() => setShowAddInput(true)}
            className="btn-add-input"
            disabled={inputs.length >= 20}
          >
            Add Input ({inputs.length}/20)
          </button>
          <button onClick={addSection} className="btn-add-section">
            Add Section
          </button>
        </div>

        {showAddInput && (
          <div className="add-input-modal">
            <div className="modal-content">
              <h3>Add New Input</h3>
              <div className="form-group">
                <label>Input Type:</label>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                >
                  {inputTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Input Title:</label>
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="Enter input title"
                />
              </div>
              <div className="form-group">
                <label>Placeholder:</label>
                <input
                  type="text"
                  value={inputPlaceholder}
                  onChange={(e) => setInputPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
              <div className="form-group">
                <label>Section:</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowAddInput(false)} className="btn-cancel">
                  Cancel
                </button>
                <button onClick={addInput} className="btn-add">
                  Add Input
                </button>
              </div>
            </div>
          </div>
        )}

        {sections.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="form-preview">
              {sections.map(section => {
                const sectionInputs = inputs
                  .filter(input => input.section === section.id)
                  .sort((a, b) => a.order - b.order);

                return (
                  <div key={section.id} className="form-section">
                    <div className="section-header">
                      <h3 className="section-title">{section.title}</h3>
                      <button
                        onClick={() => handleSectionTitleEdit(section.id, section.title)}
                        className="edit-section-btn"
                        type="button"
                        title="Edit section title"
                      >
                        ✏️
                      </button>
                    </div>
                    <div className="section-content">
                      <SortableContext
                        items={sectionInputs.map(input => input.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="inputs-grid">
                          {sectionInputs.map((input) => (
                            <SortableItem
                              key={input.id}
                              input={input}
                              deleteInput={deleteInput}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </div>
                  </div>
                );
              })}
            </div>
          </DndContext>
        )}

        {sections.length === 0 && (
          <div className="form-preview">
            <div className="no-sections">
              <p>No sections available. Add a section to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditForm;
