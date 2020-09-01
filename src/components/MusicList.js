import React, { useState, useEffect } from "react";
import CloudProvider from "../providers/CloudProvider";
import { Subject, BehaviorSubject } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";

export default function MusicList(props) {
  const [songs, setSongs] = useState([]);
  const pickSong$ = new Subject();
  const search$ = new BehaviorSubject("");
  pickSong$.subscribe((song) => props.setSong(song));

  useEffect(() => {
    const cloud = new CloudProvider();
    const subscription = cloud
      .getFiles()
      .then((data) => data.subscribe(setSongs));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    search$
      .pipe(
        debounceTime(300),
        filter((search) => search !== "")
      )
      .subscribe((search) => {
        const cloud = new CloudProvider();
        cloud
          .getFiles(search)
          .then((songs) =>
            songs
              .pipe(filter((song) => song.title !== "Undefined"))
              .subscribe(setSongs)
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
    <div>
      <h3 style={{ textAlign: "center" }}>Search Songs</h3>
      <input
        onChange={handleSearch}
        placeholder="Search"
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "2%",
        }}
        type="text"
      />
      <div>
        {songs.map((song) => (
          <>
            <div
              key={song.id}
              style={{
                backgroundColor: "white",
                color: "black",
                width: "200px",
                textAlign: "center",
                display: "inline-block",
                marginLeft: "4%",
                marginBottom: "2%",
              }}
            >
              <img
                src={song.album.cover_big}
                style={{ height: "auto", width: "200px" }}
              />
              <p style={{ marginLeft: "2%" }}>
                {song.title + " by " + song.artist.name}
                <button
                  onClick={() => handleClick(song)}
                  style={{
                    marginRight: "5%",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {props.song &&
                  props.song.title + " by " + props.song.artist.name ===
                    song.title + " by " + song.artist.name
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
