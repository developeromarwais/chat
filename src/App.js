import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Pusher from 'pusher-js';
import apiCall from "./api.js";
import { Navbar, Button } from 'react-bootstrap';

import Login from "./components/login/login.js";
import Home from "./pages/home/index.js";


export default class App extends React.Component {
  componentDidMount() {
    const pusher = new Pusher('31386b6513308fa6b50b', {
      cluster: 'eu',
      encrypted: true
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      debugger
      alert(data)
    });
  }
  render() {

    return (<Router>
      <div className="App parentHome">
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
}