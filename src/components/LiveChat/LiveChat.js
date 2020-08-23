import React from "react";
import { ChatFeed, Message } from 'react-chat-ui'
import { Modal, Button } from 'react-bootstrap';
import { Container, Button as FabButton, Link } from 'react-floating-action-button'
import 'font-awesome/css/font-awesome.min.css';
import apiCall from "../../api";
import "./style.scss";

export default class LiveChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            show: false,
            is_typing: true,
            messages: [
                new Message({
                    id: 1,
                    message: "I'm the recipient! (The person you're talking to)",
                }), // Gray bubble
                new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
                new Message({ id: 1, message: "lel!" }), // Blue bubble
            ],
        };
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({
            activeIndex: selectedIndex
        })
    }

    handleShow = () => {
        this.setState({
            show: !this.state.show
        })
    }
    handleClose = () => {
        this.setState({
            show: false
        })
    }


    render() {

        let { show, messages, is_typing } = this.state;

        return (
            <div>

                <Modal size="xl" show={show} onHide={this.handleClose} backdrop={false} keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ChatFeed
                            messages={messages} // Boolean: list of message objects
                            isTyping={is_typing} // Boolean: is the recipient typing
                            hasInputField={false} // Boolean: use our input, or use your own
                            showSenderName // show the name of the user who sent the message
                            bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
                            // JSON: Custom bubble styles
                            bubbleStyles={
                                {
                                    text: {
                                        fontSize: 21
                                    },
                                    chatbubble: {
                                        borderRadius: 70,
                                        padding: 14
                                    }
                                }
                            }
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Container>
                    <FabButton
                        tooltip="The big plus button!"
                        icon="fa fa-envelope"
                        onClick={this.handleShow} />
                </Container>
            </div>
        );
    }
}

