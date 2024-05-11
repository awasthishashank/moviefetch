import React, { useState, useEffect } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (retrying) {
      const timer = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [retrying]);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films");
      if (!response.ok) {
        throw new Error("Something went wrong... Retrying");
      }
      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      setRetrying(true); // Start retrying
    }
    setIsLoading(false);
  }

  function cancelRetryHandler() {
    alert("stopped fetching Data")
    setRetrying(false);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={retrying}>
          Fetch Movies
        </button>
        
      </section>
      <section>
      {retrying && (
          <button onClick={cancelRetryHandler}>Cancel Retry</button>
        )}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {movies.length === 0 && <p>No movies to show</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading....</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
