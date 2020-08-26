import React, { useState, useEffect } from "react";
import "./App.css";
import MusicList from "./components/MusicList";
import AudioProvider from "./providers/AudioProvider";
import Player from "../src/components/Player";

function App() {
  const [song, setSong] = useState(undefined);
  const [canPlay, setCanPlay] = useState(false);
  const [loadedmetadata, setLoadedmetadata] = useState({});
  const [timeUpdate, setTimeUpdate] = useState(undefined);

  useEffect(() => {
    if (song) {
      const player = new AudioProvider();
      const songSubscription = player
        .playStream(song.url)
        .subscribe((event) => {
          const audioObj = event.target;

          switch (event.type) {
            case "canplay":
              return setCanPlay(true);

            case "loadedmetadata":
              return setLoadedmetadata({
                value: true,
                data: {
                  time: player.formatTime(audioObj.duration * 1000, "mm:ss"),
                  timeSec: audioObj.duration,
                  mediaType: "mp3",
                },
              });

            case "timeupdate":
              setTimeUpdate({
                timeSec: audioObj.currentTime,
                time: player.formatTime(audioObj.currentTime * 1000, "mm:ss"),
              });
          }
        });
    }
  }, [song]);

  return (
    <>
      <header>
        <nav
          style={{
            backgroundColor: "blue",
            height: "50px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "white" }}>Audio Player</h1>{" "}
        </nav>
      </header>
      <div>
        <img
          style={{
            maxHeight: "150px",
            maxWidth: "auto",
            marginRight: "auto",
            marginLeft: "auto",
            display: "block",
          }}
          src="https://maxcdn.icons8.com/Share/icon/Very_Basic/music1600.png"
        />
        <h2 style={{ color: "blue", textAlign: "center" }}>Audio Player</h2>
      </div>
      <Player
        currTime={timeUpdate ? timeUpdate.time : "00:00"}
        duration={loadedmetadata.data ? loadedmetadata.data.time : "00:00"}
      />
      <MusicList song={song} setSong={setSong} />
    </>
  );
}

export default App;
