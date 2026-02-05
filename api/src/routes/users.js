// src/routes/user.js
import express from 'express';
import { pool } from '../database/database.js';
export const routerUsers = express.Router();

// Login page route.
routerUsers.get("/login", (req, res) => {
  res.send("Login");
});

// Route: POST /users/register
routerUsers.post('/register', async (req, res) => {
  try {
    // 1. Récupération des données envoyées par le front
    const { username, email, password } = req.body;

    // 2. Validation basique
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    // 3. Insertion dans la base de données
    // ATTENTION : Dans un vrai projet, on hache le mot de passe (bcrypt) ici !
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const result = await pool.query(sql, [username, email, password]);

    // 4. Réponse au frontend
    res.status(201).json({ 
      message: "Utilisateur créé avec succès", 
      userId: result.insertId 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});