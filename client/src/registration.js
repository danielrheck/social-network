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
                <ThemeProvider theme={theme}>
                    <div className="registrationFormContainer">
                        <form className="registrationForm">
                            {this.state.error && (
                                <h1 className="registerError">ERROR</h1>
                            )}
                            <TextField
                                sx={{ mt: "15px" }}
                                size="small"
                                className="registerInput"
                                type="text"
                                name="first"
                                onChange={this.inputUpdate}
                                placeholder="First Name"
                            ></TextField>
                            <TextField
                                sx={{ mt: "15px" }}
                                size="small"
                                className="registerInput"
                                type="text"
                                name="last"
                                onChange={this.inputUpdate}
                                placeholder="Last Name"
                            ></TextField>
                            <TextField
                                sx={{ mt: "15px" }}
                                size="small"
                                className="registerInput"
                                type="text"
                                name="email"
                                onChange={this.inputUpdate}
                                placeholder="E-Mail"
                            ></TextField>
                            <TextField
                                sx={{ mt: "15px" }}
                                size="small"
                                className="registerInput"
                                type="password"
                                name="password"
                                onChange={this.inputUpdate}
                                placeholder="Password"
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
                                Register
                            </Button>

                            <div className="alreadyMember">
                                Already a member? Click{" "}
                                <Link to="/login">here</Link> to log in.
                            </div>
                        </form>
                    </div>
                </ThemeProvider>
            </>
        );
    }
}
