import React from "react";
import { ChatFeed, Message } from 'react-chat-ui'
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
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
            messageContent: '',
            is_typing: true,
            messages: [],
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

    componentDidMount() {
        const config = {
            headers: { Authorization: `Bearer ${window.localStorage["messagingboared.api_token"]}` }
        };
        apiCall(`messages`, "get", null, config, (res) => {
            var DisplayedMEssages = res.data.map((message) => {
                return new Message({ id: window.localStorage["messagingboared.userId"] == message.sender_id ? 0 : 1, message: message.content })
            })
            this.setState({
                messages: DisplayedMEssages
            })
        }, (err) => {
        })
    }

    sendMessage = () => {
        const config = {
            headers: { Authorization: `Bearer ${window.localStorage["messagingboared.api_token"]}` }
        };

        let message = new FormData();
        message.append('content', this.state.messageContent);
        message.append('sender_id', window.localStorage["messagingboared.userId"]);
        message.append('receiver_id', 2);
        apiCall(`messages`, "post", message, config, (res) => {
            this.setState({
                messageContent: ''
            })
        }, (err) => {
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
                                        fontSize: 16,
                                        maxWidth: '300px'
                                    },
                                    chatbubble: {
                                        borderRadius: 70,
                                        padding: 12
                                    }
                                }
                            }
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <InputGroup className="mb-3">
                            <FormControl
                                value={this.state.messageContent}
                                onChange={(event) => {
                                    this.setState({
                                        messageContent: event.target.value
                                    })
                                }}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        this.sendMessage()
                                    }
                                }}
                                placeholder="Your message"
                                aria-label="Username"
                                className="msgInput"
                                aria-describedby="basic-addon1"
                            />
                            <InputGroup.Prepend>
                                <Button variant="primary" className="sndBtn" onClick={this.sendMessage}>
                                    <span className="fa fa-paper-plane">

                                    </span>
                                </Button>
                            </InputGroup.Prepend>

                        </InputGroup>
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

