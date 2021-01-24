import React, { useEffect, useState } from 'react';
import './Popup.scss';

const WPM = 100;
const FONT_SIZE = 70;

const Popup = () => {
  const [text, setText] = useState(""); // Text taken from browser
  const [isPaused, setIsPaused] = useState(true); // Initial state is paused
  const [words, setWords] = useState([]); // Array of words taken from the text
  const [wordIndex, setWordIndex] = useState(0); // pointer of current word

  // BROWSER SPECIFIC
  useEffect(() => {
    chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {
      setText(selection[0]);
      setWords(selection[0].split(" "));
    });
  }, []);

  // HELPERS
  const timeout = (delay) => new Promise( res => setTimeout(res, delay) );
  const hasNextWord = wordIndex + 1 < words.length;

  useEffect(() => {
    const play = async () => {
      if (hasNextWord && !isPaused) {
        await timeout(WPM);
        setWordIndex(wordIndex + 1);
      } else {
        setIsPaused(true);
      }
    }
    play();
  }, [hasNextWord, isPaused, wordIndex]);

  // PLAYER CONTROLERS
  const togglePlayer = () => setIsPaused(!isPaused);
  const resetPlayer = () => setWordIndex(0);
  const moveBackward = () => {
    if (wordIndex > 0 && isPaused) setWordIndex(wordIndex - 1);
  }
  const moveForward = () => {
    if (hasNextWord && isPaused) setWordIndex(wordIndex + 1);
  }

  // UI CONTROLLERS
  const actionIcon = isPaused ? "play_arrow" : "pause";
  const playerTimer = wordIndex === 0 ? 0 : (100 / words.length) * (wordIndex + 1);

  return (
    <div className="player">
      <div className="cover"></div>
      <nav>
        <div className="left">
          <p className="spacer">
            WPM <strong>{WPM}</strong>
          </p>
          <p>
            Font size <strong>{FONT_SIZE}</strong>
          </p>
        </div>
        <div className="right">
          <i className="material-icons spacer">settings</i>
          <i className="material-icons">assessment</i>
        </div>
      </nav>
      <div className="player-ui">
        <div className="title">
        <h3>{text === "" ? "---" : words[wordIndex]}</h3>
        </div>
        <div className="small">
          <i onClick={resetPlayer} className="material-icons">replay</i>
          {/* <i className="material-icons">volume_up</i> */}
        </div>
        <div className="progress">
          <div style={{ width: `${playerTimer}%` }} className="played">
            <div style={{ marginLeft: `${playerTimer * 3}px` }} className="circle"></div>
          </div>
        </div>
        <div className="controls">
          <i onClick={moveBackward} className="material-icons">skip_previous</i>
          <i onClick={togglePlayer} className="material-icons">{actionIcon}</i>
          <i onClick={moveForward} className="material-icons">skip_next</i>
        </div>
      </div>
      <nav>
        <div className="left">
          <i className="material-icons spacer">favorite</i>
        </div>
        <div className="right">
          <p className="spacer">
            Selected words <strong>{words.length}</strong>
          </p>
        </div>
      </nav>
    </div>
  );
};

export default Popup;
