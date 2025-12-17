# Word Guess Game (Wordle clone)

A simple Wordle-like game built with **Next.js**, **React**, and **TypeScript**.

## Features
- Random word generation from a local dictionary
- Keyboard input (physical keyboard + on-screen keyboard)
- Letter status logic (correct / present / absent)
- Animated cell reveal
- Validation for non-existing words
- Game over state and restart option

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- CSS

## How it works
The player has 6 attempts to guess a 5-letter word.  
After each attempt, letters are marked based on their correctness:
- Green — correct letter and position
- Yellow — correct letter, wrong position
- Gray — letter not in the word

## Getting Started
```bash
npm install
npm run dev
