import React, { useState } from "react";
import { useIndexedDB } from "react-indexed-db";

const Word = ({
  item,
  disable = false,
  option,
}: {
  item: string;
  disable: boolean | undefined;
  option: number;
}) => {
  const { add, deleteRecord } = useIndexedDB("words");
  const [marked, setmarked] = useState(false);

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
      <p
        onClick={() => markWord()}
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
        {item}
      </p>
    </>
  );
};

export default Word;
