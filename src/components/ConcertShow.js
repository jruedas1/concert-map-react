function ConcertShow({ concert }) {
    return (
      <div className="concert-info">
          <h3>{concert.artist_formula}</h3>
          <p>{concert.venue}</p>
          <p>{concert.month} {concert.day} {concert.year}</p>
      </div>
    );
}

export default ConcertShow;