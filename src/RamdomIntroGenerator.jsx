import { useState } from "react";

const intros = [
  "🎤 Give it up for {name}! Stepping up to the mic like a true rockstar!",
  "🔥 Make some noise for {name}! They're about to set this stage on fire!",
  "🎶 Get ready to be amazed! {name} is about to drop some serious vocals!",
  "👑 Bow down to karaoke royalty! {name} is taking over the stage!",
  "🎵 It's time for {name} to show us how it's done!",
  "🚀 Blast off! {name} is launching into an out-of-this-world performance!",
  "💃 Get your groove on! {name} is bringing the party to the stage!",
  "🕺 The dance floor is heating up! {name} is about to take it away!",
  "🎸 Rock legends beware! {name} is here to steal the spotlight!",
  "🎙️ No autotune needed! {name} is about to blow us away!",
  "💥 Brace yourselves! {name} is taking this performance to the next level!",
  "🎊 It's karaoke magic time! {name}, the stage is yours!",
];

export default function RandomIntroGenerator({ singerName }) {
  const [intro, setIntro] = useState(
    intros[Math.floor(Math.random() * intros.length)].replace("{name}", singerName)
  );

  const generateNewIntro = () => {
    const newIntro = intros[Math.floor(Math.random() * intros.length)].replace("{name}", singerName);
    setIntro(newIntro);
  };

  return (
    <div className="text-center p-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">🎤 Introducing...</h2>
      <p className="text-xl mt-2">{intro}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={generateNewIntro}
      >
        🔄 New Introduction
      </button>
    </div>
  );
}
