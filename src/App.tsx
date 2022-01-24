import React, { useEffect, useState } from "react";
import "./App.scss";
import "./add-to-home.scss";
import Word from "./components/word";
import { initDB, useIndexedDB } from "react-indexed-db";
import { DBConfig } from "./DBConfig";
import AddToHomeScreen from "@ideasio/add-to-homescreen-react";
import logo from "./images/icons/logo512.png";
import closeIco from "./images/icons/close.svg";

const unique = require("unique-words");

initDB(DBConfig);

const App = () => {
  const [words, setwords] = useState([]);
  const [existingWords, setexistingWords] = useState<any[]>([]);
  const [removedWords, setremovedWords] = useState<any[]>([]);
  const [selectAllWords, setselectAllWords] = useState(false);
  const [widge, setwidge] = useState(false);
  const [playWord, setplayWord] = useState("");
  const { getAll } = useIndexedDB("words");

  useEffect(() => {
    getAll().then((wordinDb) => {
      var wordsDataArray: any[] = [];
      wordinDb.forEach((item) => {
        wordsDataArray.push(item?.word);
      });
      setexistingWords(wordsDataArray);
    });
  }, [setexistingWords]);

  const selectAll = () => {
    setselectAllWords(!selectAllWords);
  };

  const readFile = (event: any) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      var srt = event.target?.result;
      var srtLower = typeof srt === "string" ? srt.toLowerCase() : srt;
      var uniquewords = unique(srtLower);
      var wordsAll = uniquewords.filter((str: any) =>
        str.match(/^(?:(?![0-9]).){2,}$/)
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

  const youGlish = (item: string) => {
    setplayWord(item);
    setwidge(!widge);
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
              accept=".vtt,pdf,.srt,.txt,.svb,.ttml,.dfxp"
              id="file"
              onChange={(e) => readFile(e)}
            />
          </div>
        </div>
        <div className="words-counts">
          <p>{`New Words: ${words.length}`}</p>
          <p>{`Learned Words: ${existingWords?.length}`}</p>
        </div>
        {words.length === 0 && existingWords.length === 0 && (
          <div className="toast">
            <p>Please upload a subtitle file first!</p>
          </div>
        )}
        {words.length !== 0 && existingWords.length === 0 && (
          <div className="toast">
            <p>
              {!selectAllWords
                ? `Please add words to your library by selecting words you already
              know!`
                : `Please remove words from your library by selecting words you don't know yet!`}
            </p>
          </div>
        )}
        {words.length !== 0 && (
          <>
            <div className="red-color new-set">
              <p className="red-sub">New words in this file!</p>
              <button className="add-all-btn" onClick={() => selectAll()}>
                {selectAllWords ? `Remove all` : `Add all`}
              </button>
            </div>
            <div className="words-box">
              {words.map((item, index) => (
                <Word
                  disable={false}
                  invert={selectAllWords}
                  option={1}
                  key={index}
                  item={item}
                  youGlish={(item: string) => youGlish(item)}
                />
              ))}
            </div>
          </>
        )}
        {removedWords && removedWords.length !== 0 && (
          <>
            <p className="sub-title blue-color">Learned words in this file!</p>
            <div className="words-box">
              {removedWords?.map((item, index) => (
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

        {existingWords && existingWords.length !== 0 && (
          <>
            <p className="sub-title green-color">All words you already know!</p>
            <div className="words-box">
              {existingWords.map((item, index) => (
                <Word
                  disable
                  option={3}
                  invert={false}
                  key={index}
                  item={item}
                />
              ))}
            </div>
          </>
        )}
        {((existingWords && existingWords.length !== 0) ||
          words.length !== 0) && (
          <>
            <h5 className="made-with">Made with ❤️</h5>
            <h6 className="copy-name">
              © Lakpriya Senevirathna
              <br />
              CodeScale
            </h6>
          </>
        )}
      </div>
      <AddToHomeScreen
        appId="Word Library"
        startAutomatically={true}
        startDelay={0}
        lifespan={300}
        debug={true}
        skipFirstVisit={false}
        displayPace={0}
        customPromptContent={{
          title: "Do you want to install Word Library on your device?",
          cancelMsg: "",
          installMsg: "Yes, sure!",
          guidanceCancelMsg: "Dismiss",
          src: logo,
        }}
        customPromptElements={{
          container: "athContainer",
          containerAddOns: "",
          banner: "athBanner",
          logoCell: "athLogoCell",
          logoCellAddOns: "athContentCell",
          logo: "athLogo",
          titleCell: "athTitleCell",
          titleCellAddOns: "athContentCell",
          title: "athTitle",
          cancelButtonCell: "athCancelButtonCell",
          cancelButtonCellAddOns: "athButtonCell",
          cancelButton: "athCancelButton",
          installButtonCell: "athInstallButtonCell",
          installButtonCellAddOns: "athButtonCell",
          installButton: "athInstallButton",
          installButtonAddOns: "button",
          guidance: "athGuidance",
          guidanceImageCell: "athGuidanceImageCell",
          guidanceImageCellAddOns: "",
          guidanceCancelButton: "athGuidanceCancelButton",
        }}
      />
    </>
  );
};

export default App;
