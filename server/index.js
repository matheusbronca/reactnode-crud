const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const db_connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'crud_db',
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3001, () => {
  console.log('Running on port 3001');
});

app.get('/api/get', (req, res) => {
  const query =
    'select min(id) as id, movieName, movieReview from movie_reviews group by movieName, movieReview';
  db_connection.query(query, (err, result) => {
    res.send(result);
  });
});

app.post('/api/insert', (req, res) => {
  const movieName = req.body.movieName;
  const review = req.body.review;

  const query =
    'INSERT INTO movie_reviews (movieName, movieReview) VALUES (?, ?);';
  db_connection.query(query, [movieName, review], (err, result) => {
    if (err) console.error(err);
    res.send(result);
  });
});

app.delete('/api/delete/:movieId', (req, res) => {
  const movie = req.params.movieId;

  const query = 'DELETE FROM movie_reviews WHERE id = ?;';

  db_connection.query(query, movie, (err, result) => {
    res.send(result);
  });
});

app.put('/api/update', (req, res) => {
  const id = req.body.id;
  const review = req.body.review;

  const query = 'UPDATE movie_reviews SET movieReview = ? WHERE id = ?;';

  db_connection.query(query, [review, id], (err, result) => {
    if (err) console.error(error);
    res.send(result);
  });
});
