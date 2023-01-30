import React, { useEffect, useState } from "react";
import uploadIcon from "./../images/icons/upload.svg";
import searchIcon from "./../images/icons/search.svg";
import arrowIcon from "./../images/icons/arrow.svg";

const HomePage = (props: any) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const handleShowMyWords = () => {
    props.setCurrentPage("mywords");
  };
  const [clickedFilm, setClickedFilm] = useState();

  function onImgErrorSmall(source: any) {
    source.target.src = "https://i.ibb.co/Sm82NLv/film-empty.png";
    // disable onerror to prevent endless loop
    source.onerror = "";
    return true;
  }

  useEffect(() => {
    if (props.searchStart) {
      setStyle({
        ...style,
        backgroundColor: "white",
        borderRadius: "30px 30px 0 0",
        borderBottom: "none",
      });
    } else {
      setStyle({
        ...style,
        borderBottom: "1px solid #3C3C3C",
        backgroundColor: "white",
        borderRadius: "50px",
      });
    }
  }, [props.searchStart]);

  const handleOnFocus = () => {
    setStyle({ ...style, backgroundColor: "white" });
  };

  const handleOnBlur = () => {
    if (!props.searchStart) {
      setStyle({ ...style, backgroundColor: "transparent" });
    }
  };

  const renderFilms = (movie: any, index: number) => {
    const handleOnClick = () => {
      props.onFilmClick(movie.file_id);
      setClickedFilm(movie.file_id);
    };
    return (
      <div className="movie-item" key={index} onClick={handleOnClick}>
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
        {clickedFilm === movie.file_id && (
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="title">
        <h2 className="title-h2">Movie Words</h2>
        <h4 className="title-h4">
          Enhance your English vocabulary with movies!
        </h4>
        <div className="search-box">
          <div className={`search-wrap`} style={style}>
            <img className="icon-style" src={searchIcon} alt="search-icon" />
            <input
              className="search-input"
              type="text"
              name="film-name"
              placeholder="Search"
              onChange={props.handleSearch}
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
            />
          </div>
          {props.searchStart && (
            <div className="film-list">
              {props.movieList.length > 0 ? (
                props.movieList.map(renderFilms)
              ) : (
                <div className="loader_wrap">
                  <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              )}
            </div>
          )}
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
