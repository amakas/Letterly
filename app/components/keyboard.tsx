import { useEffect, useState, useRef } from "react";
interface Cell {
  letter: string;
  status: string;
  open: boolean;
  hidden: boolean;
}
interface boardProps {
  board: Array<Cell[]>;
  setBoard: React.Dispatch<React.SetStateAction<Array<Cell[]>>>;
  word: React.RefObject<string[]>;
  goal: string[];
  row: number;
  col: number;
  isGameOn: () => boolean;
  gameOver: boolean;
  setRow: React.Dispatch<React.SetStateAction<number>>;
  setCol: React.Dispatch<React.SetStateAction<number>>;
  setIsEnter: React.Dispatch<React.SetStateAction<boolean>>;
  check: (word: string[], goal: string[]) => void;
  isWordexist: (word: string[]) => boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setTrigger: React.Dispatch<React.SetStateAction<number>>;
  trigger: number;
}
export const KeyBoard = ({
  board,
  setBoard,
  word,
  goal,
  row,
  col,
  isGameOn,
  gameOver,
  setRow,
  setCol,
  setIsEnter,
  check,
  isWordexist,
  setGameOver,
  setPopUp,
  setTrigger,
  trigger,
}: boardProps) => {
  const alphabet: string = `qwertyuiopasdfghjklzxcvbnm`;
  const arr = Array.from(alphabet.toUpperCase());
  const [letters, setLetters] = useState<Cell[]>(
    arr.map((letter) => {
      return { letter: letter, status: "active", open: false, hidden: false };
    })
  );
  useEffect(() => {
    const newLetters = [...letters];

    setLetters(
      newLetters.map((letter) => {
        return {
          letter: letter.letter,
          status: "active",
          open: false,
          hidden: false,
        };
      })
    );
  }, [goal]);
  useEffect((): void => {
    const newLetters: Cell[] = [...letters];
    newLetters.splice(-7, 0, {
      letter: "Enter",
      status: "active enter",
      open: false,
      hidden: false,
    });
    newLetters.splice(letters.length + 1, 0, {
      letter: "⌫",
      status: "active backspace",
      open: false,
      hidden: false,
    });
    setLetters(newLetters);
    console.log(letters);
  }, []);

  useEffect((): void => {
    const upperWord = word.current.map((l) => l.toUpperCase());
    const upperGoal = goal.map((l) => l.toUpperCase());
    setLetters((prev) =>
      prev.map(
        (cell) => {
          let result = cell;

          for (let i = 0; i < word.current.length; i++) {
            if (upperWord[i] === upperGoal[i] && upperWord[i] === cell.letter) {
              result = { ...cell, status: "green" };
              break;
            }
            if (upperWord.includes(cell.letter))
              result = { ...cell, status: "passive" };
            if (
              upperGoal.includes(cell.letter) &&
              upperWord.includes(cell.letter)
            )
              result = { ...cell, status: "yellow" };
          }
          return result;
        }
        // upperWord.includes(cell.letter) ? { ...cell, status: "passive" }  : goal?.includes(cell.letter) ? {...cell,status:"yellow"} :   cell
      )
    );
  }, [trigger]);

  return (
    <div className="keyboard">
      {letters.map((letter: Cell) => {
        const handleClick = (): void => {
          if (isGameOn() === false) return;
          if (gameOver) return;
          const updatedBoard: Array<Cell[]> = [...board];
          const copyRow: Cell[] = [...updatedBoard[row]];
          if (col === 5 && letter.letter != "Enter" && letter.letter != "⌫") {
          } else if (letter.letter === "Enter" && col === 5 && row === 5) {
            check(word.current, goal);
            setGameOver(true);
          } else if (letter.letter === "Enter" && col === 5) {
            if (!isWordexist(word.current)) {
              setPopUp(true);
              return;
            }
            copyRow.map((cell) => (cell ? { ...cell, open: true } : null));
            setRow((prevRow) => prevRow + 1);
            setCol(0);
            check(word.current, goal);

            setIsEnter(true);
            setTimeout(() => {
              setIsEnter(false);
              word.current = [];
            }, 100);
          } else {
            if (letter.letter === "⌫" && col > 0) {
              copyRow[col - 1] = {
                letter: "",
                status: "empty",
                open: false,
                hidden: false,
              };
              updatedBoard[row] = copyRow;
              setCol((prevCol) => prevCol - 1);
              word.current.length--;
            } else if (/^[a-zA-Z]$/.test(letter.letter)) {
              copyRow[col] = {
                letter: letter.letter.toLowerCase(),
                status: "absent",
                open: false,
                hidden: false,
              };
              updatedBoard[row] = copyRow;
              setCol((prevCol) => prevCol + 1);

              word.current.push(letter.letter);
            } else {
            }

            setBoard(updatedBoard);
          }
        };
        return (
          <div
            onClick={handleClick}
            key={letter.letter}
            className={`key ${letter.status}`}
          >
            {letter.letter}
          </div>
        );
      })}
    </div>
  );
};
