const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// In-memory data store for contacts
let contacts = [
    { id: 1, name: "Alice Smith", email: "alice@example.com" },
    { id: 2, name: "Bob Jones", email: "bob@example.com" }
];

// --- ENDPOINTS ---

// 1. VIEW ALL (GET) - Retrieve all records
app.get('/api/contacts', (req, res) => {
    res.status(200).json(contacts);
});

// 2. VIEW ONE (GET) - Retrieve a single record by ID
app.get('/api/contacts/:id', (req, res) => {
    const contactId = parseInt(req.params.id);
    const contact = contacts.find(c => c.id === contactId);

    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
});

// 3. ADD (POST) - Create a new record
app.post('/api/contacts', (req, res) => {
    const { name, email } = req.body;

    // Simple validation
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    const newContact = {
        id: contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 1, // Auto-increment ID
        name,
        email
    };

    contacts.push(newContact);
    res.status(201).json(newContact);
});

// 4. UPDATE (PUT) - Modify an existing record by ID
app.put('/api/contacts/:id', (req, res) => {
    const contactId = parseInt(req.params.id);
    const contact = contacts.find(c => c.id === contactId);

    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }

    const { name, email } = req.body;
    
    // Update fields if provided in request body
    if (name) contact.name = name;
    if (email) contact.email = email;

    res.status(200).json(contact);
});

// 5. DELETE (DELETE) - Remove a record by ID
app.delete('/api/contacts/:id', (req, res) => {
    const contactId = parseInt(req.params.id);
    const contactIndex = contacts.findIndex(c => c.id === contactId);

    if (contactIndex === -1) {
        return res.status(404).json({ message: "Contact not found" });
    }

    // Remove contact from array
    contacts.splice(contactIndex, 1);
    res.status(200).json({ message: "Contact successfully deleted" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
