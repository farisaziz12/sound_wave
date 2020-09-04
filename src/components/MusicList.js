import React, { useState, useEffect } from "react";
import CloudProvider from "../providers/CloudProvider";
import { Subject } from "rxjs";
import { debounceTime, filter, map } from "rxjs/operators";
import "../App.css";

export default function MusicList(props) {
  const { search$ } = props;
  const pickSong$ = new Subject();
  const [noResults, setNoResults] = useState(false);

  pickSong$.subscribe((song) => props.setSong(song));

  const { songs, setSongs } = props;

  useEffect(() => {
    search$
      .pipe(
        debounceTime(300),
        filter((search) => search !== ""),
        map((search) =>
          search
            .split(" ")
            .filter((word) => !word.includes("by"))
            .join(" ")
        )
      )
      .subscribe((search) => {
        const cloud = new CloudProvider();
        cloud.getFiles(search).then((songs) =>
          songs.subscribe((songsArr) => {
            if (songsArr && songsArr[0]) {
              setSongs(songsArr);
              setNoResults(false);
            } else {
              setNoResults(true);
            }
          })
        );
      });
  }, [search$]);

  const handleClick = (song) => {
    pickSong$.next(song);
  };

  const handleSearch = (e) => {
    search$.next(e.target.value);
  };

  return (
    <div id="music-list">
      <h3 style={{ textAlign: "center" }}>Search Songs</h3>
      <input
        onChange={handleSearch}
        placeholder="Search"
        className="search-input"
        type="text"
      />
      <div>
        {noResults && <p className="error-txt">No Results</p>}
        {songs &&
          songs.map((song) => (
            <>
              <div
                key={song.id}
                className={
                  props.song && props.song.id === song.id
                    ? "song-container selected-song"
                    : "song-container"
                }
              >
                <img
                  id={song.id}
                  alt=""
                  src={song.album.cover_big}
                  className="list-song-img"
                />
                <p id={song.id} style={{ marginLeft: "2%" }}>
                  {song.title + " by " + song.artist.name}
                  <button onClick={() => handleClick(song)} className="center">
                    {props.song && props.song.id === song.id
                      ? "Selected"
                      : "Play"}
                  </button>{" "}
                </p>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
