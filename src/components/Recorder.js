import React, { useState } from "react";
import AudioRecorder from "audio-recorder-polyfill";
import Lottie from "react-lottie";
import animationData from "../lotties/music-fly.json";
import * as $ from "jquery";
import "../App.css";
import MediaRecorder from "audio-recorder-polyfill";

export default function Recorder(props) {
  const { handleRecognisedSong, audioPlayer, setPaused } = props;
  const [recording, setRecording] = useState(false);
  const [noMatchError, setNoMatchError] = useState(false);

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getMediaRecorder = (stream, options) => {
    let mediaRecorder;
    if (navigator.userAgent.indexOf("Safari") !== -1) {
      window.mediaRecorder = AudioRecorder;
      mediaRecorder = new MediaRecorder(stream, options);
    } else {
      mediaRecorder = new MediaRecorder(stream, options);
    }
    return mediaRecorder;
  };

  const handleStream = (stream) => {
    const options = { mimeType: "audio/webm" };
    const mediaRecorder = getMediaRecorder(stream, options);

    mediaRecorder.addEventListener("dataavailable", (e) => {
      const recordedChunks = [];
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
      mediaRecorder.addEventListener("stop", function () {
        handleData(new Blob(recordedChunks, { type: "audio/mp3" }));
      });
    });

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 8000);
  };

  const handleData = (blob) => {
    console.log(blob);
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
    if (audioPlayer) {
      audioPlayer.pause();
      setPaused(true);
    }
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
      {recording ? (
        <Lottie options={lottieOptions} height={150} width={150} />
      ) : (
        <button className="record-button center" onClick={startRecording}>
          Identify Song
        </button>
      )}
      <p className="info-txt">Record a sample of a song to find matches</p>
      <p className="error-txt">{noMatchError && "No Match Found"}</p>
    </div>
  );
}
