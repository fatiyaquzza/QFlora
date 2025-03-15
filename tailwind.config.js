module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      poppins: ["poppins"],
      poppinsBold: ["poppinsBold"],
      poppinsSemiBold: ["poppinsSemiBold"],
      poppinsItalic: ["poppinsItalic"],
    },
    colors: {
      primary: "#12321D",
      secondary: "#BECC85",
      softgreen: "#D1E6D2",
      white: "#FBFBFB",
      black: "#1E1E1E",
      gray: "#A4A4A4",
      softgray: "#EFEFEF",
      red: "#FF5555",
    },
  },
  plugins: [],
};
