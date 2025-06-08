import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Подключение к базе данных
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Проверка подключения
db.connect(err => {
  if (err) {
    console.error('DB Connection error:', err);
  } else {
    console.log('Connected to DB!');
  }
});

// Роут: получить все книги
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Роут: добавить книгу
app.post('/books', (req, res) => {
  const { name, description } = req.body;
  db.query(
    'INSERT INTO books (name, description) VALUES (?, ?)',
    [name, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, name, description });
    }
  );
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});