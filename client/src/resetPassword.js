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

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = { reset: 1, newPassword: "" };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSendCode = this.handleSendCode.bind(this);
        this.handleCheckCode = this.handleCheckCode.bind(this);
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value });
    }
    componentDidMount() {
        // MOUNTED
        console.log(this);
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
                    this.setState({ reset: 2 });
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
    determineRender() {
        if (this.state.reset === 1) {
            return (
                <div className="resetFormContainer">
                    <form className="resetForm">
                        {this.state.error && (
                            <h1 className="registerError">ERROR</h1>
                        )}
                        <TextField
                            size="small"
                            onChange={this.inputUpdate}
                            name="email"
                            className="resetInput"
                            type="text"
                            placeholder="E-Mail"
                        ></TextField>

                        <ThemeProvider theme={theme}>
                            <Button
                                sx={{
                                    width: "90px",
                                    fontSize: "10px",
                                    height: "25px",
                                    mt: "15px",
                                }}
                                variant="contained"
                                className="sendVerificationButton"
                                onClick={this.handleSendCode}
                            >
                                Get Code
                            </Button>
                        </ThemeProvider>
                    </form>
                </div>
            );
        } else if (this.state.reset === 2) {
            return (
                <div className="resetFormContainer">
                    <form className="resetForm">
                        <TextField
                            sx={{ mt: "10px" }}
                            size="small"
                            onChange={this.inputUpdate}
                            className="resetInput"
                            type="text"
                            placeholder="Reset Code"
                            name="code"
                        ></TextField>
                        <TextField
                            sx={{ mt: "10px" }}
                            size="small"
                            onChange={this.inputUpdate}
                            name="newPassword"
                            className="resetInput"
                            placeholder="New Password"
                            type="password"
                            key="passwordReset"
                            // value={this.state.newPassword}
                        ></TextField>
                        <ThemeProvider theme={theme}>
                            <Button
                                sx={{
                                    mt: "15px",
                                    width: "90px",
                                    fontSize: "10px",
                                    height: "25px",
                                }}
                                variant="contained"
                                className="verificationButton"
                                onClick={this.handleCheckCode}
                            >
                                {" "}
                                Reset It!
                            </Button>
                        </ThemeProvider>
                    </form>
                </div>
            );
        } else if (this.state.reset === 3) {
            return (
                <div className="resetFormContainer">
                    <h1>
                        Password Changed. Log in <Link to="/login">here</Link>.
                    </h1>
                </div>
            );
        }
    }
    render() {
        return <>{this.determineRender()}</>;
    }
}
