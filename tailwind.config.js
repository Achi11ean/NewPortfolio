module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the path to match your project's structure
    "./public/index.html",
  ],
  theme: {
    extend: {
      animation: {
        'lava-lamp': 'morph 8s ease-in-out infinite',
        scroll: 'scroll 60s linear infinite', // Increased duration to 20 seconds
      },
      keyframes: {
        morph: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-10px, 20px) scale(1.1)' },
          '50%': { transform: 'translate(20px, -10px) scale(0.9)' },
          '75%': { transform: 'translate(-20px, -20px) scale(1.05)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      screens: {
        sm: '580px', // Customize the sm breakpoint to start at 480px
      },
    },
  },
  plugins: [],
};
