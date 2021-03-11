import React from "react";
import Nav from "./components/Nav/Nav";
import Map from "./components/Map/Map";
import Profile from "./components/Account/Profile";
import Dashboard from "./components/Account/Dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import FormAuthentication from "./components/Forms/FormAuthenticate";
// import axios from "axios";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={FormAuthentication} />
          <Route path="/" component={Map} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
