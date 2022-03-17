import { Component } from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const theme = createTheme({
    palette: {
        primary: {
            main: blueGrey[500],
        },
        secondary: {
            main: "#64b5f6",
        },
    },
});

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
                <div className="loginFormContainer">
                    <ThemeProvider theme={theme}>
                        {this.state.error && (
                            <h1 className="loginError">ERROR</h1>
                        )}
                        <form className="loginForm">
                            <TextField
                                size="small"
                                onChange={this.inputUpdate}
                                className="loginInput"
                                type="text"
                                placeholder="E-Mail"
                                name="email"
                                key="resetCode"
                            ></TextField>
                            <TextField
                                sx={{ mt: "15px" }}
                                size="small"
                                onChange={this.inputUpdate}
                                className="loginInput"
                                type="password"
                                placeholder="Password"
                                name="password"
                            ></TextField>
                            <Button
                                sx={{
                                    width: "90px",
                                    fontSize: "10px",
                                    height: "25px",
                                    mt: "15px",
                                    mb: "5px",
                                }}
                                variant="contained"
                                onClick={this.inputSubmit}
                            >
                                Login
                            </Button>
                            <div className="alreadyMember">
                                Forgot you password? Click{" "}
                                <Link to="/reset">here</Link> to reset it.
                            </div>
                            <div className="alreadyMember">
                                Not a member? Click <Link to="/">here</Link> to
                                register.
                            </div>
                        </form>
                    </ThemeProvider>{" "}
                </div>
            </>
        );
    }
}
