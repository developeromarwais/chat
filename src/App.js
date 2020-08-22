import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login/login.js";
import Home from "./pages/home/index.js";

function App() {
  return (<Router>
    <div className="App">


      <Switch>
        <Route exact path='/' component={Login} />
        <Route path="/sign-in" component={Login} />
        <Route path="/Home" component={Home} />
      </Switch>

    </div></Router>
  );
}

export default App;