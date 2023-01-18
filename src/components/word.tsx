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
  const [marked, setmarked] = useState(false);
  const [meaning,setMeaning]= useState<any[]>([]);
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

const getMeaning=()=>{
  fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+item)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    setMeaning(data);
    
  }).catch((err) => {
    console.log('Failed to load');
});
}


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
        {/* <p className="p-words" onClick={() => markWord()}>
          {item}
        </p> */}
        <p id={item} className="p-words" onClick={() => markWord()} onMouseEnter={getMeaning}>{item}</p>
        <Tooltip anchorId={item} place="top" style={{ backgroundColor: "#fff", color: "#000" }} clickable>
          
            {meaning.length>0 && (
              <>
              <div className="word-details">
              <span>{meaning[0]['word']}</span>
              &nbsp;
              <span>{meaning[0]['phonetic']}</span>
              &nbsp;
              <img src={speaker} height={20} alt="" />
            </div>
          <div className="word-origin">
          {meaning[0]['origin']}
          </div>
        
          {meaning[0]["meanings"].map((item:any)=>{
            return (
              <dl>
                <dt>{item["partOfSpeech"]}<img src={downArrow} height={5} alt="" /></dt>
                <dd><b>definition: </b>{item["definitions"][0]["definition"]}</dd>
                <dd><b>example: </b>{item["definitions"][0]["example"]}</dd>
                
              </dl>
            );
          })}
              </>

            )}
            
          
        </Tooltip>
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
