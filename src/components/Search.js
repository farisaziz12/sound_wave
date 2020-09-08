import React, { useState, useEffect } from "react";
import "../App.css";

export default function Search(props) {
  const { search$, audioPlayer } = props;
  const [recognition, setRecognition] = useState(undefined);
  const [recognising, setRecognising] = useState(false);
  const [recognitionError, setRecognitionError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      setRecognition(new SpeechRecognition());
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.onstart = function () {
        setRecognising(true);
      };
      recognition.onspeechend = function () {
        setRecognising(false);
      };
      recognition.onerror = function (event) {
        if (event.error === "no-speech") {
          setRecognitionError(true);
        }
      };
      recognition.onresult = function (event) {
        const current = event.resultIndex;

        const transcript = event.results[current][0].transcript;

        setSearch(transcript);

        search$.next(transcript);
      };
    }
  }, [recognition]);

  useEffect(() => {
    search$.next(search);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleClick = () => {
    if (audioPlayer) {
      audioPlayer.pause();
    }
    recognition.start();
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Search Songs</h3>
      <div className="search-container">
        <input
          onChange={handleSearch}
          placeholder="Search"
          className="search-input"
          type="text"
          value={search}
        />
        <button onClick={handleClick} className="dictate-btn">
          <span role="img" aria-label="">
            🎤
          </span>
        </button>
      </div>
      <p style={{ textAlign: "center" }}>
        Click the microphone to search a song name by dictation
      </p>
    </div>
  );
}
