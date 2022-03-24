import { Component } from "react";
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

export default class ProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = { userImageLoaded: false };
        this.whatToRender = this.whatToRender.bind(this);
    }
    logout(e) {
        e.target.preventDefault();
    }

    // componentDidMount() {
    //     console.log(this.props);
    // }
    whatToRender() {
        if (this.props.profilePicSmall) {
            return (
                <>
                    <img
                        style={
                            this.state.userImageLoaded
                                ? {}
                                : { display: "none" }
                        }
                        className="profilePicSmall"
                        src={this.props.profilePic}
                        alt={`${this.props.first} ${this.props.last}`}
                        onClick={this.props.toggleUploader}
                        onLoad={() => this.setState({ userImageLoaded: true })}
                    />
                    <ThemeProvider theme={setTheme}></ThemeProvider>
                </>
            );
        } else if (this.props.profilePicBig) {
            return (
                <>
                    <div className="profilePicContainer">
                        <img
                            style={
                                this.state.userImageLoaded
                                    ? {}
                                    : { display: "none" }
                            }
                            className="profilePicBig"
                            src={this.props.profilePic}
                            alt={`${this.props.first} ${this.props.last}`}
                            onClick={this.props.toggleUploader}
                            onLoad={() =>
                                this.setState({ userImageLoaded: true })
                            }
                        />
                        <div className="helloUser">
                            Hello, {this.props.first} {this.props.last}
                        </div>
                    </div>
                </>
            );
        } else {
            return <></>;
        }
    }

    render() {
        return this.whatToRender();
    }
}
