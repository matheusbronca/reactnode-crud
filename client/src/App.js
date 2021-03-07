import React from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [movieName, setMovieName] = React.useState('');
  const [review, setReview] = React.useState('');
  const [newReview, setNewReview] = React.useState('');
  const [initialData, setInitialData] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      const response = await axios.get('http://localhost:3001/api/get');

      setInitialData(response.data);
    };

    getData();
  }, []);

  function submitReview() {
    const fetch = async (req, res) => {
      const response = await axios.post('http://localhost:3001/api/insert', {
        movieName,
        review,
      });

      const id = response.data.insertId;
      setInitialData([...initialData, { id, movieName, movieReview: review }]);
    };

    fetch();
  }

  function handleDelete(movieId) {
    // IIFE (Immediately Invoked Function Expression);
    (async function (req, res) {
      const response = await axios.delete(
        `http://localhost:3001/api/delete/${movieId}`
      );

      if (response.status === 200) {
        setInitialData(
          initialData.filter((review) => {
            return review.id !== movieId;
          })
        );
      } else {
        alert('Something wrong occurs when deleting this Review, try again!');
      }
    })();
  }

  function handleUpdate(movieId) {
    (async function (req, res) {
      const response = await axios.put('http://localhost:3001/api/update', {
        id: movieId,
        review: newReview,
      });

      if (response.status === 200) {
        setInitialData(
          initialData.map((review) => {
            if (review.id === movieId) {
              review.movieReview = newReview;
              return review;
            }

            return review;
          })
        );
        setNewReview('');
      }
    })();
  }

  return (
    <div className="App">
      <h1>CRUD APPLICATION</h1>
      <div className="form">
        <label htmlFor="movieName">Movie Name:</label>
        <input
          type="text"
          name="movieName"
          onChange={({ target }) => setMovieName(target.value)}
        />
        <label htmlFor="review">Review:</label>
        <input
          type="text"
          name="review"
          onChange={({ target }) => setReview(target.value)}
        />

        <button onClick={submitReview}>Submit</button>
      </div>
      <h1>Reviews:</h1>
      {initialData != null && (
        <ul>
          {initialData.map((review) => (
            <li key={review.id} className="card">
              <h3>{review.movieName}</h3>
              <p>{review.movieReview}</p>
              <div className="updateWrapper">
                <input
                  type="text"
                  onChange={({ target }) => setNewReview(target.value)}
                />
                <button onClick={() => handleUpdate(review.id)}>Update</button>
              </div>
              <button
                className="deleteBtn"
                onClick={() => handleDelete(review.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
