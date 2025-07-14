import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import CreateForm from './components/createForm';
import EditForm from './components/editForm';
import ViewForm from './components/viewForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form/create" element={<CreateForm />} />
          <Route path="/form/:id/edit" element={<EditForm />} />
          <Route path="/form/:id" element={<ViewForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
