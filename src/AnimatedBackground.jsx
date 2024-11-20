const AnimatedBackground = () => {
  // Function to generate random blob styles
  const generateBlobStyle = () => ({
    width: `${Math.random() * 150 + 150}px`,
    height: `${Math.random() * 150 + 150}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 5}s`,
    animationDelay: `${Math.random() * 5}s`,
  });

  // Gradient options for blobs
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-green-500",
    "from-yellow-400 to-orange-500",
    "from-red-500 to-purple-700",
    "from-teal-400 to-cyan-500",
  ];

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black">
      {/* Lava Lamp Blobs */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute bg-gradient-to-r ${gradients[i % gradients.length]} opacity-70 blur-2xl rounded-full animate-lava-lamp`}
            style={generateBlobStyle()}
          ></div>
        ))}
      </div>

      {/* Scrolling Code */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 text-center">
        <div className="relative w-2/3 text-green-400">
          <div className="animate-scroll">
          <pre className="text-3xl leading-loose whitespace-pre-line">
          {`function perform() {
  console.log("Welcome to my world!");
  const message = 'Art meets Code';
  console.log(\`Message: \${message}\`);
  return message;
}

const portfolio = {
  name: 'Jonathen Whitford',
  engineer: true,
  performer: true,
  skills: ['React', 'Flask', 'Tailwind', 'Acting', 'Singing'],
  showcase() {
    console.log('Check out my projects and performances!');
  },
};

portfolio.showcase();

const projects = [
  { name: 'Gweather', stack: ['HTML', 'CSS', 'JavaScript'], link: 'https://achi11ean.github.io/phase1Project/' },
  { name: 'PotterHub', stack: ['React', 'Vite'], link: 'https://main--potterpals.netlify.app/' },
  { name: 'CLI Event Planner', stack: ['Python', 'CLI'], link: 'https://github.com/Achi11ean/Final-Project' },
  { name: 'PRISM', stack: ['Flask', 'React'], link: 'https://iridescent-prism.netlify.app/' },
];

console.log('Current Projects:', projects.map(p => p.name).join(', '));

function inspire() {
  return "The best way to predict the future is to create it.";
}

console.log(inspire());`}

            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
