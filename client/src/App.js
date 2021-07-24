import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Manage from "./pages/Manage";
import { useEffect } from "react";
import { setCompanies } from "./appReducer";

export default function App() {
  useEffect(() => {
    fetch("/api/companies")
      .then((response) => response.json())
      .then((data) => setCompanies(data.data));
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <SignInPage />
        </Route>
        <Route path="/signup">
          <SignUpPage />
        </Route>
        <Route path="/manage">
          <Manage />
        </Route>
      </Switch>
    </Router>
  );
}
