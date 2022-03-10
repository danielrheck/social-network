import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {};
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSendCode = this.handleSendCode.bind(this);
        this.handleCheckCode = this.handleCheckCode.bind(this);
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value });
    }
    componentDidMount() {
        // MOUNTED
        this.setState({ reset: 1, newPassword: "" });
    }
    determineRender() {
        if (this.state.reset === 1) {
            return (
                <div>
                    <form className="resetForm">
                        {this.state.error && (
                            <h1 className="registerError">ERROR</h1>
                        )}
                        <input
                            onChange={this.inputUpdate}
                            name="email"
                            className="resetInput"
                            type="text"
                            placeholder="E-Mail"
                        ></input>

                        <button
                            className="sendVerificationButton"
                            onClick={this.handleSendCode}
                        >
                            Send Verification Code
                        </button>
                    </form>
                </div>
            );
        } else if (this.state.reset === 2) {
            return (
                <div>
                    <form className="resetForm">
                        <input
                            onChange={this.inputUpdate}
                            className="resetInput"
                            type="text"
                            placeholder="Reset Code"
                            name="code"
                        ></input>
                        <input
                            onChange={this.inputUpdate}
                            name="newPassword"
                            className="resetInput"
                            placeholder="New Password"
                            type="password"
                            value={this.state.newPassword}
                        ></input>
                        <button
                            className="verificationButton"
                            onClick={this.handleCheckCode}
                        >
                            Reset It!
                        </button>
                    </form>
                </div>
            );
        } else if (this.state.reset === 3) {
            return (
                <div>
                    <h1>
                        Password Changed. Log in <Link to="/login">here</Link>.
                    </h1>
                </div>
            );
        }
    }
    handleSendCode(e) {
        e.preventDefault();
        fetch("/reset/sendCode", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.setState({ reset: 2, email: data.email }).then(
                        () => {}
                    );
                } else {
                    // WRONG EMAIL OR ERROR SENDING CODE
                    this.setState({ error: true }).then(() => {});
                }
            });
    }
    handleCheckCode(e) {
        e.preventDefault();
        fetch("/users/checkCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.setState({ reset: 3 }).then(() => {});
                } else {
                    this.setState({ error: true }).then(() => {});
                }
            })
            .catch(() => {
                this.setState({ error: true }).then(() => {});
            });
    }
    render() {
        return <>{this.determineRender()}</>;
    }
}
