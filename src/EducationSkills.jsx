import React from "react";

const EducationSkills = () => {
  return (
    <div className="space-y-8 relative">
      {/* Falling Stars Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-white rounded-full opacity-75 animate-fallingStars"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Education Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg relative z-10">
        <p className="text-lg text-white text-center mb-4">
          I am a proud graduate of <span className="font-bold">Flatiron School</span>, Class of 2024, where I honed my skills as a software engineer.
          Additionally, I am a <span className="font-bold">Bristol Central High School Alumni</span>, carrying forward a passion for learning and innovation.
        </p>
        <div className="mt-6">
          <h3 className="text-4xl font-semibold mb-2 text-center">Technologies I Know</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "HTML",
              "CSS",
              "Tailwind CSS",
              "JavaScript",
              "React",
              "Vite",
              "Python",
              "Flask",
              "SQLite",
              "SQLAlchemy",
              "PostgreSQL",
            ].map((skill, index) => (
              <span
                key={index}
                className="bg-white text-gray-800 py-1 px-8 rounded-full shadow-md text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSkills;
