import React, { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const clickBtn = () => {
    setCount((pre) => pre + 1);
  };

  return (
    <>
      <div className="App">
        <div className="grid-container">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="grid-item">
              {index === 1 && (
                <div>
                  <p>{count}</p>
                  <button onClick={clickBtn}>클릭</button>
                </div>
              )}
              {index === 4 && count !== 3 && <Timer />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

const Timer = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  console.log("rendering component");
  console.log(running);

  return (
    <div>
      <p>Time: {time}s</p>
      <button
        onClick={() => {
          console.log("hi");
          setRunning(true);
        }}
      >
        Start
      </button>
      <button onClick={() => setRunning(false)}>Stop</button>
      <button onClick={() => setTime(0)}>Reset</button>
    </div>
  );
};
