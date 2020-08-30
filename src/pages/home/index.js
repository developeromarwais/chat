import React from "react";
import 'font-awesome/css/font-awesome.min.css';
import { Container, Button as FabButton, Link } from 'react-floating-action-button'
import LiveChat from '../../components/LiveChat/LiveChat.js'
import Sidebar from "react-sidebar";
import Echo from "laravel-echo";
import { Navbar, Button } from 'react-bootstrap';
import apiCall from "../../api";
import "./style.scss";

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      sidebarOpen: true,
      modalOpen: false,
      ActiveUser: {},
      users: [
        { name: "OW", id: 1 },
        { name: "MD", id: 2 },
      ]
    };
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({
      activeIndex: selectedIndex
    })
  }

  handleShow = () => {
    this.onSetSidebarOpen(true)
  }
  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  }


  componentDidMount() {
    const config = {
      headers: { Authorization: `Bearer ${window.localStorage["messagingboared.api_token"]}` }
    };
    apiCall(`users`, "get", null, config, (res) => {
      this.setState({
        users: res.data
      })
    }, (err) => {
    })
    const options = {
      broadcaster: "pusher",
      key: "31386b6513308fa6b50b",
      cluster: "eu",
      forceTLS: true,
      encrypted: false,
      authEndpoint: "http://localhost:8000/api/pusher/auth",
      auth: {
        headers: {
          Authorization: "Bearer " + window.localStorage["messagingboared.api_token"],
          Accept: "application/json"
        }
      }
    };

    const echo = new Echo(options);
    echo.join(`online`)
      .here((users) => {
        var onlineUsers = users.map((user) => user.id)
        var corssedOnlineUsers = this.state.users.filter((dbUser) => {
          return onlineUsers.includes(dbUser.id)
        }).map(user => user.id)
        var allUsers = this.state.users.map(user => {
          if (corssedOnlineUsers.includes(user.id)) {
            var thisUser = user;
            thisUser.online = true;
            return thisUser;
          } else {
            var thisUser = user;
            thisUser.online = false;
            return thisUser;
          }
        })
        this.setState({
          users: allUsers
        })
      })
      .joining((user) => {
        this.setState({
          users: this.state.users.map(dbUser => {
            if (dbUser.id == user.id)
              dbUser.online = true;
            return dbUser;
          })
        })
      })
      .leaving((user) => {
        this.setState({
          users: this.state.users.map(dbUser => {
            if (dbUser.id == user.id)
              dbUser.online = false;
            return dbUser;
          })
        })
      });


  }


  getInitials = (Fullname) => {
    var name = Fullname
    var initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
  }

  clickChatHead = (user) => {
    this.setState({
      ActiveUser: user,
      modalOpen: true
    })
  }

  onModalClose = () => {
    this.setState({
      modalOpen: false
    })
  }

  onModalOpen = () => {
    this.setState({
      modalOpen: true
    })
  }

  render() {
    return (
      <div style={{
        backgroundImage: `url('https://www.alpha-apps.ae/static/1af00d45b8d6447b94c1e0d59354c156/f91a2/cover1.png')`
      }}>
        <>
          <Sidebar
            sidebar={
              this.state.users.map((user) => {
                return (<div title={user.name} className="userAvatar" style={{ cursor: 'pointer', border: user.online ? '5px solid green' : '5px solid #2f86fb' }} onClick={() => { this.clickChatHead(user) }}>
                  {this.getInitials(user.name)}
                </div>)
              })
            }
            onSetOpen={this.onSetSidebarOpen}
            docked={this.state.sidebarOpen}
            shadow={false}
            styles={{ sidebar: { background: "#242526", color: 'white', width: '100px' } }}
          >

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
          </Sidebar>
          <Container className="contacts">
            <FabButton
              tooltip="All contacts!"
              icon="fa fa-users"
              onClick={this.handleShow} />
          </Container>
        </>
        {this.state.ActiveUser.name && (
          <LiveChat activeUser={this.state.ActiveUser} modalOpen={this.state.modalOpen} onClose={this.onModalClose} OnOpen={this.onModalOpen} />
        )}
      </div>
    );
  }
}

export default Home;
