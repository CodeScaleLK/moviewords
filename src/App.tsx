import React, { useEffect, useState } from "react";
import "./App.css";
import Word from "./components/word";
import { initDB, useIndexedDB } from "react-indexed-db";
import { DBConfig } from "./DBConfig";
const unique = require("unique-words");

initDB(DBConfig);

const App = () => {
  const [words, setwords] = useState([]);
  const [existingWords, setexistingWords] = useState<any[]>([]);
  const [removedWords, setremovedWords] = useState<any[]>([]);
  const { getAll } = useIndexedDB("words");

  useEffect(() => {
    getAll().then((wordinDb) => {
      var wordsDataArray: any[] = [];
      wordinDb.forEach((item) => {
        wordsDataArray.push(item?.word);
      });
      setexistingWords(wordsDataArray);
    });
  }, [existingWords]);

  const readFile = (event: any) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      var srt = event.target?.result;
      var srtLower = typeof srt === "string" ? srt.toLowerCase() : srt;
      var uniquewords = unique(srtLower);
      var wordsAll = uniquewords.filter((str: any) =>
        str.match(/^(?:(?![0-9]).)*$/)
      );
      var removeOb: any = {};
      existingWords?.forEach((e) => (removeOb[e] = true));
      var newWords = wordsAll.filter((v: any) => !removeOb[v]);
      var removedw = wordsAll.filter((v: any) => removeOb[v]);
      setremovedWords(removedw);
      setwords(newWords);
    };

    reader.readAsText(file);
  };

  return (
    <div className="content">
      <div className="title">
        <h2>Word Library</h2>
        <h4>Learn new english words, before watching a film!</h4>
        <div className="file-input">
          <label className="file-button" htmlFor="file">
            Upload Subtitle
          </label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={(e) => readFile(e)}
          />
        </div>
      </div>
      <div className="words-counts">
        <p>{`New Words: ${words.length}`}</p>
        <p>{`Learnd Words: ${existingWords?.length}`}</p>
      </div>
      {words.length !== 0 && (
        <>
          <p className="sub-title red-color">New words in this file!</p>
          <div className="words-box">
            {words.map((item, index) => (
              <Word disable={false} option={1} key={index} item={item} />
            ))}
          </div>
        </>
      )}
      {removedWords && removedWords.length !== 0 && (
        <>
          <p className="sub-title blue-color">Learnd words in this file!</p>
          <div className="words-box">
            {removedWords?.map((item, index) => (
              <Word disable option={2} key={index} item={item} />
            ))}
          </div>
        </>
      )}

      {existingWords && existingWords.length !== 0 && (
        <>
          <p className="sub-title green-color">All Words you know!</p>
          <div className="words-box">
            {existingWords.map((item, index) => (
              <Word disable option={3} key={index} item={item} />
            ))}
          </div>
          <h5 className="copy-name">© Lakpriya Senevirathna</h5>
        </>
      )}
    </div>
  );
};

export default App;
