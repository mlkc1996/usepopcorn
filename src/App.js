import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const Button = ({ children, onClick }) => {
  return (
    <button className="btn-toggle" onClick={onClick ?? (() => {})}>
      {children}
    </button>
  );
};

const Search = ({ placeholder, query, onSetQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder={placeholder}
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
    />
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const NumResult = ({ result }) => {
  return (
    <p className="num-results">
      Found <strong>{result}</strong> results
    </p>
  );
};

const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};

const Movie = ({ movie, onSetSelectedMovie }) => {
  return (
    <li onClick={onSetSelectedMovie}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

const MovieList = ({ children }) => {
  return <ul className="list">{children}</ul>;
};

const WatchedSummary = ({ watched }) => {
  const avgImdbRating =
    Math.round(average(watched.map((movie) => movie.imdbRating)) * 100) / 100;
  const avgUserRating =
    Math.round(average(watched.map((movie) => movie.userRating)) * 100) / 100;
  const avgRuntime = Math.round(average(watched.map((movie) => movie.runtime)));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedMovie = ({ movie, onSelectMovie, onDeleteWatched }) => {
  return (
    <li>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        onClick={onSelectMovie}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={onDeleteWatched}>
          X
        </button>
      </div>
    </li>
  );
};

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </Button>
      {isOpen && children}
    </div>
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const Loader = () => {
  return <p className="loader">Loading ...</p>;
};

const ErrorMessage = ({ message }) => {
  return <p className="error">{message}</p>;
};

const key = "9a36f5ef";
const movie_url = `http://www.omdbapi.com/?apikey=${key}&`;
const queries = "violet evergarden";

const getMovies = async (queries, abortController) => {
  const res = await fetch(`${movie_url}s=${queries}`, {
    signal: abortController.signal,
  });
  if (!res.ok) throw new Error("Something went wrong with movies fetching.");
  const data = await res.json();
  if (data.Response === "False") throw new Error("Movie not found!");
  return data.Search;
};

const getMovieDetail = async (movie_id, abortController) => {
  const res = await fetch(`${movie_url}i=${movie_id}`, {
    signal: abortController.signal,
  });
  if (!res.ok) throw new Error("Something went wrong with movies fetching.");
  const data = await res.json();
  return data;
};

const MovieDetail = ({
  selectedId,
  onCloseMovie,
  onAddWatched,
  userRating,
  isWatched,
  onSetWatchedRating,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Director: director,
    Released: released,
    Actors: actors,
    Genre: genre,
  } = movie;

  useEffect(() => {
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      },
      true
    );
    return () => {
      //document.removeEventListener()
    };
  }, [onCloseMovie]);

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();
    selectedId &&
      getMovieDetail(selectedId, abortController)
        .then((movie) => setMovie(movie))
        .catch((err) => alert(err.message))
        .finally(() => setIsLoading(false));

    !selectedId && setIsLoading(false);
    return () => abortController.abort();
  }, [selectedId]);

  useEffect(() => {
    document.title = title ? `Movie | ${title}` : "usePopcorn";
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  const onSetRating = (rating) => {
    setMovie((movie) => {
      const clone = Object.assign({}, movie);
      clone.userRating = rating;
      return clone;
    });
    if (isWatched) {
      onSetWatchedRating(movie.imdbID, rating);
    }
  };

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={onSetRating}
                defaultRating={movie?.userRating ?? userRating}
              />
              {!isWatched && (
                <button
                  className="btn-add"
                  onClick={(e) => onAddWatched(movie)}
                >
                  + Add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const selectedWatchedMovie = watched.find(
    (watched_movie) => watched_movie.imdbID === selectedId
  );
  let isSelectedMovieWatched =
    selectedWatchedMovie !== null || selectedWatchedMovie !== undefined;
  const userRating = selectedWatchedMovie?.userRating ?? 0;

  const handleOnSelectMovie = (id) => {
    setSelectedId((prev) => (prev === id ? "" : id));
  };

  const handleOnAddWatchedMovie = (movie) => {
    setWatched((watched) => {
      const clone = {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        imdbRating: movie.imdbRating,
        userRating: movie.userRating,
        runtime: +movie.Runtime.replace(" min", ""),
      };
      return [...watched.filter((wm) => wm.imdbID !== clone.imdbID), clone];
    });
    setSelectedId("");
  };

  const handleOnSetWatchedRating = (id, rating) => {
    if (id !== selectedWatchedMovie.imdbID) return;
    selectedWatchedMovie.userRating = rating;
    setWatched((cur) => [
      ...cur.filter((movie) => movie.imdbID !== id),
      selectedWatchedMovie,
    ]);
  };

  const handleOnDeleteWatched = (id) => {
    setWatched((cur) => cur.filter((movie) => movie.imdbID !== id));
  };

  useEffect(() => {
    const watched_movies_string = localStorage.getItem("watched_movies");
    const watched_movies = JSON.parse(watched_movies_string);
    setWatched(watched_movies);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      setIsLoading(true);
      setError("");
      search &&
        getMovies(search, abortController)
          .then((movies) => {
            setMovies(movies);
          })
          .catch((err) => {
            if (err.name !== "AbortError") setError(err.message);
          })
          .finally(() => setIsLoading(false));
      if (!search) {
        setMovies([]);
        setIsLoading(false);
      }
    }, 700);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [search]);

  useEffect(() => {
    localStorage.setItem("watched_movies", JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <NavBar>
        <Search
          placeholder="Search movies..."
          query={search}
          onSetQuery={setSearch}
        />
        <NumResult result={movies.length} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList>
              {movies?.map((movie) => (
                <Movie
                  movie={movie}
                  key={movie.imdbID}
                  onSetSelectedMovie={() => handleOnSelectMovie(movie.imdbID)}
                />
              ))}
            </MovieList>
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              onCloseMovie={() => setSelectedId("")}
              onAddWatched={handleOnAddWatchedMovie}
              userRating={userRating}
              isWatched={isSelectedMovieWatched}
              onSetWatchedRating={handleOnSetWatchedRating}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <MovieList>
                {watched.map((movie) => (
                  <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onSelectMovie={() => handleOnSelectMovie(movie.imdbID)}
                    onDeleteWatched={() => handleOnDeleteWatched(movie.imdbID)}
                  />
                ))}
              </MovieList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
