import { useEffect, useState } from "react";
import Spinner from "./Spinner";

function App() {
  const [answer, setAnswer] = useState();
  const [options, setOptions] = useState([]);
  const [codes, setCodes] = useState();
  const [score, setScore] = useState(0);
  const [message, setMesasge] = useState("");

  useEffect(() => {
    if (codes) {
      getRandomCodes();
    } else {
      fetchCodes();
    }
    // eslint-disable-next-line
  }, [codes]);

  useEffect(() => {
    if (options.length > 0) {
      setAnswer(options[Math.floor(Math.random() * 4)]);
    }
  }, [options]);

  const fetchCodes = async () => {
    const response = await (
      await fetch("https://flagcdn.com/en/codes.json")
    ).json();

    setCodes(response);
  };

  const getRandomCodes = () => {
    setAnswer(null);
    if (codes) {
      const flagCodes = Object.keys(codes);
      const flagNames = Object.values(codes);

      let options = [];
      let index = Math.floor(Math.random() * flagCodes.length);
      options.push({ code: flagCodes[index], name: flagNames[index] });

      for (let i = 0; i < 3; i++) {
        index = Math.floor(Math.random() * flagCodes.length);

        while (true) {
          // eslint-disable-next-line
          if (options.some((option) => option["name"] === flagNames[index])) {
            index = Math.floor(Math.random() * flagCodes.length);
            console.log("Duplicate");
            continue;
          } else {
            options.push({
              code: flagCodes[index],
              name: flagNames[index],
            });
            break;
          }
        }
      }

      setOptions(options);
    }
  };

  const checkAnswer = (e) => {
    if (e.target.innerHTML === answer.name) {
      setScore((prev) => prev + 1);
      setMesasge("Correct!");
    } else {
      setScore(0);
      setMesasge(`Wrong it was ${answer.name}.`);
    }

    getRandomCodes();
  };
  return (
    <div>
      <div className="header">
        <h1>Guess the flag</h1>
        <h2>Score: {score}</h2>
      </div>

      {answer ? (
        <>
          <div className="flag">
            <img
              src={`https://flagcdn.com/w640/${answer.code}.png`}
              height="200"
              alt=""
            />
          </div>
          <div className="options">
            {options.map((option, index) => {
              return (
                <div className="option" key={index} onClick={checkAnswer}>
                  <h1>{option.name}</h1>
                </div>
              );
            })}
          </div>{" "}
        </>
      ) : (
        <Spinner />
      )}

      <h1 className="message">{message}</h1>
    </div>
  );
}

export default App;
