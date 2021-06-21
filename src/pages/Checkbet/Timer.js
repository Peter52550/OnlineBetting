import React from "react";

// css
import "./Timer.css";

// components
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

export default function Timer(props) {
  const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = props.waitTime / 1000; // use UNIX timestamp in seconds
  const remainingTime = endTime - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  const renderTime = (dimension, time, text) => {
    if (dimension === "seconds" && props.waitTime < Date.now()) {
      return <div>{text}</div>;
    } else {
      return (
        <div className="time-wrapper">
          <div className="upper">Remaining</div>
          <div className="time">{time}</div>
          <div className="lower">{dimension}</div>
        </div>
      );
    }
  };

  const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
  const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
  const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
  const getTimeDays = (time) => (time / daySeconds) | 0;
  return (
    <div className="container">
      <CountdownCircleTimer
        {...timerProps}
        colors={[["#7E2E84"]]}
        duration={daysDuration}
        initialRemainingTime={remainingTime}
      >
        {({ elapsedTime }) =>
          renderTime("days", getTimeDays(daysDuration - elapsedTime))
        }
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors={[["#D14081"]]}
        duration={daySeconds}
        initialRemainingTime={remainingTime % daySeconds}
        onComplete={(totalElapsedTime) => [
          remainingTime - totalElapsedTime > hourSeconds,
        ]}
      >
        {({ elapsedTime }) =>
          renderTime("hours", getTimeHours(daySeconds - elapsedTime))
        }
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors={[["#EF798A"]]}
        duration={hourSeconds}
        initialRemainingTime={remainingTime % hourSeconds}
        onComplete={(totalElapsedTime) => [
          remainingTime - totalElapsedTime > minuteSeconds,
        ]}
      >
        {({ elapsedTime }) =>
          renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))
        }
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors={[["#218380"]]}
        duration={minuteSeconds}
        initialRemainingTime={remainingTime % minuteSeconds}
        onComplete={(totalElapsedTime) => [
          remainingTime - totalElapsedTime > 0,
        ]}
      >
        {({ elapsedTime }) =>
          renderTime("seconds", getTimeSeconds(elapsedTime), props.text)
        }
      </CountdownCircleTimer>
    </div>
  );
}
