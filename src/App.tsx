import React, { useState } from "react";
import "./App.css";
import Word from "./components/word";
const unique = require("unique-words");

const App = () => {
  const [words, setwords] = useState([]);

  const readFile = (event: any) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      var srt = event.target?.result;
      var srtLower = typeof srt === "string" ? srt.toLowerCase() : srt;
      var uniquewords = unique(srtLower);
      var words1 = uniquewords.filter((str: any) =>
        str.match(/^(?:(?![0-9]).)*$/)
      );
      setwords(words1);
    };

    reader.readAsText(file);
  };

  return (
    <div className="content">
      <div className="title">
        <h2>Words Library</h2>
        <h4>Get to know all unknown English words before watching a film!</h4>
        <div className="file-input">
          <input
            type="file"
            name="file"
            id="file"
            onChange={(e) => readFile(e)}
          />
        </div>
      </div>
      <div className="words-box">
        {words.map((item, index) => (
          <Word item={item} />
        ))}
      </div>
    </div>
  );
};

export default App;
