import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {};
        this.inputUpdate = this.inputUpdate.bind(this);
        this.inputSubmit = this.inputSubmit.bind(this);
    }
    componentDidMount() {}

    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value });
    }
    inputSubmit(e) {
        e.preventDefault();
        fetch("/users/login.json", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    history.pushState(null, null, "/");
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
                {this.state.error && <h1 className="registerError">ERROR</h1>}
                <form className="loginForm">
                    <input
                        onChange={this.inputUpdate}
                        className="loginInput"
                        type="text"
                        placeholder="E-Mail"
                        name="email"
                    ></input>
                    <input
                        onChange={this.inputUpdate}
                        className="loginInput"
                        type="password"
                        placeholder="Password"
                        name="password"
                    ></input>
                    <button onClick={this.inputSubmit}>Login</button>
                    <div className="alreadyMember">
                        Not a member? Click <Link to="/">here</Link> to
                        register.
                    </div>
                </form>
            </>
        );
    }
}
