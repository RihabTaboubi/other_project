import { ObjectId } from 'mongodb';

// Créer un nouveau contact
// eslint-disable-next-line no-undef
app.post('/contacts', async (req, res) => {
  const { first, last, email, telephone, notes } = req.body;
  // eslint-disable-next-line no-undef
  const db = getDb();
  const contactsCollection = db.collection('contacts');

  const result = await contactsCollection.insertOne({ first, last, email, telephone, notes });
  res.status(201).json({ id: result.insertedId });
});

// Obtenir tous les contacts
// eslint-disable-next-line no-undef
app.get('/contacts', async (req, res) => {
  // eslint-disable-next-line no-undef
  const db = getDb();
  const contactsCollection = db.collection('contacts');

  const contacts = await contactsCollection.find().toArray();
  res.json(contacts);
});

// Obtenir un contact par ID
// eslint-disable-next-line no-undef
app.get('/contacts/:contactId', async (req, res) => {
  const contactId = req.params.contactId;
  // eslint-disable-next-line no-undef
  const db = getDb();
  const contactsCollection = db.collection('contacts');

  const contact = await contactsCollection.findOne({ _id: new ObjectId(contactId) });
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).send('Contact not found');
  }
});

// Supprimer un contact par ID
// eslint-disable-next-line no-undef
app.delete('/contacts/:contactId', async (req, res) => {
  const contactId = req.params.contactId;
  // eslint-disable-next-line no-undef
  const db = getDb();
  const contactsCollection = db.collection('contacts');

  await contactsCollection.deleteOne({ _id: new ObjectId(contactId) });
  res.status(204).send();
});
                                           