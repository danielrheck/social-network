import { Component } from "react";
import Logo from "./logo.js";
import ProfilePic from "./profilePic.js";
import Uploader from "./uploader.js";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import { Link } from "react-router-dom";

let setTheme = createTheme({
    palette: {
        primary: {
            main: blueGrey[500],
        },
        secondary: {
            main: "#64b5f6",
        },
    },
});

export default class App extends Component {
    constructor() {
        super();
        this.toggleUploader = this.toggleUploader.bind(this);
        this.updatePicState = this.updatePicState.bind(this);

        this.state = {
            first: "",
            last: "",
            email: "",
            profilePic: "",
            uploaderVisible: false,
        };
    }
    updatePicState(pic) {
        this.setState({ profilePic: pic });
    }
    componentDidMount() {
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                this.setState({
                    profilePic: data.rows[0].profile_pic,
                    first: data.rows[0].firstname,
                    last: data.rows[0].lastname,
                    email: data.rows[0].email,
                });
            });
    }
    toggleUploader() {
        if (this.state.uploaderVisible == false) {
            this.setState({ uploaderVisible: true });
        } else {
            this.setState({ uploaderVisible: false });
        }
    }
    logout(e) {
        e.target.preventDefault();
    }
    render() {
        return (
            <ThemeProvider theme={setTheme}>
                <div className="app">
                    <Logo></Logo>
                    <a href="/logout">
                        <Button
                            sx={{
                                width: "35px",
                                fontSize: "8px",
                                height: "25px",
                                mt: "15px",
                                mb: "5px",
                                bottom: "6px",
                            }}
                            variant="contained"
                            onClick={this.logout}
                        >
                            Logout
                        </Button>
                    </a>

                    <ProfilePic
                        profilePic={this.state.profilePic}
                        first={this.state.first}
                        last={this.state.last}
                        updatePicState={this.updatePicState}
                        toggleUploader={this.toggleUploader}
                    ></ProfilePic>
                    {this.state.uploaderVisible && (
                        <Uploader
                            toggleUploader={this.toggleUploader}
                            updatePicState={this.updatePicState}
                        ></Uploader>
                    )}
                </div>
            </ThemeProvider>
        );
    }
}
