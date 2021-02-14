import React, { useEffect, useState } from "react";
import "./Row.css";
import axios from "./axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

function Row({ title, fetchUrl, isLargeRow = false }) {
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState("");

	const base_url = "http://image.tmdb.org/t/p/original/";

	useEffect(() => {
		const fetchData = async () => {
			const request = await axios.get(fetchUrl);
			setMovies(request.data.results);
			return request;
		};
		fetchData();
	}, [fetchUrl]);
	//console.log(movies);

	const handleMovie = (movie) => {
		if (trailerUrl) {
			setTrailerUrl("");
		} else {
			movieTrailer(movie?.title || "")
				.then((url) => {
					const urlParam = new URLSearchParams(new URL(url).search);
					setTrailerUrl(urlParam.get("v"));
				})
				.catch(() => console.log("An ERROR Occured"));
		}
	};

	  const opts = {
			height: "390",
			width: "100%",
			playerVars: {
				autoplay: 1,
			},
		};

	return (
		<div className="row">
			<h2>{title}</h2>

			<div className="row__posters">
				{movies.map(
					(movie) =>
						((isLargeRow && movie.poster_path) ||
							(!isLargeRow && movie.backdrop_path)) && (
							<img
								className={`row__poster ${isLargeRow && "row__posterLarge"}`}
								key={movie.id}
								onClick={() => handleMovie(movie)}
								src={`${base_url}${
									isLargeRow ? movie.poster_path : movie.backdrop_path
								}`}
								alt={movie.name}
							/>
						)
				)}
			</div>
			{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} /> }
		</div>
	);
}

export default Row;
