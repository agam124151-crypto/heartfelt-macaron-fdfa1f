import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppDataProvider } from "./contexts/AppDataContext";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <RouterProvider router={router} />
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}