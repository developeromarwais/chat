import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/login/login.js";
import Home from "./pages/home/index.js";


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }
  componentDidMount() {
    
  }

  render() {
    return (<Router>
      <div className="App parentHome">


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