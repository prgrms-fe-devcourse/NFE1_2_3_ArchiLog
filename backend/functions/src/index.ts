import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';

admin.initializeApp();
const app = express();

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

export const api = functions.https.onRequest(app);