import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const directions = ["East", "West", "South", "North"];
const primeWords = ["apple", "banana", "cherry", "date"];
const nonWords = ["aaple", "bannana", "chrrey", "datte"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

function App() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("");
  const [prime, setPrime] = useState("");
  const [primePosition, setPrimePosition] = useState("");
  const [target, setTarget] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [responseTime, setResponseTime] = useState(null);
  const [isRealWord, setIsRealWord] = useState(null);

  const resetExperiment = useCallback(() => {
    setDirection(getRandomElement(directions));
    setPrime(getRandomElement([...primeWords, ...nonWords]));
    setPrimePosition(getRandomElement(directions));
    setTarget(getRandomElement([...primeWords, ...nonWords]));
    setStep(1);
    setResponseTime(null);
    setIsRealWord(null);
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

  const handleResponse = (isWord) => {
    const responseTime = Date.now() - startTime;
    setResponseTime(responseTime);
    setIsRealWord(isWord === primeWords.includes(target));
    setTimeout(() => setStep(0), 1000); // Reset experiment after showing results
  };

  return (
    <div className="App">
      {step === 1 && <Arrow direction={direction} />}
      {step === 2 && <Prime word={prime} position={primePosition} />}
      {step === 3 && <Mask />}
      {step === 4 && <Target word={target} onRespond={handleResponse} />}
      {responseTime !== null && (
        <div>
          <p>Response Time: {responseTime}ms</p>
          <p>Correct: {isRealWord ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}

const Arrow = ({ direction }) => (
  <div className="Arrow">
    <p>→ {direction}</p>
  </div>
);

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
