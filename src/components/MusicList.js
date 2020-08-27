import React, { useState, useEffect } from "react";
import CloudProvider from "../providers/CloudProvider";
import { Subject } from "rxjs";

export default function MusicList(props) {
  const [songs, setSongs] = useState([]);
  const pickSong$ = new Subject();
  pickSong$.subscribe((song) => props.setSong(song));

  useEffect(() => {
    const cloud = new CloudProvider();
    const subscription = cloud.getFiles().subscribe(setSongs);

    return () => subscription.unsubscribe();
  }, []);

  const handleClick = (song) => {
    pickSong$.next(song);
  };

  return (
    <div>
      <ul>
        {songs.map((song) => (
          <li key={song.name}>
            <button
              onClick={() => handleClick(song)}
              style={{
                padding: "3px 3px 3px",
                backgroundColor: "lightblue",
                borderColor: "white",
                borderRadius: "10px",
              }}
            >
              {song.name}
            </button>{" "}
            {props.song && props.song.name === song.name ? (
              <p>Selected</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
