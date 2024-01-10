const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Konfigurasi Database
const dbConfig = {
  host: '66.118.234.39',
  user: 'u40_1fcVHWTpwn',
  password: '+qzCOyK9=bU6SoJOHzhvlQM!',
  database: 's40_daffa_db'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((error) => {
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Database connected successfully');
  }
});

// Fungsi untuk mengeksekusi query
function executeQuery(query, params, callback) {
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('Query execution failed:', error);
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

// Membuat data
app.post('/users', (req, res) => {
  const { nama, umur, agama } = req.body;
  const query = 'INSERT INTO users (nama, umur, agama) VALUES (?, ?, ?)';
  const params = [nama, umur, agama];

  executeQuery(query, params, (error, results) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send(`User added with ID: ${results.insertId}`);
    }
  });
});

// Membaca data dengan patokan ID
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  const params = [id];

  executeQuery(query, params, (error, results) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(results);
    }
  });
});

// Mengupdate Data
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { nama, umur, agama } = req.body;
  const query = 'UPDATE users SET nama = ?, umur = ?, agama = ? WHERE id = ?';
  const params = [nama, umur, agama, id];

  executeQuery(query, params, (error) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(`User modified with ID: ${id}`);
    }
  });
});

// Mendelete Data
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';
  const params = [id];

  executeQuery(query, params, (error) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.send(`User deleted with ID: ${id}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
