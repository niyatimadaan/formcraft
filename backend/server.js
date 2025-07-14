const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Form Schema
const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Form'
  },
  inputs: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'email', 'password', 'number', 'date']
    },
    title: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    section: {
      type: String,
      default: 'default'
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  sections: [{
    id: String,
    title: String,
    order: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Form = mongoose.model('Form', formSchema);

// Submission Schema
const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Submission = mongoose.model('Submission', submissionSchema);

// Routes

// Get all forms
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find().sort({ updatedAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single form
app.get('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new form
app.post('/api/forms', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update form
app.put('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete form
app.delete('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit form
app.post('/api/forms/:id/submit', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const submission = new Submission({
      formId: req.params.id,
      data: req.body
    });

    await submission.save();
    res.status(201).json({ message: 'Form submitted successfully', submission });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get form submissions
app.get('/api/forms/:id/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({ formId: req.params.id })
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
