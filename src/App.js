import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { pairs } from "./data";

const directions = ["East", "West", "South", "North"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

function App() {
  const [step, setStep] = useState(-1);
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

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    if (step === -1) {
      setTimeout(() => setStep(0), 1000);
    } else if (step === 0) {
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
  }, [hasStarted, step, resetExperiment]);

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

  useEffect(() => {
    window.addEventListener("keydown", () => {
      if (!hasStarted) {
        setHasStarted(true);
      }
    });
  }, []);

  return (
    <>
      <div className="App">
        {!hasStarted && (
          <div className="init-container">
            <p>안녕하세요.</p>
            <p>실험에 참여한 것을 환영합니다.</p>
            <p>화면의 중앙의 점을</p>
            <p>응시하면, 검은색 단어가 화면 중앙에 나타날 것입니다.</p>
            <p>나타난 검은색</p>
            <p>단어가 단어라면 F, 단어가 아니라면 J를 눌러주세요.</p>
            <p>최대한 빨리</p>
            <p>판단할 수 있도록 노력해보세요!</p>
            <p>
              한번씩 판단을 내릴 때마다, 다음 단어가 나오기 전 잠시동안 중앙의
              점이 등장합니다.
            </p>
            <p>점을 응시해주세요.</p>
            <p>아무키나 누르면 실험이 시작됩니다.</p>
            <p>실험 예상 소요 시간은 5분입니다.</p>
          </div>
        )}

        {hasStarted && (
          <div className="grid-container">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="grid-item">
                {step === 2 && match(primePosition, index) && (
                  <Prime word={pair.prime} position={primePosition} />
                )}

                {index === 4 && (
                  <>
                    {step === -1 && <div className="dot">•</div>}
                    {(step === 1 || step === 2) && (
                      <Arrow direction={direction} />
                    )}
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
        )}
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
    // 여기서 맞았는지도 테스트해야할듯?
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
