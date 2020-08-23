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
      <div className="parentHome">
        <Carousel activeIndex={activeIndex} onSelect={this.handleSelect} interval={null} indicators={false} controls={false}>
          <Carousel.Item>
            <div className="row">
              <div className="col-md-6">
                <div className="bg bg1">
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg bg15">
                  <span className="txt">
                    Craft Your Message
                  </span>
                </div>
              </div>
            </div>

          </Carousel.Item>
          <Carousel.Item>
            <div className="row">
              <div className="col-md-6">
                <div className="bg bg25">

                  <span className="txt">
                    Compose it
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg bg2">
                </div>
              </div>




            </div>

          </Carousel.Item>
          <Carousel.Item>
            <div className="row">
              <div className="col-md-6">
                <div className="bg bg3">
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg bg35">

                  <span className="txt">
                    Send it
                  </span>
                </div>
              </div>


            </div>
          </Carousel.Item>
        </Carousel>
        <LiveChat />
      </div>
    );
  }
}

export default Home;
