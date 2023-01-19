import React from "react";
import "./homepage.scss";
import uploadIcon from "./../images/icons/upload.svg";
import searchIcon from "./../images/icons/search.svg";
import arrowIcon from "./../images/icons/arrow.svg";

const HomePage = (props: any) => {
  const handleShowMyWords = () => {
    props.setCurrentPage("mywords");
  };

  function onImgErrorSmall(source: any) {
    source.target.src = "https://i.ibb.co/Sm82NLv/film-empty.png";
    // disable onerror to prevent endless loop
    source.onerror = "";
    return true;
  }

  const renderFilms = (movie: any, index: number) => {
    const handleOnClick = () => {
      props.onFilmClick(movie.file_id);
    };
    return (
      <div
        className="movie-item"
        style={index === 0 ? { marginTop: 10 } : {}}
        key={index}
        onClick={handleOnClick}
      >
        <img
          src={movie.img}
          placeholder="https://i.ibb.co/Sm82NLv/film-empty.png"
          alt="movie icon"
          onError={onImgErrorSmall}
          height={80}
          width={55}
        />
        <div className="film-details">
          <div className="film-name">{movie.title}</div>
          <div className="film-year">{movie.name}</div>
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
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            name="film-name"
            placeholder="&#x1F50E;&#xFE0E; Search"
            onChange={props.handleSearch}
          />
          <ul className="film-list" style={props.listStyle}>
            {props.movieList.length > 0 ? (
              props.movieList.map(renderFilms)
            ) : (
              <div className="loader_wrap">
                <div className="loader"></div>
              </div>
            )}
          </ul>
        </div>

        <div className="icon-row">
          <div className="icon-buttons">
            <button className="icon-button">
              <img className="icon-style" src={searchIcon} alt="search-icon" />
            </button>
            <button className="icon-button">
              <label htmlFor="file">
                <img
                  src={uploadIcon}
                  alt="upload-icon"
                  className="icon-style"
                />
              </label>
            </button>
            <input
              type="file"
              name="file"
              accept=".vtt,pdf,.srt,.txt,.svb,.ttml,.dfxp"
              id="file"
              onChange={props.uploadFile}
            />
          </div>
          <button className="outline-button" onClick={handleShowMyWords}>
            <span>Show my words</span>
            <img className="icon-style" src={arrowIcon} alt="show-words-icon" />
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
