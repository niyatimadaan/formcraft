# 🚀 FormCraft - Dynamic Form Builder

<div align="center">

![FormCraft Logo](https://img.shields.io/badge/FormCraft-Dynamic_Form_Builder-blue?style=for-the-badge&logo=forms&logoColor=white)

A powerful, modern web application for creating, editing, and managing dynamic forms with an intuitive drag-and-drop interface.

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat&logo=mongodb)](https://mongodb.com/)
<!-- [![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE) -->

</div>

## ✨ Features

### 🎨 **Dynamic Form Creation**
- **Visual Form Builder**: Create forms with an intuitive drag-and-drop interface
- **Multiple Input Types**: Support for text, email, password, number, and date fields
- **Section Management**: Organize form fields into logical sections with editable titles
- **Real-time Preview**: See your form as you build it

### 🔧 **Advanced Editing Capabilities**
- **Drag & Drop Reordering**: Powered by @dnd-kit for smooth field reordering
- **2-Column Layout**: Professional responsive design that adapts to screen size
- **Section Title Editing**: Click to edit section names on the fly
- **Field Limit Management**: Smart limits with visual feedback (max 20 fields)

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, professional interface with smooth animations
- **Accessibility**: Built with WCAG guidelines in mind

### 💾 **Data Management**
- **MongoDB Integration**: Persistent data storage
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Form Submissions**: Capture and store form responses
- **RESTful API**: Clean, documented API endpoints

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern UI library with hooks
- **React Router 6.3.0** - Client-side routing
- **@dnd-kit** - Modern drag-and-drop library
- **Axios 1.4.0** - HTTP client for API calls
- **CSS3** - Custom responsive styling with grid and flexbox

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 7.5.0** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
FormCraft/
├── backend/
│   ├── server.js           # Express server & API routes
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── public/
│   │   ├── index.html      # Main HTML template
│   │   └── manifest.json   # PWA manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── home.js         # Dashboard & form listing
│   │   │   ├── createForm.js   # Form creation interface
│   │   │   ├── editForm.js     # Form editing interface
│   │   │   └── viewForm.js     # Form viewing & submission
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Global styles
│   │   └── index.js        # React entry point
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FormCraft
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create .env file

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev  # Development mode with nodemon
   # or
   npm start    # Production mode
   ```
   Server runs on: `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   Application runs on: `http://localhost:3000`

## 📋 API Documentation

### Forms Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/forms` | Get all forms |
| `POST` | `/api/forms` | Create a new form |
| `GET` | `/api/forms/:id` | Get a specific form |
| `PUT` | `/api/forms/:id` | Update a form |
| `DELETE` | `/api/forms/:id` | Delete a form |
| `POST` | `/api/forms/:id/submit` | Submit form data |

### Form Schema
```javascript
{
  title: String,           // Form title
  inputs: [{              // Array of form fields
    id: String,           // Unique field identifier
    type: String,         // Field type (text, email, password, number, date)
    title: String,        // Field label
    placeholder: String,  // Field placeholder text
    section: String,      // Section identifier
    order: Number         // Field order within section
  }],
  sections: [{            // Array of form sections
    id: String,           // Unique section identifier
    title: String,        // Section title
    order: Number         // Section order
  }],
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## 🎯 Usage Guide

### Creating a Form
1. Navigate to the home page
2. Click **"Create New Form"**
3. Enter a form title
4. Add input fields using the **"Add Input"** button
5. Configure field properties (type, title, placeholder)
6. Organize fields using drag-and-drop
7. Edit section titles by clicking the edit icon (✏️)
8. Save your form

### Editing a Form
1. From the home page, click **"Edit"** on any form
2. Modify the form title directly
3. Add, remove, or reorder fields
4. Update field properties
5. Rename sections as needed
6. Save changes

### Viewing & Submitting Forms
1. Click **"View"** on any form from the home page
2. Fill out the form fields
3. Submit the form
4. View success confirmation

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/formcraft

# Server
PORT=5000
NODE_ENV=development

# Optional: MongoDB Atlas (for cloud database)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/formcraft
```

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:5000` during development. This is set in `frontend/package.json`:

```json
{
  "proxy": "http://localhost:5000"
}
```

## 🎨 Customization

### Styling
- **Global styles**: Edit `frontend/src/App.css`
- **Component styles**: Styles are included in the main CSS file with BEM methodology
- **Responsive breakpoints**: 768px (tablet) and 480px (mobile)

### Adding New Field Types
1. Update the backend schema in `server.js`
2. Add the new type to `inputTypes` array in form components
3. Update validation and rendering logic



---

<div align="center">
Made with ❤️ using React, Node.js, and MongoDB

**[⭐ Star this repo](https://github.com/yourusername/formcraft)** if you found it helpful!
</div>
