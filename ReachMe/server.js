// Import des modules nécessaires
import express from 'express';
import multer from 'multer';
import path from 'path';
import { connectToDatabase, getDb } from './db.js';
import { ObjectId } from 'mongodb';

// Initialisation d'Express et de Multer
const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware pour traiter les données JSON et les URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route pour mettre à jour un contact avec téléchargement d'avatar
app.post('/contacts/:contactId/edit', upload.single('avatar'), async (req, res) => {
  const contactId = req.params.contactId;
  const updates = req.body;

  // Gestion du fichier téléchargé s'il existe
  if (req.file) {
    updates.avatar = `/uploads/${req.file.filename}`;
  }

  const db = getDb();
  const contactsCollection = db.collection('contacts');

  try {
    // Mise à jour du contact dans la base de données
    await contactsCollection.updateOne({ _id: new ObjectId(contactId) }, { $set: updates });
    res.redirect(`/contacts/${contactId}`);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).send('Error updating contact');
  }
});

// Middleware pour servir les fichiers téléchargés
// eslint-disable-next-line no-undef
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Démarrage du serveur Express sur le port 3000
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Connexion à la base de données MongoDB au démarrage du serveur
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});
