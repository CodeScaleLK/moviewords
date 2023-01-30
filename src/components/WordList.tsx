import React from "react";
import Word from "./word";
import arrowIcon from "./../images/icons/arrow.svg";

function WordList(props: any) {
  const handleOnBackClick = () => {
    props.setCurrentPage("home");
  };
  return (
    <>
      <button onClick={handleOnBackClick} className="home-icon">
        <img src={arrowIcon} alt="Home" />
        <span>Home</span>
      </button>

      <h2 className="title-h2">Movie Words</h2>
      <h4 className="title-h4">Enhance your English vocabulary with movies!</h4>
      <div className="words-counts">
        <p>{`New Words: ${props.words.length}`}</p>
        <p>{`Learned Words: ${props.existingWords?.length}`}</p>
      </div>
      {/* {props.words.length === 0 && props.existingWords.length === 0 && (
          <div className="toast">
            <p>Please upload a subtitle file first!</p>
          </div>
        )} */}
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
      {props.words.length !== 0 && (
        <>
          <div className="red-color new-set">
            <p className="red-sub">New words in this file!</p>
            <button className="add-all-btn" onClick={() => props.selectAll()}>
              {props.selectAllWords ? `Remove all` : `Add all`}
            </button>
          </div>
          <div className="words-box">
            {props.words.map((item: any, index: any) => (
              <Word
                key={index}
                disable={false}
                invert={props.selectAllWords}
                option={1}
                item={item}
                youGlish={(item: string) => props.youGlish(item)}
              />
            ))}
          </div>
        </>
      )}
      {props.removedWords && props.removedWords.length !== 0 && (
        <>
          <p className="sub-title blue-color">Learned words in this file!</p>
          <div className="words-box">
            {props.removedWords?.map((item: any, index: any) => (
              <Word disable option={2} invert={false} key={index} item={item} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default WordList;
