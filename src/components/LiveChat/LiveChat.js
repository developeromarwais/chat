import React from "react";
import { ChatFeed, Message } from 'react-chat-ui'
import Pusher from 'pusher-js';
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Container, Button as FabButton } from 'react-floating-action-button'
import 'font-awesome/css/font-awesome.min.css';
import apiCall from "../../api";
import "./style.scss";

export default class LiveChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            messageContent: '',
            is_typing: false,
            messages: [],
        };
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({
            activeIndex: selectedIndex
        })
    }

    handleShow = () => {
        this.props.OnOpen();

    }
    getInitials = (Fullname) => {
        if (Fullname) {
            var name = Fullname
            var initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            return initials;
        }
    }

    scrollToBottom = () => {
        var objDiv = document.getElementById("modalBody");
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }


    sendMessage = () => {
        let theMessage = this.state.messageContent
        this.setState({
            messageContent: ''
        })
        const config = {
            headers: { Authorization: `Bearer ${window.localStorage["messagingboared.api_token"]}` }
        };

        let message = new FormData();
        message.append('content', theMessage);
        message.append('sender_id', window.localStorage["messagingboared.userId"]);
        message.append('receiver_id', this.props.activeUser.id);
        apiCall(`messages`, "post", message, config, (res) => {
            var newMessage = new Message({ id: 0, message: theMessage })
            var newDisplayedMessages = this.state.messages;
            newDisplayedMessages.push(newMessage)
            this.setState({
                messages: newDisplayedMessages,
            })
        }, (err) => {
        })
    }

    handleClose = () => {
        this.props.onClose()
    }
    componentDidMount() {
        this.getMessages();
        const pusher = new Pusher('31386b6513308fa6b50b', {
            broadcaster: "pusher",
            key: "31386b6513308fa6b50b",
            cluster: "eu",
            forceTLS: true,
            encrypted: false,
            authEndpoint: "http://chat-back.omarwais.com/api/pusher/auth/chat",
            auth: {
                headers: {
                    Authorization: "Bearer " + window.localStorage["messagingboared.api_token"],
                    Accept: "application/json"
                }
            }
        });

        const channel = pusher.subscribe(`private-chat.${window.localStorage["messagingboared.userId"]}`);
        channel.bind('message', data => {
            var newMessage = new Message({ id: data.userId, message: data.content })
            var newDisplayedMessages = this.state.messages;
            newDisplayedMessages.push(newMessage)
            this.setState({
                messages: newDisplayedMessages
            })
        });
        channel.bind('here', data => {
            debugger
        });
    }
    getMessages = () => {
        const config = {
            headers: { Authorization: `Bearer ${window.localStorage["messagingboared.api_token"]}` }
        };
        apiCall(`messages/${this.props.activeUser.id}`, "get", null, config, (res) => {
            var DisplayedMEssages = res.data.map((message) => {
                // eslint-disable-next-line
                return new Message({ id: window.localStorage["messagingboared.userId"] == message.sender_id ? 0 : 1, message: message.content })
            })
            debugger
            this.setState({
                messages: DisplayedMEssages
            })
            this.scrollToBottom();
        }, (err) => {
        })
    }
    componentDidUpdate(prevProps, prevState) {
        this.scrollToBottom();
        if (this.props.activeUser.id !== prevProps.activeUser.id) {
            this.getMessages();
        } else {
        }

    }

    render() {

        let { messages, is_typing } = this.state;
        let { activeUser, modalOpen } = this.props;
        return (
            <div >

                <Modal size="xl" show={modalOpen} onHide={this.handleClose} backdrop={false} keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>{activeUser.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="modalBody">
                        <ChatFeed
                            messages={messages} // Boolean: list of message objects
                            isTyping={is_typing} // Boolean: is the recipient typing
                            hasInputField={false} // Boolean: use our input, or use your own
                            bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
                            bubbleStyles={
                                {
                                    text: {
                                        fontSize: 16,
                                        maxWidth: '300px',
                                        color: '#000'
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
                {activeUser.name && (
                    <Container>
                        <FabButton tooltip="Live chat" className="Chathead" onClick={this.handleShow}>
                            {this.getInitials(activeUser.name)}
                        </FabButton>
                    </Container>
                )}

            </div>
        );
    }
}

