import React, { useState } from "react";
import * as $ from "jquery";

export default function Recorder(props) {
  const { handleRecognisedSong } = props;
  const [recording, setRecording] = useState(false);

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
    }, 8000);
  };

  const handleData = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64String = reader.result;

      const data = {
        api_token: "4b85c24a69e61c34aede5c3fd7a638a7",
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
          handleRecognisedSong(title + " " + artist);
        }
      });
    };
  };

  const startRecording = () => {
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
      <button
        style={{ display: "block", marginRight: "auto", marginLeft: "auto" }}
        onClick={startRecording}
      >
        {recording ? "Recording..." : "Record"}
      </button>
    </div>
  );
}
