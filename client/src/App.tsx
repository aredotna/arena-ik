import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";

import Main from "components/Main";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route
            exact
            path="/exhibition"
            render={() => <Main isExhibition />}
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
