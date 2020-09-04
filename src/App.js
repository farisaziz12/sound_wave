import React, { useState, useEffect } from "react";
import { BehaviorSubject, fromEvent, timer } from "rxjs";
import { debounce, distinct } from "rxjs/operators";
import "./App.css";
import MusicList from "./components/MusicList";
import AudioProvider from "./providers/AudioProvider";
import Player from "../src/components/Player";
import ColorThief from "colorthief/dist/color-thief.mjs";
import Recorder from "./components/Recorder";

function App() {
  const player = new AudioProvider();
  const search$ = new BehaviorSubject("");

  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(undefined);
  const [currSongIndex, setCurrSongIndex] = useState(undefined);
  const [loadedmetadata, setLoadedmetadata] = useState({});
  const [timeUpdate, setTimeUpdate] = useState(undefined);
  const [rgb, setRgb] = useState(undefined);
  const [audioPlayer, setAudioPlayer] = useState(undefined);
  const [songOnHover, setSongOnHover] = useState(undefined);

  useEffect(() => {
    const musicList = document.getElementById("music-list");
    const mouseEvent = fromEvent(musicList, "mousemove");
    const subscription = mouseEvent
      .pipe(
        distinct(),
        debounce(() => timer(100))
      )
      .subscribe((e) => {
        const songId =
          parseInt(e.target.id).toString() === "NaN"
            ? undefined
            : parseInt(e.target.id);

        if (typeof songId === "number") {
          const matchedSong = songs.find((song) => song.id === songId);

          if (matchedSong) {
            setSongOnHover(matchedSong);
          }
        } else if (typeof e.target.id === "string") {
          setSongOnHover(undefined);
        }
      });
    return () => subscription.unsubscribe();
  }, [songs]);

  useEffect(() => {
    const musicList = document.getElementById("music-list");
    const mouseClick = fromEvent(musicList, "click");

    const subscription = mouseClick.subscribe(() => {
      if (songOnHover) {
        setSong(songOnHover);
      }
    });

    return () => subscription.unsubscribe();
  }, [songOnHover]);

  useEffect(() => {
    if (song) {
      const url = song.preview;
      const songCoverPlaceholder = document.getElementById("song-cover");
      const colorThief = new ColorThief();

      if (songCoverPlaceholder.complete) {
        setRgb(colorThief.getColor(songCoverPlaceholder));
      } else {
        songCoverPlaceholder.addEventListener("load", () => {
          try {
            setRgb(colorThief.getColor(songCoverPlaceholder));
          } catch (error) {
            console.log(error);
          }
        });
      }

      setCurrSongIndex(songs.indexOf(song));
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

          default:
        }
      });
      return () => songSubscription.unsubscribe();
    }
  }, [song]);

  const nextOrLastSong = (position) => {
    if (position === "next") {
      const nextSong = songs[currSongIndex + 1];
      if (nextSong) {
        setSong(nextSong);
      }
    } else {
      const prevSong = songs[currSongIndex - 1];
      if (prevSong) {
        setSong(prevSong);
      }
    }
  };

  const handleRecognisedSong = (titleAndArtist) => {
    search$.next(titleAndArtist);
  };

  const handleShuffle = () => {
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    setSong(randomSong);
  };

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
          <h1 style={{ color: "white", margin: "1%" }}>Sound Wave</h1>{" "}
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
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "2%",
        }}
      >
        <Player
          song={song}
          currTime={timeUpdate ? timeUpdate.time : "00:00"}
          play={() => audioPlayer.play()}
          pause={() => audioPlayer.pause()}
          duration={loadedmetadata.data ? loadedmetadata.data.time : "00:00"}
          nextOrLastSong={nextOrLastSong}
          handleShuffle={handleShuffle}
        />
      </div>
      <Recorder
        handleRecognisedSong={handleRecognisedSong}
        audioPlayer={audioPlayer}
      />
      <MusicList
        search$={search$}
        songs={songs}
        setSongs={setSongs}
        song={song}
        setSong={setSong}
      />
    </div>
  );
}

export default App;
