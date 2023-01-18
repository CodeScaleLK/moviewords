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

const unique = require("unique-words");

initDB(DBConfig);

const App = () => {
  const [currentPage,setCurrentPage]= useState('home');
  const [filmName,setFilmName]= useState('');
  const [movieList, setMovieList]= useState([]);
  const [listStyle, setListStyle] = useState({display:'none'});
  const [words, setwords] = useState([]);
  const [existingWords, setexistingWords] = useState<any[]>([]);
  const [removedWords, setremovedWords] = useState<any[]>([]);
  const [selectAllWords, setselectAllWords] = useState(false);
  const [widge, setwidge] = useState(false);
  const [playWord, setplayWord] = useState("");
  const { getAll } = useIndexedDB("words");
  
  // getting film list
  useEffect(() => {
    const timer= setTimeout(() => {
      if(filmName!==''){
        setListStyle({display:'block'});
        fetch("https://api.opensubtitles.com/api/v1/subtitles?languages=en&query="+filmName,
      {
        headers: {
          'Api-Key': 'mv4hWR0xPzGzcaPa74hXPAamKhd9TtgP'
        },
        
      })
        .then((response) => response.json())
        .then((data) => {
          if(data['status'] === 400){
            console.log('Name is too short');
          }
          let filmList= data?data['data'].map((item:any)=>(
            {
              film_id:item['id'],
              file_id:item['attributes']['files'][0]['file_id'],
              name:item['attributes']['feature_details']['title'],
              year:item['attributes']['feature_details']['year'],
              img:item['attributes']['related_links'][0]['img_url'],
          })):{};

          const uniqueNames = [''];

          const uniqueFilms = filmList.filter((element:any) => {
            const isDuplicate = uniqueNames.includes(element.name);

            if (!isDuplicate) {
              uniqueNames.push(element.name);

              return true;
            }

            return false;
          });

          console.log(uniqueFilms);
          
          setMovieList(uniqueFilms);


        })
        .catch((err) => {
            console.log('Failed to load');
        });
      }else{
        setListStyle({display:'none'});
      }     
    }, 2000);
  
    return () => clearTimeout(timer)
  }, [filmName])
  

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

  const readFile = (file: any) => {
    setCurrentPage('wordlist');
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

  const uploadFile =  (e:any)=>{
    readFile(e.target.files[0])
    
  }
  const youGlish = (item: string) => {
    setplayWord(item);
    setwidge(!widge);
  };


  const handleSearch = (e: any) =>{
      setFilmName(e.target.value);   
  }

  const onFilmClick= (filmId:number)=>{
    setFilmName("");
    console.log(filmId);
    fetch("https://api.opensubtitles.com/api/v1/download",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': 'mv4hWR0xPzGzcaPa74hXPAamKhd9TtgP'
        },
        body: '{"file_id":'+filmId+'}'
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data['link']);
          fetch(data['link'])
          .then(response => response.text())
          .then(subtitles => {
            const file = new File([subtitles], 'subtitles.srt', { type: 'text/plain' });
            readFile(file);
    
          });

        })
        .catch((err) => {
            console.log('Failed to download');
        });
    
  }
  let displayPage = 
  <HomePage 
  handleSearch={handleSearch}
  movieList={movieList}
  onFilmClick={onFilmClick}
  listStyle={listStyle}
  uploadFile={uploadFile}
  setCurrentPage={setCurrentPage}

  />
  switch (currentPage) {
    case 'home':
      displayPage = 
        <HomePage 
        handleSearch={handleSearch}
        movieList={movieList}
        onFilmClick={onFilmClick}
        listStyle={listStyle}
        uploadFile={uploadFile}
        setCurrentPage={setCurrentPage}
        />
      break;
    case 'mywords':
      displayPage = <MyWords existingWords={existingWords} setCurrentPage={setCurrentPage} words={words} selectAllWords={selectAllWords} />
      break;
    case 'wordlist':
      displayPage= 
      <WordList 
        existingWords={existingWords}
        words={words}
        selectAllWords={selectAllWords}
        removedWords={removedWords}
        youGlish={youGlish}
        selectAll={selectAll}
        setCurrentPage={setCurrentPage}
        />
      break;
    default:
      displayPage = 
        <HomePage 
        handleSearch={handleSearch}
        movieList={movieList}
        onFilmClick={onFilmClick}
        listStyle={listStyle}
        uploadFile={uploadFile}
        setCurrentPage={setCurrentPage}
        />
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

      <div className="content">
        {displayPage} 
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
