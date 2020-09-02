import React, { useState, useEffect } from "react";
import "./App.css";
import MusicList from "./components/MusicList";
import AudioProvider from "./providers/AudioProvider";
import Player from "../src/components/Player";
import ColorThief from "colorthief/dist/color-thief.mjs";

function App() {
  const [song, setSong] = useState(undefined);
  const [canPlay, setCanPlay] = useState(false);
  const [loadedmetadata, setLoadedmetadata] = useState({});
  const [timeUpdate, setTimeUpdate] = useState(undefined);
  const [rgb, setRgb] = useState(undefined);

  useEffect(() => {
    console.log(process.env.API_KEY);
    if (song) {
      const songCoverPlaceholder = document.getElementById("song-cover");
      const player = new AudioProvider();
      const url = song.preview;
      const colorThief = new ColorThief();

      if (songCoverPlaceholder.complete) {
        setRgb(colorThief.getColor(songCoverPlaceholder));
      } else {
        songCoverPlaceholder.addEventListener("load", () => {
          setRgb(colorThief.getColor(songCoverPlaceholder));
        });
      }

      const songSubscription = player.playStream(url).subscribe((event) => {
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
      return () => songSubscription.unsubscribe();
    }
  }, [song]);

  return (
    <div
      className="background"
      style={
        rgb
          ? { backgroundColor: `RGB(${rgb})`, transition: "ease-in 1s" }
          : null
      }
    >
      <header>
        <nav
          style={{
            backgroundColor: "black",
            height: "50px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <h1 style={{ color: "white", margin: "1%" }}>Audio Player</h1>{" "}
        </nav>
      </header>
      <div>
        {song && song.album.cover ? (
          <img
            crossOrigin="anonymous"
            id="song-cover"
            alt=""
            style={{
              maxHeight: "250px",
              maxWidth: "auto",
              marginTop: "2%",
              marginRight: "auto",
              marginLeft: "auto",
              display: "block",
            }}
            src={song.album.cover_big}
          />
        ) : (
          <img
            alt=""
            style={{
              maxHeight: "150px",
              maxWidth: "auto",
              marginTop: "2%",
              marginRight: "auto",
              marginLeft: "auto",
              display: "block",
            }}
            src="https://maxcdn.icons8.com/Share/icon/Very_Basic/music1600.png"
          />
        )}

        <h2 style={{ textAlign: "center" }}>
          {song ? song.title : "Audio Player"}
        </h2>
      </div>
      <div
        style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
      >
        <Player
          currTime={timeUpdate ? timeUpdate.time : "00:00"}
          duration={loadedmetadata.data ? loadedmetadata.data.time : "00:00"}
        />
      </div>
      <MusicList song={song} setSong={setSong} />
    </div>
  );
}

export default App;
