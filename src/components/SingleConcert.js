function SingleConcert( {index, concert} ){
    return (
        concert && (<div className={'concert-info'}>
            <h3>{concert.Artist_Formula}</h3>
            <p>{concert.Venue}</p>
            <p>{concert.Month} {concert.Day} {concert.Year}</p>
        </div>)
    );
}

export default SingleConcert;