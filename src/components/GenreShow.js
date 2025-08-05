import React from "react";

const GenreShow = React.forwardRef(({ genre, id, onClick, onKeyDown, index, isSelected }, ref) => {
    return (
        <div
            className="genre filter-option"
            data-id={id}
            tabIndex={0}
            onClick={()=>onClick(genre, id)}
            onKeyDown={(e)=>onKeyDown(e, index, genre, id)}
            ref={ref}
            role="option"
            aria-selected={isSelected}
        >
            <h3>{genre.toUpperCase()}</h3>
        </div>
    );
});

export default GenreShow;