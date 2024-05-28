import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { pairs } from "./data";

const directions = ["East", "West", "South", "North"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

function App() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("");
  const [pair, setPair] = useState({ prime: "", target: "", type: 0 });

  const [primePosition, setPrimePosition] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [responseTime, setResponseTime] = useState(null);

  const [processing, setProcessing] = useState(false);

  const resetExperiment = useCallback(() => {
    setDirection(getRandomElement(directions));
    setPair(getRandomElement(pairs));
    setPrimePosition(getRandomElement(directions));
    setStep(1);
    setResponseTime(null);
  }, []);

  useEffect(() => {
    if (step === 0) {
      resetExperiment();
    } else if (step === 1) {
      setTimeout(() => setStep(2), 100);
    } else if (step === 2) {
      setTimeout(() => setStep(3), 200);
    } else if (step === 3) {
      setTimeout(() => setStep(4), 100);
    } else if (step === 4) {
      setStartTime(Date.now());
    }
  }, [step, resetExperiment]);

  const handleResponse = () => {
    if (processing) return;
    setProcessing(true);
    const responseTime = Date.now() - startTime;
    setResponseTime(responseTime);
    setTimeout(() => {
      setProcessing(false);
      setStep(0);
    }, 1000);
  };

  return (
    <>
      <div className="App">
        <div className="grid-container">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="grid-item">
              {step === 2 && match(primePosition, index) && (
                <Prime word={pair.prime} position={primePosition} />
              )}

              {index === 4 && (
                <>
                  {step === 1 && <Arrow direction={direction} />}
                  {step === 3 && <Mask />}
                  {step === 4 && (
                    <Target
                      word={pair.target}
                      onRespond={handleResponse}
                      processing={processing}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {responseTime !== null && (
        <div className="Nav">
          <p>Response Time: {responseTime}ms</p>
          <p>Type: {pair.type}</p>
        </div>
      )}
    </>
  );
}

const arrows = ["→", "←", "↓", "↑"];
const Arrow = ({ direction }) => {
  return (
    <div className="Arrow">
      <p>{arrows[directions.findIndex((d) => d === direction)]}</p>
    </div>
  );
};

const Prime = ({ word, position }) => (
  <div className={`Prime ${position}`}>
    <p>{word}</p>
  </div>
);

const Mask = () => (
  <div className="Mask">
    <p>###</p>
  </div>
);

const Target = ({ word, onRespond }) => {
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "f" || event.key === "F") {
        onRespond(true);
      } else if (event.key === "j" || event.key === "J") {
        onRespond(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onRespond]);

  return (
    <div className="Target">
      <p>{word}</p>
    </div>
  );
};

export default App;

const match = (position, index) => {
  return (
    (position === directions[0] && index === 5) ||
    (position === directions[1] && index === 3) ||
    (position === directions[2] && index === 7) ||
    (position === directions[3] && index === 1)
  );
};
