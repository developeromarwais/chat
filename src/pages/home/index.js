import React from "react";
import { Carousel } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import LiveChat from '../../components/LiveChat/LiveChat.js'
import apiCall from "../../api";
import "./style.scss";

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({
      activeIndex: selectedIndex
    })
  }


  render() {

    let { activeIndex } = this.state;

    return (
      <div>
     
        <LiveChat />
      </div>
    );
  }
}

export default Home;
