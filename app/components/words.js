async function getWords() {
  const allWords = [];

  for (let ch of "abcdefghijklmnopqrstuvwxyz") {
    const response = await fetch(`https://api.datamuse.com/words?sp=${ch}????`);
    const data = await response.json();

    allWords.push(...data.map((w) => w.word));
  }

  console.log(JSON.stringify(allWords, null, 2));
}

getWords();
