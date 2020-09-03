import React, { useState, useEffect } from "react";
import "./App.css";
import MusicList from "./components/MusicList";
import AudioProvider from "./providers/AudioProvider";
import Player from "../src/components/Player";
import ColorThief from "colorthief/dist/color-thief.mjs";

function App() {
  const player = new AudioProvider();
  const [song, setSong] = useState(undefined);
  const [loadedmetadata, setLoadedmetadata] = useState({});
  const [timeUpdate, setTimeUpdate] = useState(undefined);
  const [rgb, setRgb] = useState(undefined);
  const [audioPlayer, setAudioPlayer] = useState(undefined);

  useEffect(() => {
    if (song) {
      const url = song.preview;
      const songCoverPlaceholder = document.getElementById("song-cover");
      const colorThief = new ColorThief();

      if (songCoverPlaceholder.complete) {
        setRgb(colorThief.getColor(songCoverPlaceholder));
      } else {
        songCoverPlaceholder.addEventListener("load", () => {
          setRgb(colorThief.getColor(songCoverPlaceholder));
        });
      }

      setAudioPlayer(player);

      const songSubscription = player.playStream(url).subscribe((event) => {
        const audioObj = event.target;
        console.log(event.type);

        switch (event.type) {
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
            return setTimeUpdate({
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
              border: "solid 1px white",
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
          song={song}
          currTime={timeUpdate ? timeUpdate.time : "00:00"}
          play={() => audioPlayer.play()}
          pause={() => audioPlayer.pause()}
          duration={loadedmetadata.data ? loadedmetadata.data.time : "00:00"}
        />
      </div>
      <MusicList song={song} setSong={setSong} />
    </div>
  );
}

export default App;
