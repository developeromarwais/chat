import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import apiCall from "./api.js";
import { Navbar, Button } from 'react-bootstrap';

import Login from "./components/login/login.js";
import Home from "./pages/home/index.js";

function App() {
  return (<Router>
    <div className="App">
      {typeof (window.localStorage["messagingboared.api_token"]) !== 'undefined' && (
        <Navbar>
          <Navbar.Brand href="#home">MessageBoared</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button variant="outline-secondary" onClick={() => {
                const config = {
                  headers: { Authorization: `Bearer ${window.localStorage["messagingboared.api_token"]}` }
                };
                apiCall(`logout`, "post", null, config, (res) => {
                  debugger
                  localStorage.removeItem("messagingboared.api_token")
                  localStorage.removeItem("messagingboared.userId")
                  localStorage.removeItem("messagingboared.userName")
                  window.location.reload();

                }, (err) => {
                })
              }}>Sign Out</Button>{' '}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      )
      }


      <Switch>
        {typeof (window.localStorage["messagingboared.api_token"]) !== 'undefined'
          && (
            <>
              <Route exact path='/' component={Home} />
              <Route path="/Home" component={Home} />
            </>
          )
        }
        {typeof (window.localStorage["messagingboared.api_token"]) === 'undefined'
          && (
            <>
              <Route exact path='/' component={Login} />
              <Route path="/Home" component={Login} />
            </>
          )
        }
        <Route path="/sign-in" component={Login} />
        <Redirect to="/" />
      </Switch>

    </div></Router>
  );
}

export default App;