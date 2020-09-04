import React, { useState } from "react";
import * as $ from "jquery";
import "../App.css";

export default function Recorder(props) {
  const { handleRecognisedSong, audioPlayer } = props;
  const [recording, setRecording] = useState(false);
  const [noMatchError, setNoMatchError] = useState(false);

  const handleStream = (stream) => {
    const options = { mimeType: "audio/webm" };
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (e) => {
      const recordedChunks = [];
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }

      mediaRecorder.addEventListener("stop", function () {
        handleData(new Blob(recordedChunks, { type: "audio/mp3" }));
      });
    };
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
      audioPlayer.play();
    }, 8000);
  };

  const handleData = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64String = reader.result;

      const data = {
        api_token: process.env.REACT_APP_AUDD_API_KEY,
        audio: base64String.substr(base64String.indexOf(",") + 1),
        return: "apple_music,spotify",
      };
      $.post("https://api.audd.io/?jsonp=?", data).always(function (data) {
        const response = JSON.parse(
          data.responseText.slice(
            data.responseText.indexOf("?") + 2,
            data.responseText.length - 1
          )
        );

        if (response.result) {
          const { title, artist } = response.result;
          setNoMatchError(false);
          handleRecognisedSong(title + " " + artist);
        } else {
          setNoMatchError(true);
        }
      });
    };
  };

  const startRecording = () => {
    audioPlayer.pause();
    setRecording(true);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(handleStream)
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <button className="record-button center" onClick={startRecording}>
        {recording ? "Recording..." : "Record"}
      </button>
      <p className="info-txt">Record a sample of a song to find matches</p>
      <p className="error-txt">{noMatchError && "No Match Found"}</p>
    </div>
  );
}
