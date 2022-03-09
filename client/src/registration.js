import { Component } from "react";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {};
        this.inputUpdate = this.inputUpdate.bind(this);
        this.inputSubmit = this.inputSubmit.bind(this);
    }
    componentDidMount() {
        // MOUNTED
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value });
    }
    inputSubmit(e) {
        e.preventDefault();
        fetch("/users/register.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    location.reload();
                } else {
                    this.setState({ error: true }).then(() => {});
                }
            })
            .catch(() => {
                this.setState({ error: true }).then(() => {});
            });
    }
    render() {
        return (
            <>
                <h1>Registration</h1>
                <form className="registrationForm">
                    {this.state.error && (
                        <h1 className="registerError">ERROR</h1>
                    )}
                    <input
                        className="registerInput"
                        type="text"
                        name="first"
                        onChange={this.inputUpdate}
                        placeholder="First Name"
                    ></input>
                    <input
                        className="registerInput"
                        type="text"
                        name="last"
                        onChange={this.inputUpdate}
                        placeholder="Last Name"
                    ></input>
                    <input
                        className="registerInput"
                        type="text"
                        name="email"
                        onChange={this.inputUpdate}
                        placeholder="E-Mail"
                    ></input>
                    <input
                        className="registerInput"
                        type="password"
                        name="password"
                        onChange={this.inputUpdate}
                        placeholder="Password"
                    ></input>
                    <button onClick={this.inputSubmit}>Send</button>

                    <div className="alreadyMember">
                        Already a member? Click{" "}
                        <a href="#" className="loginlink">
                            here
                        </a>{" "}
                        to log in.
                    </div>
                </form>
            </>
        );
    }
}
