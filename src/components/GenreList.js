import {useEffect, useRef, useState} from "react";
import GenreShow from "./GenreShow.js";

function GenreList({ genres, handleGenreClick, selectedGenre }) {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const genreListRef = useRef([]);

    const handleListKeyDown = (e, index, genre, id) => {
        if (e.key === "ArrowDown"){
            e.preventDefault();
            if (index < genres.length - 1) setFocusedIndex(index + 1);
        } else if (e.key === "ArrowUp"){
            if (index > 0) setFocusedIndex(index - 1);
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleGenreClick(genre, id);
        }
    }

    useEffect(() => {
        if (focusedIndex >= 0 && genreListRef.current[focusedIndex]){
            genreListRef.current[focusedIndex].focus();
        }
    }, [focusedIndex]);

    useEffect(() => {
        if (genres.length > 0) {
            setFocusedIndex(0);
        }
    }, [genres]);


    const renderedGenres = genres.map((genre, index) => (
        <GenreShow
            key={genre['id']}
            index={index}
            ref={el => genreListRef.current[index] = el}
            genre={genre['name']}
            id={genre['id']}
            onClick={handleGenreClick}
            onKeyDown={handleListKeyDown}
            isSelected={genre['id'] === selectedGenre?.id}
        />
    ));

    return (
        <div
            id="genre-list"
            role="listbox"
            aria-label="Genres"
        >
            {renderedGenres}
        </div>
    );
}

export default GenreList;