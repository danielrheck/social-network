import { BrowserRouter, Route, Link } from "react-router-dom";
import { Component } from "react";
import Logo from "./logo.js";
import ProfilePic from "./profilePic.js";
import Profile from "./profile.js";
import FindPeople from "./findPeople.js";
import Uploader from "./uploader.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

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
        this.updateBioState = this.updateBioState.bind(this);

        this.state = {
            first: "",
            last: "",
            email: "",
            bio: "",
            bioAdd: false,
            bioEdit: false,
            profilePic: "",
            uploaderVisible: false,
            loaded: false,
        };
    }
    updatePicState(pic) {
        this.setState({ profilePic: pic });
    }
    updateBioState(bio) {
        this.setState({ bio: bio });
    }
    componentDidMount() {
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                if (!data.rows[0].bio) {
                    this.setState({ bioAdd: true });
                } else {
                    this.setState({ bioEdit: true });
                }
                this.setState({
                    profilePic: data.rows[0].profile_pic,
                    first: data.rows[0].firstname,
                    last: data.rows[0].lastname,
                    bio: data.rows[0].bio,
                    email: data.rows[0].email,
                    loaded: true,
                });
                if (!data.rows[0].profile_pic) {
                    this.setState({
                        profilePic: "../avatar.png",
                    });
                }
            });
    }
    toggleUploader() {
        if (this.state.uploaderVisible == false) {
            this.setState({ uploaderVisible: true });
        } else {
            this.setState({ uploaderVisible: false });
        }
    }
    render() {
        return (
            <ThemeProvider theme={setTheme}>
                {this.state.loaded && (
                    <div className="app">
                        <div className="appHeaderContainer">
                            <header className="appHeader">
                                <Logo></Logo>
                                <div className="profilePicContainerProfile">
                                    <ProfilePic
                                        profilePicSmall={true}
                                        profilePic={this.state.profilePic}
                                        first={this.state.first}
                                        last={this.state.last}
                                        bio={this.state.bio}
                                        updatePicState={this.updatePicState}
                                        toggleUploader={this.toggleUploader}
                                    ></ProfilePic>
                                </div>
                            </header>
                        </div>

                        <BrowserRouter>
                            <Route exact path="/">
                                <div className="profileContainer">
                                    <Profile
                                        profilePic={this.state.profilePic}
                                        first={this.state.first}
                                        last={this.state.last}
                                        bio={this.state.bio}
                                        bioAdd={this.state.bioAdd}
                                        bioEdit={this.state.bioEdit}
                                        updatePicState={this.updatePicState}
                                        updateBioState={this.updateBioState}
                                        toggleUploader={this.toggleUploader}
                                    ></Profile>
                                </div>

                                {this.state.uploaderVisible && (
                                    <Uploader
                                        toggleUploader={this.toggleUploader}
                                        updatePicState={this.updatePicState}
                                    ></Uploader>
                                )}
                            </Route>
                            <Route path="/findPeople">
                                <FindPeople></FindPeople>
                            </Route>
                        </BrowserRouter>
                    </div>
                )}
            </ThemeProvider>
        );
    }
}
