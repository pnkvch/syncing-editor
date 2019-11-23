import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import GroupComponent from "./groupEditor";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route
            path="/"
            exact
            render={() => {
              return <Redirect to={`/group/${Date.now()}`} />;
            }}
          ></Route>
          <Route path="/group/:id" component={GroupComponent}></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
