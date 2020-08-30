import React, { Component } from "react";
import apiCall from "../../api";
import '../login/style.css';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailValue: '',
            passwordValue: '',
            formLoading: false,
            validationSummary: {
                password: "",
                email: "",
                validated: true,
            },
            SignInOpen: false
        };
    }
    SignInSubmit = () => {
        let Login = new FormData();
        Login.append('email', this.state.emailValue);
        Login.append('password', this.state.passwordValue);
        apiCall(`login`, "post", Login, null, (res) => {
            debugger
            this.setState({
                validationSummary: {
                    validated: true,
                    email: "",
                    password: ""
                }
            })
            window.localStorage["messagingboared.api_token"] = res.data.success.token;
            window.localStorage["messagingboared.userId"] = res.data.success.userId;
            window.location.reload();
        }, (err) => {
            if (err.response.status === 422) {
                this.setState({
                    validationSummary: {
                        validated: false,
                        email: err.response.data.errors.email ? err.response.data.errors.email[0] : "",
                        password: err.response.data.errors.password ? err.response.data.errors.password[0] : ""
                    }
                })
            }
        })
    }
    render() {
        const { validationSummary } = this.state;

        return (


            <div className="auth-wrapper" style={{}}>
                <div className="auth-inner">
                    <>
                        <h3>Let's Talk</h3>

                        <div className="form-group">
                            <label>Email address</label>
                            <input onChange={(event) => {
                                this.setState({
                                    emailValue: event.target.value
                                })
                            }} type="email" name="email" className="form-control" placeholder="Enter email" />

                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input onChange={(event) => {
                                this.setState({
                                    passwordValue: event.target.value
                                })
                            }} type="password" name="password" className="form-control" placeholder="Enter password" />
                            {validationSummary.password.length > 0 &&
                                (<>
                                    <div style={{ color: "#7b7b7b", fontSize: "18px", textAlign: "left", padding: "10px" }}>
                                        <span style={{ color: "white" }}>
                                            {validationSummary.password}
                                        </span>
                                    </div>

                                </>)
                            }
                            {validationSummary.email.length > 0 &&
                                (<>
                                    <div style={{ color: "#7b7b7b", fontSize: "18px", textAlign: "left", padding: "10px" }}>
                                        <span style={{ color: "white" }}>
                                            {validationSummary.email}
                                        </span>
                                    </div>
                                </>)
                            }
                        </div>

                        <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div>

                        <button onClick={this.SignInSubmit} className="btn btn-block loginBtn">Submit</button>
                    </>

                </div>
            </div>
        );
    }
}