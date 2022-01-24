import React, { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db";
import play from "../images/icons/play.png";

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
  const [marked, setmarked] = useState(false);

  useEffect(() => {
    if (!disable) {
      if (invert) {
        setmarked(true);
        add({ word: item }).then(
          (e) => {
            console.log("Successfully added word: ", e);
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        setmarked(false);
        deleteRecord(item).then((e) => {
          console.log("Successfully removed word: ", e);
        });
      }
    }
  }, [disable, invert]);

  const markWord = () => {
    if (disable) return;
    setmarked(!marked);
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

  return (
    <>
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
        <p className="p-words" onClick={() => markWord()}>
          {item}
        </p>
        {option === 1 && (
          <div className="playable">
            <img src={play} alt="play" className="play"></img> {item}
          </div>
        )}
      </div>
    </>
  );
};

export default Word;
