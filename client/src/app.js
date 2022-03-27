import { BrowserRouter, Route, Link } from "react-router-dom";
import { Component } from "react";
import Logo from "./logo.js";
import ProfilePic from "./profilePic.js";
import Profile from "./profile.js";
import OtherProfile from "./otherProfile.js";
import FindPeople from "./findPeople.js";
import Uploader from "./uploader.js";
import Friends from "./friends.js";
import GeneralChat from "./generalChat.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import Paper from "@mui/material/Paper";

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
        this.toggleGeneralChat = this.toggleGeneralChat.bind(this);
        this.updatePicState = this.updatePicState.bind(this);
        this.updateBioState = this.updateBioState.bind(this);

        this.state = {
            loggedUser: "",
            first: "",
            last: "",
            email: "",
            bio: "",
            bioAdd: false,
            bioEdit: false,
            profilePic: "",
            uploaderVisible: false,
            generalChatVisible: false,
            loaded: false,
        };
    }
    updatePicState(pic) {
        this.setState({ profilePic: pic });
    }
    updateBioState(bio) {
        this.setState({ bio: bio });
    }

    deleteAccountHandle() {
        fetch("/user/deleteAccount", { method: "DELETE" })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    location.reload();
                }
            });
    }

    componentDidMount() {
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                if (!data.rows) {
                    location.assign("/logout");
                }
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
                    deleteVisible: false,
                });
                if (!data.rows[0].profile_pic) {
                    this.setState({
                        profilePic: "../avatar.png",
                    });
                }
            })
            .catch((e) => {
                console.log("Error fetching data:  ", e);
            });
    }
    toggleUploader() {
        if (this.state.uploaderVisible == false) {
            this.setState({ uploaderVisible: true });
        } else {
            this.setState({ uploaderVisible: false });
        }
    }

    toggleDeleteModal() {
        if (this.state.deleteVisible == false) {
            this.setState({ deleteVisible: true });
        } else {
            this.setState({ deleteVisible: false });
        }
    }

    toggleGeneralChat() {
        if (this.state.generalChatVisible == false) {
            this.setState({ generalChatVisible: true });
        } else {
            this.setState({ generalChatVisible: false });
        }
    }
    render() {
        return (
            <ThemeProvider theme={setTheme}>
                {this.state.deleteVisible && (
                    <div className="deleteAccountModal">
                        <div className="deleteAccountBox">
                            <div className="deleteConfirmationText">
                                Are you sure you want to permanently delete your
                                account?
                            </div>
                            <div className="deleteConfirmationIcons">
                                <img
                                    className="deleteConfirmationIcon"
                                    src="../back.png"
                                    onClick={() => this.toggleDeleteModal()}
                                ></img>
                                <img
                                    className="deleteConfirmationIcon"
                                    src="../confirm-delete.png"
                                    onClick={() => {
                                        this.deleteAccountHandle();
                                    }}
                                ></img>
                            </div>
                        </div>
                    </div>
                )}

                {this.state.loaded && (
                    <div className="app">
                        <BrowserRouter>
                            <div className="appHeaderContainer">
                                <header className="appHeader">
                                    <Link
                                        to="/"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Logo></Logo>
                                    </Link>

                                    <div className="headerLinks">
                                        <Link
                                            to="/findPeople"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <h1 className="headerLink">
                                                Find People
                                            </h1>
                                        </Link>
                                        <Link
                                            to="/friends"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <h1 className="headerLink">
                                                Friends
                                            </h1>
                                        </Link>
                                    </div>

                                    <div className="profilePicContainerProfile">
                                        <ProfilePic
                                            profilePicSmall={true}
                                            profilePic={this.state.profilePic}
                                            updatePicState={this.updatePicState}
                                            toggleUploader={this.toggleUploader}
                                        ></ProfilePic>
                                        <div className="logoutAndDelete">
                                            <a
                                                className="logoutIconContainer"
                                                href="/logout"
                                            >
                                                <img
                                                    className="logoutIcon"
                                                    src="../logout.png"
                                                    alt="Logout"
                                                ></img>
                                            </a>

                                            <div className="deleteIconContainer">
                                                <img
                                                    className="deleteIcon"
                                                    src="../delete-icon.png"
                                                    alt="Delete Account"
                                                    onClick={() =>
                                                        this.toggleDeleteModal()
                                                    }
                                                ></img>
                                            </div>
                                        </div>
                                    </div>
                                </header>
                            </div>
                            {/* <div className="navBar">
                            <NavBar position="absolute"></NavBar>
                        </div> */}
                            {!this.state.generalChatVisible && (
                                <div className="chatClosedHeader">
                                    <div>General Chat</div>
                                    <img
                                        className="expandIcon"
                                        src="../expand.png"
                                        onClick={() => this.toggleGeneralChat()}
                                    ></img>
                                </div>
                            )}
                            {this.state.generalChatVisible && (
                                <GeneralChat
                                    toggleGeneralChat={this.toggleGeneralChat}
                                ></GeneralChat>
                            )}
                            <Route path="/findPeople">
                                <FindPeople></FindPeople>
                            </Route>
                            <Route path="/friends">
                                <Friends></Friends>
                            </Route>
                            <Route path="/userprofile/:otherUserId">
                                <OtherProfile></OtherProfile>
                            </Route>
                            <Route exact path="/">
                                <Paper
                                    className="profileContainer"
                                    elevation={5}
                                    sx={{
                                        width: "610px",
                                        p: 3,
                                        bgcolor: "#d2edff6b",
                                    }}
                                >
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
                                </Paper>
                            </Route>{" "}
                            {this.state.uploaderVisible && (
                                <Uploader
                                    toggleUploader={this.toggleUploader}
                                    updatePicState={this.updatePicState}
                                ></Uploader>
                            )}
                        </BrowserRouter>
                    </div>
                )}
            </ThemeProvider>
        );
    }
}
