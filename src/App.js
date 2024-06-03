import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { pairs } from "./data";

const directions = ["East", "West", "South", "North"];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const PRACTICE_COUNT = 4;
const TOTAL_COUNT = PRACTICE_COUNT + 80;
const MAX_TYPE_COUNT = 10;

const __getRandomDataSet = () => {
  const d1 = getRandomElement(directions);
  const d2 = getRandomElement(directions);
  const pair = getRandomElement(pairs);

  return { d1, d2, pair, type: getType(pair.type, d1 === d2) };
};

const getRandomDataSet = (db, total) => {
  const { d1, d2, pair, type } = __getRandomDataSet();

  if (total <= PRACTICE_COUNT) {
    return { d1, d2, pair, type };
  }

  const count = db[type];
  if (typeof count !== "number") {
    db[type] = 1;
    return { d1, d2, pair, type };
  }

  if (count < MAX_TYPE_COUNT) {
    ++db[type];
    return { d1, d2, pair, type };
  }

  return getRandomDataSet(db);
};

const State = { Init: "INIT", Practice: "PRACTICE", Ing: "ING", End: "END" };

const db = {};

function App() {
  const [total, setTotal] = useState(1);
  const [step, setStep] = useState(-1);
  const [direction, setDirection] = useState("");
  const [pair, setPair] = useState({ prime: "", target: "", type: 0 });

  const [primePosition, setPrimePosition] = useState("");
  const [startTime, setStartTime] = useState(0);

  const [processing, setProcessing] = useState(false);

  const [status, setStatus] = useState(State.Init);

  const resetExperiment = useCallback(() => {
    console.log(total);
    const { d1, d2, pair } = getRandomDataSet(db, total);
    console.log(db);
    setDirection(d1);
    setPrimePosition(d2);
    setPair(pair);

    setStep(1);
  }, [total, db]);

  const [result, setResult] = useState([]);

  const handleCopy = () => {
    const list = [];

    for (const { isF, responseTime, type, isMatched } of result) {
      list.push({
        type: getType(type, isMatched),
        responseTime,
        isCorrected: getIsCorrected(isF, type),
      });
    }

    const copiedData = JSON.stringify(list, null, 2);
    navigator.clipboard
      .writeText(copiedData)
      .then(() => {
        alert("결과 복사 완료");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    if (status !== State.Ing) return;
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
  }, [status, step, resetExperiment]);

  const handleResponse = (isF) => {
    if (processing) return;
    setProcessing(true);

    const responseTime = Date.now() - startTime;

    const data = {
      isF,
      responseTime,
      type: pair.type,
      isMatched: direction === primePosition,
    };

    const state = [...result, data];
    setResult(state);

    setTotal((prev) => prev + 1);

    if (total === PRACTICE_COUNT) {
      setProcessing(false);
      setStep(-1);
      setStatus(State.Practice);
      return;
    }

    if (total === TOTAL_COUNT) {
      setStatus(State.End);
      return;
    }

    setTimeout(() => {
      setProcessing(false);
      setStep(0);
    }, 50);
  };

  useEffect(() => {
    const handleKeyDown = () => {
      if (status === State.Init || status === State.Practice) {
        setStatus(State.Ing);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status]);

  return (
    <>
      <div className="App">
        {status === State.Practice && (
          <div className="init-container">
            <p>연습세션이 종료되었습니다.</p>
            <p>키를 누르면 본세션이 시작됩니다.</p>
            <p>실험 예상 소요 시간은 5분입니다.</p>
          </div>
        )}

        {status === State.End && (
          <div className="init-container">
            <p>실험에 참여해주셔서 감사합니다.</p>
            <p>[결과 복사하기] 버튼을 누른 후 실험 결과를</p>
            <p> 실험 참여 요청자에게 [붙여넣기]하여 전송해주세요.</p>
            <button onClick={handleCopy}>결과 복사하기</button>
            <p>Supervised by 전종섭 교수</p>
            <p>Conceptualized by 이정윤</p>
          </div>
        )}

        {status === State.Init && (
          <div className="init-container">
            <h1>부주의맹-점화 효과 실험</h1>
            <h3>Inattentional blindness- Priming effect Experiment</h3>
            <p>안녕하세요.</p>
            <p>실험에 참여한 것을 환영합니다.</p>
            <p>화면의 중앙의 점을 응시하면</p>
            <p>검은색 단어가 화면 중앙에 나타날 것입니다.</p>
            <p>
              나타난 검은색 글자가, 올바른 한국어 단어라면 <b>F</b>,
            </p>
            <p>
              단어가 아니라면 <b>J</b>를 눌러주세요.
            </p>
            <p>최대한 빨리 판단할 수 있도록 노력해보세요!</p>
            <p>아무 키나 누르면 연습세션이 시작됩니다.</p>
            <p>실험 예상 소요 시간은 5분입니다.</p>
          </div>
        )}

        {status === State.Ing && (
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
                        setStatus={setStatus}
                        status={State}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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

const Target = ({ word, onRespond, setStatus, status }) => {
  useEffect(() => {
    let responseTimeout = setTimeout(() => {
      setStatus(State.End);
    }, 20000);

    const handleKeydown = (event) => {
      clearTimeout(responseTimeout);

      if (event.key === "ㄹ" || event.key === "f" || event.key === "F") {
        onRespond(true);
      } else if (event.key === "ㅓ" || event.key === "j" || event.key === "J") {
        onRespond(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      clearTimeout(responseTimeout);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [onRespond, setStatus, status]);

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

const getType = (type, isSameDir) => {
  let ret = "";
  ret += isSameDir ? "S" : "O";
  return ret + "-" + type;
};

const getIsCorrected = (isF, type) => {
  if (type === 2 && isF) {
    return false;
  }

  return true;
};
