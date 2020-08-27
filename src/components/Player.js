import React, { useEffect, useState } from "react";

export default function Player(props) {
  const { currTime, duration } = props;
  const [currTimeSec, setCurrTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);

  useEffect(() => {
    const currTimeSeconds =
      parseInt(currTime[0] + currTime[1]) * 60 +
      parseInt(currTime[3] + currTime[4]);
    setCurrTimeSec(currTimeSeconds);
    const durationSeconds =
      parseInt(duration[0] + duration[1]) * 60 +
      parseInt(duration[3] + duration[4]);
    setDurationSec(durationSeconds);
  }, [currTime, duration]);

  return (
    <div
      style={{
        display: "block",
        marginRight: "auto",
        marginLeft: "auto",
        width: "33.8%",
      }}
    >
      <b>{currTime}</b>
      <progress
        value={currTimeSec && durationSec ? currTimeSec / durationSec : 0}
        max="1"
      ></progress>
      <b>{duration}</b>
    </div>
  );
}
