import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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

const CreateForm = () => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [inputs, setInputs] = useState([]);
  const [sections, setSections] = useState([{ id: "default", title: "Default Section", order: 0 }]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [inputTitle, setInputTitle] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [selectedSection, setSelectedSection] = useState("default");

  const inputTypes = [
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "password", label: "Password" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addInput = () => {
    if (inputs.length >= 20) {
      alert("Maximum 20 inputs allowed");
      return;
    }

    if (!inputTitle.trim()) {
      alert("Please provide a title for the input");
      return;
    }

    const newInput = {
      id: uuidv4(),
      type: inputType,
      title: inputTitle,
      placeholder: inputPlaceholder,
      section: selectedSection,
      order: inputs.length,
    };

    setInputs([...inputs, newInput]);
    setInputTitle("");
    setInputPlaceholder("");
    setShowAddInput(false);
  };

  const deleteInput = (id) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const addSection = () => {
    const sectionTitle = prompt("Enter section title:");
    if (sectionTitle) {
      const newSection = {
        id: uuidv4(),
        title: sectionTitle,
        order: sections.length,
      };
      setSections([...sections, newSection]);
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

  const saveForm = async () => {
    try {
      const formData = {
        title: formTitle,
        inputs: inputs,
        sections: sections,
      };

      await axios.post("/api/forms", formData);
      navigate("/");
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Error saving form. Please try again.");
    }
  };

  return (
    <div className="create-form-container">
      <header className="form-header">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="form-title-input"
          placeholder="Form Title"
        />
        <div className="header-actions">
          <button onClick={() => navigate("/")} className="btn-cancel">
            Cancel
          </button>
          <button onClick={saveForm} className="btn-save">
            Save Form
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
                <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
                  {inputTypes.map((type) => (
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
                  {sections.map((section) => (
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
                  <h3 className="section-title">{section.title}</h3>
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
      </div>
    </div>
  );
};

export default CreateForm;
