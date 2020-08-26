import React, { useEffect, useState } from "react";

export default function Player(props) {
  const { currTime, duration } = props;
  const [currTimeSec, setCurrTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);

  useEffect(() => {
    const currTimeSeconds =
      parseInt(currTime[1]) * 60 + parseInt(currTime[3] + currTime[4]);
    setCurrTimeSec(currTimeSeconds);
    const durationSeconds =
      parseInt(duration[1]) * 60 + parseInt(duration[3] + duration[4]);
    setDurationSec(durationSeconds);
  }, [currTime]);

  //   console.log(parseFloat(duration[1]));
  return (
    <div>
      <p>{currTime}</p>
      <progress
        style={{ display: "block", marginRight: "auto", marginLeft: "auto" }}
        value={currTimeSec / durationSec}
        max="1"
      ></progress>
      <p>{duration}</p>
    </div>
  );
}
