import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./pages/home-page/HomePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <HomePage />
          asdasd
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
