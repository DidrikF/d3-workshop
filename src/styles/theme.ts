import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2c51a0",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#0f172a",
      paper: "#0a0f1a",
    },
    text: {
      primary: "rgba(255,255,255,0.87)",
      secondary: "rgba(255,255,255,0.76)",
      disabled: "rgba(255,255,255,0.65)",
    },
  },
});
