import React from "react";
import Word from "./word";
import homeIcon from "./../images/icons/home.svg";
function MyWords(props: any) {
  return (
    <>
      {props.existingWords && props.existingWords.length !== 0 && (
        <>
          <img
            src={homeIcon}
            onClick={() => {
              props.setCurrentPage("home");
            }}
            className="home-icon"
            alt="Home"
          />
          <h2 className="title-h2">Film Words</h2>
          <h4 className="title-h4">
            Learn new english words, before watching a film!
          </h4>
          <p className="sub-title green-color">All words you already know!</p>
          <div className="words-box">
            {props.existingWords.map((item: any, index: any) => (
              <Word disable option={3} invert={false} key={index} item={item} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
export default MyWords;
