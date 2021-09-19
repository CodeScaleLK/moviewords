import React, { useState } from "react";

const Word = ({ item }: { item: string }) => {
  const [marked, setmarked] = useState(false);

  const markWord = () => {
    setmarked(!marked);
  };
  return (
    <>
      <p onClick={() => markWord()} className={marked ? "marked-word" : "word"}>
        {item}
      </p>
    </>
  );
};

export default Word;
