import React, { useEffect, useState } from "react";

export default function Player(props) {
  const {
    currTime,
    duration,
    play,
    pause,
    song,
    nextOrLastSong,
    handleShuffle,
  } = props;
  const [currTimeSec, setCurrTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const currTimeSeconds =
      parseInt(currTime[0] + currTime[1]) * 60 +
      parseInt(currTime[3] + currTime[4]);
    setCurrTimeSec(currTimeSeconds);
    const durationSeconds =
      parseInt(duration[0] + duration[1]) * 60 +
      parseInt(duration[3] + duration[4]);
    setDurationSec(durationSeconds);
  }, [currTime, duration]);

  const handlePlay = () => {
    if (song) {
      setPaused(!paused);
      if (paused) {
        play();
      } else {
        pause();
      }
    }
  };
  return (
    <div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          marginBottom: "2%",
        }}
      >
        <b>{currTime}</b>
        <progress
          style={{ marginLeft: "1%", marginRight: "1%" }}
          value={currTimeSec && durationSec ? currTimeSec / durationSec : 0}
          max="1"
        ></progress>
        <b>{duration}</b>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button onClick={() => nextOrLastSong("last")}>{"<<"}</button>
        <button
          style={{ marginLeft: "2%", marginRight: "2%", width: "50px" }}
          onClick={handlePlay}
        >
          {!paused ? "►" : "❚❚"}
        </button>
        <button onClick={() => nextOrLastSong("next")}>{">>"}</button>
      </div>
      <button
        onClick={handleShuffle}
        style={{
          display: "block",
          marginTop: "2%",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        Shuffle
      </button>
    </div>
  );
}
