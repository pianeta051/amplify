import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";
import { theme } from "./theme/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const App: FC = () => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
