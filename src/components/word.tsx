import React, { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db";
import play from "../images/icons/play.png";
import { Tooltip } from "react-tooltip";
import speaker from "../images/icons/speaker.svg";
import downArrow from "../images/icons/down.svg";
const Word = ({
  item,
  disable = false,
  option,
  invert,
  youGlish,
}: {
  item: string;
  disable: boolean | undefined;
  option: number;
  invert: boolean;
  youGlish?: Function;
}) => {
  const { add, deleteRecord } = useIndexedDB("words");
  const [marked, setMarked] = useState(false);
  const [meaning, setMeaning] = useState<any[]>([]);
  const [widget, setWidget] = useState(false);
  const [playWord, setPlayWord] = useState("");

  useEffect(() => {
    if (!disable) {
      if (invert) {
        setMarked(true);
        add({ word: item }).then(
          (e) => {
            console.log("Successfully added word: ", e);
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        setMarked(false);
        deleteRecord(item).then((e) => {
          console.log("Successfully removed word: ", e);
        });
      }
    }
  }, [disable, invert]);

  const getMeaning = () => {
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + item)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMeaning(data);
      })
      .catch((err) => {
        console.log("Failed to load");
      });
  };

  const markWord = () => {
    if (disable) return;
    setMarked(!marked);
    if (!marked) {
      add({ word: item }).then(
        (e) => {
          console.log("Successfully added word: ", e);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      deleteRecord(item).then((e) => {
        console.log("Successfully removed word: ", e);
      });
    }
  };
  const playYouGlish = () => {
    setPlayWord(item);
    setWidget(!widget);
  };

  return (
    <>
      <div className="modal_container">
        <div className="ygParent">
          <a
            id="yg-widget-0"
            className="youglish-widget"
            data-components="7423"
            data-delay-load="1"
            data-toggle-ui="1"
            href="https://youglish.com"
          >
            {" "}
          </a>
        </div>
      </div>
      <div
        className={
          option === 2
            ? "known-word"
            : option === 3
            ? "in-list-word"
            : marked
            ? "marked-word"
            : "word"
        }
      >
        {/* <p className="p-words" onClick={() => markWord()}>
          {item}
        </p> */}
        <p
          id={item}
          className="p-words"
          onClick={() => markWord()}
          onMouseEnter={getMeaning}
        >
          {item}
        </p>
        <Tooltip
          anchorId={item}
          place="top"
          delayHide={1000}
          delayShow={500}
          style={{
            backgroundColor: "#D9FFD9",
            color: "#000",
            borderRadius: "10px",
            opacity: 1,
            width: "500px",
            maxWidth: "90%",
          }}
          clickable
        >
          {meaning.length > 0 && (
            <>
              <div className="word-details">
                <div className="meaning_wrap">
                  <span className="wd_element tooltip_word">
                    <b>{meaning[0]?.["word"]}</b>
                  </span>
                  &nbsp;
                  <span className="wd_element">{meaning[0]?.["phonetic"]}</span>
                  &nbsp;
                  {meaning[0]?.["phonetics"]?.[0]?.["audio"] && (
                    <span className="wd_element">
                      <img
                        src={speaker}
                        height={20}
                        alt="sound"
                        onClick={() => {
                          const sound = new Audio(
                            meaning[0]?.["phonetics"]?.[0]?.["audio"]
                          );
                          sound.play();
                        }}
                      />
                    </span>
                  )}
                  &nbsp;
                  {option === 1 && (
                    <span className="playable wd_element">
                      <img
                        src={play}
                        height={20}
                        onClick={playYouGlish}
                        alt=""
                      />
                      {item}
                    </span>
                  )}
                </div>
              </div>
              <div className="word-origin">
                {meaning[0]?.["meanings"].map((item: any, index: number) => {
                  return (
                    <dl key={index}>
                      <dt>{item?.["partOfSpeech"]}</dt>
                      <dd>
                        <b>definition: </b>
                        {item?.["definitions"]?.[0]?.["definition"]}
                      </dd>
                      {item?.["definitions"]?.[0]?.["example"] && (
                        <dd>
                          <b>example: </b>
                          {item?.["definitions"]?.[0]?.["example"]}
                        </dd>
                      )}
                    </dl>
                  );
                })}
              </div>
            </>
          )}
        </Tooltip>
      </div>
    </>
  );
};

export default Word;
