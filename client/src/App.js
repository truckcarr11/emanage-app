import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Manage from "./pages/Manage";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={["/", "/signin"]}>
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
