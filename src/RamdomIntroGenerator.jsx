import { useState } from "react";

const intros = [
    "🎤 Hold onto your drinks—<< singer >> is up!",
    "🔥 Brace yourself… << singer >> has entered the chat.",
    "🎶 No refunds, no regrets—<< singer >> is live!",
    "👑 Kneel, peasants! << singer >> is about to sing.",
    "🎵 Mic check… too late! << singer >> already started.",
    "🚀 Buckle up! << singer >> is taking off.",
    "💃 The stage is hot, and << singer >> is why.",
    "🕺 Warning: << singer >> may cause involuntary dancing.",
    "🎸 This just in: << singer >> has no chill.",
    "🎙️ Doctors recommend this performance. Probably.",
    "💥 Boom! << singer >> just dropped the mic. Metaphorically.",
    "🎊 Plot twist! << singer >> is actually amazing.",
    "🔊 Science can’t explain << singer >>'s talent.",
    "🌟 Fun fact: This is << singer >>'s world tour.",
    "💫 Watch closely—this is karaoke history.",
    "🎶 Music lovers, prepare yourselves… << singer >> has arrived.",
    "🔥 No pressure, << singer >>, but we expect greatness.",
    "🎉 This is not a drill! << singer >> is singing.",
    "🎧 Clear your schedule—<< singer >> is taking over.",
    "🚀 Fasten seatbelts—<< singer >> is lifting off.",
    "🎤 Some say legends never die. Enter << singer >>.",
    "🌊 Big waves coming! << singer >> is making a splash.",
    "🎶 The moment you’ve been waiting for: << singer >>!",
    "🌟 If talent had a name, it’d be << singer >>.",
    "⚡ Shock warning! << singer >> is about to deliver.",
    "🎵 Rumor has it << singer >> invented karaoke.",
    "🎙️ Shazam won’t work. << singer >> is one of a kind.",
    "🛸 Extraterrestrial talent detected: << singer >> incoming.",
    "🔥 Mic? Check. Swagger? Check. << singer >>? CHECK!",
    "💃 Too late to back out now, << singer >>.",
    "🚁 Incoming legend alert—<< singer >> is here!",
    "🎼 << singer >> is about to own this song.",
    "🎵 Mic drop guaranteed. << singer >>, go!",
    "🌠 Wish granted! << singer >> is performing now.",
    "🕺 Someone call security—<< singer >> is stealing the show!",
    "🎉 Karaoke just got interesting. Thank << singer >>.",
    "🔔 Heads up! << singer >> is taking center stage.",
    "🍾 Cheers! << singer >> is about to get loud.",
    "🎭 Oscar-worthy emotions incoming from << singer >>.",
    "🎇 Explosive performance ahead—<< singer >> is ready!",
    "🎶 << singer >> sings. The world listens.",
    "🚀 Countdown complete! << singer >> is LIVE.",
    "🎤 Warning: << singer >> might go viral after this.",
    "🌍 This just in—<< singer >> has worldwide appeal.",
    "🎵 New hit unlocked! << singer >> is on the mic.",
    "⚡ Unplug everything! << singer >> is bringing the energy.",
    "🦸 Not all heroes wear capes. Some sing. Like << singer >>.",
    "🎙️ Future generations will study this moment.",
    "🔊 Break the volume knob—<< singer >> is up!",
    "🌈 You’ll never hear this song the same again.",
    "🎶 Spoiler alert: << singer >> is about to slay.",
];

export default function RandomIntroGenerator({ singerName }) {
  const [intro, setIntro] = useState(
    intros[Math.floor(Math.random() * intros.length)].replace("{name}", singerName)
  );

  const generateNewIntro = () => {
    let newIntro;
    do {
      newIntro = intros[Math.floor(Math.random() * intros.length)].replace("{name}", singerName);
    } while (newIntro === intro); // Ensure it's different from the current intro
    setIntro(newIntro);
  };
  

  return (
    <div className="text-center p-1 bg-gradient-to-r from-yellow-400 to-red-400 text-white rounded-lg shadow-md  mx-auto">
      <h2 className="text-lg font-bold">🎤 Introducing...</h2>
      <div className="text-lg font-extrabold mt-1  mx-auto  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {intro}
      </div>
      <button
        className="mt-2 px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-sm transition-transform transform hover:scale-105 text-sm"
        onClick={generateNewIntro}
      >
        🔄 New Intro
      </button>
    </div>
  );
  
  
}
