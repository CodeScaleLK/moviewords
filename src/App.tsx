import React, { useEffect, useState } from "react";
import "./App.scss";
import "./add-to-home.scss";
import Word from "./components/word";
import { initDB, useIndexedDB } from "react-indexed-db";
import { DBConfig } from "./DBConfig";
import AddToHomeScreen from "@ideasio/add-to-homescreen-react";
import HomePage from "./components/HomePage";
import MyWords from "./components/MyWords";
import WordList from "./components/WordList";
import logo from "./images/icons/logo512.png";
import closeIco from "./images/icons/close.svg";
import { cachedDataVersionTag } from "v8";
import buyMeCoffee from "./images/bmc.png";
import paypal from "./images/paypal.png";

const unique = require("unique-words");

initDB(DBConfig);

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [filmName, setFilmName] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [listStyle, setListStyle] = useState({ display: "none" });
  const [words, setWords] = useState([]);
  const [existingWords, setExistingWords] = useState<any[]>([]);
  const [removedWords, setRemovedWords] = useState<any[]>([]);
  const [selectAllWords, setSelectAllWords] = useState(false);
  const [widget, setWidget] = useState(false);
  const [playWord, setPlayWord] = useState("");
  const { getAll } = useIndexedDB("words");

  // getting film list
  useEffect(() => {
    if (filmName !== "") {
      setListStyle({ display: "block" });
    } else {
      setMovieList([]);
    }
    const timer = setTimeout(() => {
      if (filmName !== "") {
        fetch(
          "https://api.opensubtitles.com/api/v1/subtitles?languages=en&query=" +
            filmName,
          {
            headers: {
              "Content-Type": "application/json",
              "Api-Key": "mv4hWR0xPzGzcaPa74hXPAamKhd9TtgP",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data["status"] === 400) {
              console.log("Name is too short");
            }
            let filmList = data
              ? data["data"].map((item: any) => ({
                  film_id: item["id"],
                  file_id: item["attributes"]["files"][0]["file_id"],
                  title: item["attributes"]["feature_details"]["title"],
                  name: item["attributes"]["feature_details"]["movie_name"],
                  year: item["attributes"]["feature_details"]["year"],
                  img: item?.["attributes"]?.["related_links"]?.[0]?.[
                    "img_url"
                  ],
                }))
              : {};
            const uniqueNames = [""];
            const uniqueFilms = filmList.filter((element: any) => {
              const isDuplicate = uniqueNames.includes(element.name);
              if (!isDuplicate) {
                uniqueNames.push(element.name);
                return true;
              }
              return false;
            });
            setMovieList(uniqueFilms);
          })
          .catch((err) => {
            console.log("Failed to load: " + err);
          });
      } else {
        setListStyle({ display: "none" });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [filmName]);

  useEffect(() => {
    getAll().then((wordInDB) => {
      var wordsDataArray: any[] = [];
      wordInDB.forEach((item) => {
        wordsDataArray.push(item?.word);
      });
      setExistingWords(wordsDataArray);
    });
  }, [getAll, setExistingWords]);

  const selectAll = () => {
    setSelectAllWords(!selectAllWords);
  };

  const readFile = (file: any) => {
    setCurrentPage("wordlist");
    var reader = new FileReader();
    reader.onload = (event) => {
      var srt = event.target?.result;
      var srtLower = typeof srt === "string" ? srt.toLowerCase() : srt;
      var uniqueWords = unique(srtLower);
      var wordsAll = uniqueWords.filter((str: any) =>
        str.match(/^(?:(?![0-9]).){2,}$/)
      );
      var removeOb: any = {};
      existingWords?.forEach((e) => (removeOb[e] = true));
      var newWords = wordsAll.filter((v: any) => !removeOb[v]);
      var removeDW = wordsAll.filter((v: any) => removeOb[v]);
      setRemovedWords(removeDW);
      setWords(newWords);
    };

    reader.readAsText(file);
  };

  const uploadFile = (e: any) => {
    readFile(e.target.files[0]);
  };
  const youGlish = (item: string) => {
    setPlayWord(item);
    setWidget(!widget);
  };

  const handleSearch = (e: any) => {
    const searchPhrase = e.target.value.replace(/ /g, "");
    setFilmName(searchPhrase);
  };

  const onFilmClick = (filmId: number) => {
    setFilmName("");
    fetch("https://api.opensubtitles.com/api/v1/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "mv4hWR0xPzGzcaPa74hXPAamKhd9TtgP",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
      body: '{"file_id":' + filmId + "}",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data["link"], {
          headers: {
            "Content-Type": "application/json",
            "Api-Key": "mv4hWR0xPzGzcaPa74hXPAamKhd9TtgP",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        });
        fetch(data["link"])
          .then((response) => response.text())
          .then((subtitles) => {
            const file = new File([subtitles], "subtitles.srt", {
              type: "text/plain",
            });
            readFile(file);
          });
      })
      .catch((err) => {
        console.log("Failed to download");
      });
  };
  let displayPage = (
    <HomePage
      handleSearch={handleSearch}
      movieList={movieList}
      onFilmClick={onFilmClick}
      listStyle={listStyle}
      uploadFile={uploadFile}
      setCurrentPage={setCurrentPage}
    />
  );
  switch (currentPage) {
    case "home":
      displayPage = (
        <HomePage
          handleSearch={handleSearch}
          movieList={movieList}
          onFilmClick={onFilmClick}
          listStyle={listStyle}
          uploadFile={uploadFile}
          setCurrentPage={setCurrentPage}
        />
      );
      break;
    case "mywords":
      displayPage = displayPage = (
        <MyWords
          existingWords={existingWords}
          setCurrentPage={setCurrentPage}
          words={words}
          selectAllWords={selectAllWords}
        />
      );
      break;
    case "wordlist":
      displayPage = (
        <WordList
          existingWords={existingWords}
          words={words}
          selectAllWords={selectAllWords}
          removedWords={removedWords}
          youGlish={youGlish}
          selectAll={selectAll}
          setCurrentPage={setCurrentPage}
        />
      );
      break;
    default:
      displayPage = (
        <HomePage
          handleSearch={handleSearch}
          movieList={movieList}
          onFilmClick={onFilmClick}
          listStyle={listStyle}
          uploadFile={uploadFile}
          setCurrentPage={setCurrentPage}
        />
      );
      break;
  }

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

      <div className="content">{displayPage}</div>
      <div className="donate-row">
        <button>
          <img src={buyMeCoffee} alt="buy_me_coffee" />
        </button>
        <button>
          <img src={paypal} alt="paypal" />
        </button>
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
