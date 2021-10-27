import { Switch,Route, Link } from "react-router-dom";
import Orders from "./components/pages/Orders";

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Link to="/rider">Login rider</Link>
      </Route>
      <Route path="/orders">
        <Orders />
      </Route>
      <Route path="/rider/:riderId">

      </Route>
    </Switch>
  );
}

export default App;
