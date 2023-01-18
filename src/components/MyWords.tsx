import React from "react";
import Word from "./word";
import buyMeCoffee from "./../images/bmc.png";
import paypal from "./../images/paypal.png";
import homeIcon from "./../images/icons/home.svg";
function MyWords(props:any){

    return (
        <>
         <img src={homeIcon} onClick={()=>{props.setCurrentPage('home')}} className="home-icon" alt="Home" />
            <h2 className="title-h2">Film Words</h2>
            <h4 className="title-h4">Learn new english words, before watching a film!</h4>
            <p className="sub-title green-color">All words you already know!</p>
        {props.existingWords && props.existingWords.length !== 0 && (
          <>
           
            <div className="words-box">
              {props.existingWords.map((item: any, index: any) => (
                
                <Word
                  disable
                  option={3}
                  invert={false}
                  key={index}
                  item={item}
                  youGlish={props.youGlish}
                />
              
              ))}
            </div>
            

          </>
        )}
        {props.words.length !== 0 && props.existingWords.length === 0 && (
          <div className="toast">
            <p>
              {!props.selectAllWords
                ? `Please add words to your library by selecting words you already
              know!`
                : `Please remove words from your library by selecting words you don't know yet!`}
            </p>
          </div>
        )}
        
        </>
    );
}
export default MyWords;