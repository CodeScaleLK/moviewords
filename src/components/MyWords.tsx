import React from "react";
import Word from "./word";
import arrowIcon from "./../images/icons/arrow.svg";
function MyWords(props: any) {
  const handleOnBackClick = () => {
    props.setCurrentPage("home");
  };
  return (
    <>
      <button onClick={handleOnBackClick} className="home-icon">
        <img src={arrowIcon} alt="Home" />
        <span>Home</span>
      </button>

      <h2 className="title-h2">Film Words</h2>
      <h4 className="title-h4">
        Learn new english words, before watching a film!
      </h4>
      <p className="sub-title green-color">All words you already know!</p>
      {props.existingWords && props.existingWords.length !== 0 && (
        <>
          {props.existingWords && props.existingWords.length !== 0 && (
            <>
              <div className="words-box">
                {props.existingWords.map((item: any, index: any) => (
                  <Word
                    disable
                    option={3}
                    invert={false}
                    key={index}
                    item={item}
                    youGlish={props.youGlish}
                  />
                ))}
              </div>
            </>
          )}
          {props.words.length !== 0 && props.existingWords.length === 0 && (
            <div className="toast">
              <p>
                {!props.selectAllWords
                  ? `Please add words to your library by selecting words you already
              know!`
                  : `Please remove words from your library by selecting words you don't know yet!`}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default MyWords;
