import { createTheme } from "@mui/material/styles";

// Theme tuned for the a11y-wcag skill: AA-contrast colors, a clearly visible
// keyboard focus indicator, and reduced motion honored.
export const theme = createTheme({
  palette: {
    // #1565c0 on white is ~5.1:1; its text ("contrastText") is white (AA on this blue).
    primary: { main: "#1565c0" },
    // #b00020 on white is ~6.5:1 — used for errors, never as the ONLY signal.
    error: { main: "#b00020" },
    success: { main: "#1b5e20" },
    text: { primary: "#1a1a1a", secondary: "#42474e" },
  },
  typography: {
    fontSize: 16,
    button: { textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Honor prefers-reduced-motion: cut animations/transitions.
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": {
            animationDuration: "0.001ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.001ms !important",
            scrollBehavior: "auto !important",
          },
        },
      },
    },
    // A strong, always-visible focus ring for keyboard users.
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            outline: "3px solid #1565c0",
            outlineOffset: "2px",
          },
        },
      },
    },
  },
});
