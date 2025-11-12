"use client";
import Image from "next/image";
import { list } from "./components/wordsList";
import { useEffect, useRef, useState, JSX } from "react";
import words from "./components/words.json";
import { KeyBoard } from "./components/keyboard";
import { PopUp } from "./components/PopUp";
interface Cell {
  letter: string;
  status: string;
  open: boolean;
  hidden: boolean;
}
export default function Home(): JSX.Element {
  const [row, setRow] = useState<number>(0);
  const [col, setCol] = useState<number>(0);
  const word = useRef<string[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [isEnter, setIsEnter] = useState(false);

  const [randomWord, setRandomWord] = useState<string[]>(
    words[Math.floor(Math.random() * words.length)].split("")
  );
  const [popUp, setPopUp] = useState(false);

  const initialBoard = () => {
    return Array(6)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => {
            return { letter: "", status: "empty", open: false, hidden: false };
          })
      );
  };
  const [board, setBoard] = useState<Array<Cell[]>>(initialBoard);
  const [gameOver, setGameOver] = useState<boolean>(false);

  function isGameOn(): boolean {
    if (row > 5) {
      setGameOver(true);
      return false;
    }

    return true;
  }

  const isWordexist = (word: string[]) => {
    const allWords = new Set(words);
    if (allWords.has(word.join("").toLowerCase())) return true;
    return false;
  };

  const check = (word: string[], goal: string[]): void => {
    setTrigger((prev) => prev + 1);
    isOver();
    setBoard((prev) => {
      const updatedBoard = [...prev];
      const copyRow = [...updatedBoard[row]];
      const lowerWord = word.join("").toLowerCase();
      for (let i = 0; i < word.length; i++) {
        if (lowerWord[i] === goal[i]) {
          copyRow[i % 5].status = "green";
          updatedBoard[row] = copyRow;
        } else if (goal.includes(lowerWord[i])) {
          copyRow[i % 5].status = "yellow";
          updatedBoard[row] = copyRow;
        } else null;
      }
      return updatedBoard;
    });
  };
  const isOver = (): boolean => {
    if (word.current.join("").toLowerCase() == randomWord.join(""))
      setGameOver(true);
    return false;
  };
  const onKeyDown = (e: KeyboardEvent): void => {
    if (isGameOn() === false) return;
    if (gameOver) return;

    if (col === 5 && e.key != "Enter" && e.key != "Backspace") {
    } else if (e.key === "Enter" && col === 5 && row === 5) {
      check(word.current, randomWord);
      setGameOver(true);
    } else if (e.key === "Enter" && col === 5) {
      if (!isWordexist(word.current)) {
        setPopUp(true);
        return;
      }

      setBoard((prev) => {
        const newBoard = [...prev];

        newBoard[row] = newBoard[row].map((cell, i) => {
          cell = { ...cell, hidden: true };
          setTimeout(() => {
            setBoard((prevInner) => {
              const updated = [...prevInner];
              updated[row] = updated[row].map((c, j) =>
                j === i ? { ...c, open: true, hidden: false } : c
              );
              return updated;
            });
          }, i * 200);

          return cell;
        });
        return newBoard;
      });

      setRow((prevRow) => prevRow + 1);
      setCol(0);
      check(word.current, randomWord);

      setIsEnter(true);
      setTimeout(() => {
        setIsEnter(false);
        word.current = [];
      }, 100);
    } else {
      const updatedBoard: Array<Cell[]> = [...board];
      let copyRow: Cell[] = [...updatedBoard[row]];
      if (e.key === "Backspace" && col > 0) {
        copyRow[col - 1] = {
          letter: "",
          status: "empty",
          open: false,
          hidden: false,
        };
        updatedBoard[row] = copyRow;
        setCol((prevCol) => prevCol - 1);
        word.current.length--;
        setBoard(updatedBoard);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        setCol((prevCol) => prevCol + 1);

        word.current.push(e.key);
        setBoard((prev) => {
          const updatedBoard: Array<Cell[]> = [...prev];
          let copyRow: Cell[] = [...updatedBoard[row]];
          copyRow[col] = {
            letter: e.key.toLowerCase(),
            status: "absent",
            open: false,
            hidden: false,
          };
          updatedBoard[row] = copyRow;
          return updatedBoard;
        });
      } else if (/^[а-яА-Я]$/.test(e.key)) {
        alert("Мову зміни дурень!");
      } else {
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPopUp(false);
    }, 3000);
    console.log(randomWord.join(""));
    return () => clearTimeout(timeout);
  }, [popUp]);

  useEffect((): void | (() => void) => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [row, col]);

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.blur();
    setBoard(initialBoard);
    setRow(0);
    setCol(0);
    setGameOver(false);
    setRandomWord(words[Math.floor(Math.random() * words.length)].split(""));
    word.current = [];
  };
  return (
    <main>
      {popUp && <PopUp />}
      {gameOver && (
        <>
          <p className="word">{randomWord.join("").toUpperCase()}</p>
        </>
      )}
      <div className="main-box">
        <h2 className="text">Guess the word</h2>
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, i) => (
              <div
                key={i}
                className={`box ${cell.status} ${cell.open ? "open" : ""} `}
              >
                <span className={`letter ${cell.hidden ? "hidden" : "shown"}`}>
                  {cell.letter.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <KeyBoard
        board={board}
        setBoard={setBoard}
        word={word}
        goal={randomWord}
        row={row}
        col={col}
        gameOver={gameOver}
        isGameOn={isGameOn}
        setRow={setRow}
        setCol={setCol}
        check={check}
        isWordexist={isWordexist}
        setIsEnter={setIsEnter}
        setGameOver={setGameOver}
        setPopUp={setPopUp}
        setTrigger={setTrigger}
        trigger={trigger}
      />
      <button
        disabled={gameOver ? false : true}
        type="button"
        className="play"
        onClick={handlePlay}
      >
        Play again
      </button>
    </main>
  );
}
