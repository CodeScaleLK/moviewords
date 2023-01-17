import React from "react";
import Word from "./word";


function WordList(props: any){

    return (
        <>
        <h2 className="title-h2">Film Words</h2>
        <h4 className="title-h4">Learn new english words, before watching a film!</h4>
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
              {props.words.map((item:any, index:any) => (
                <Word
                  disable={false}
                  invert={props.selectAllWords}
                  option={1}
                  key={index}
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
              {props.removedWords?.map((item:any, index:any) => (
                <Word
                  disable
                  option={2}
                  invert={false}
                  key={index}
                  item={item}
                />
              ))}
            </div>
          </>
        )}
        </>
    );
};

export default WordList;