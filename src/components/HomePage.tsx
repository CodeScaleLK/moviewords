import React from "react";
import "./homepage.scss";
import uploadIcon from "./../images/icons/upload.svg";
import searchIcon from "./../images/icons/search.svg";
import showWordsIcon from "./../images/icons/showwords.svg";
import buyMeCoffee from "./../images/bmc.png";
import paypal from "./../images/paypal.png";

const HomePage = (props: any) => {
  const handleShowMyWords = () => {
    props.setCurrentPage("mywords");
  };

  const renderFilms = (movie: any, index: number) => {
    const handleOnClick = () => {
      props.onFilmClick(movie.file_id);
    };
    return (
      <div className="movie-item" key={index} onClick={handleOnClick}>
        <img src={movie.img} alt="movie icon" height={80} width={55} />
        <div className="film-details">
          <div className="film-name">{movie.name}</div>
          <div className="film-year">{movie.year}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="title">
        <h2 className="title-h2">Film Words</h2>
        <h4 className="title-h4">
          Learn new english words, before watching a film!
        </h4>
        <div className="film-search">
          <div className="search-box">
            <input
              className="search-input"
              type="text"
              name="film-name"
              placeholder="&#x1F50E;&#xFE0E; Search"
              onChange={props.handleSearch}
            />
            <ul className="film-list" style={props.listStyle}>
              {props.movieList ? props.movieList.map(renderFilms) : ""}
            </ul>
          </div>
        </div>
        <div className="icon-row">
          <img className="icon-style" src={searchIcon} alt="search-icon" />
          <label htmlFor="file">
            <img src={uploadIcon} alt="upload-icon" className="icon-style" />
          </label>
          <input
            type="file"
            name="file"
            accept=".vtt,pdf,.srt,.txt,.svb,.ttml,.dfxp"
            id="file"
            onChange={props.uploadFile}
          />
          <img
            className="icon-style"
            src={showWordsIcon}
            onClick={handleShowMyWords}
            alt="show-words-icon"
          />
        </div>
      </div>
      <div className="donate-row">
        <img src={buyMeCoffee} alt="buy_me_coffee" />
        <img src={paypal} alt="paypal" />
      </div>
    </>
  );
};

export default HomePage;
