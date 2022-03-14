import { Component } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import Button from "@mui/material/Button";

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

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputRendered: false,
            bioRendered: true,
            newBio: "",
            error: false,
        };
        this.toggleInputAndText = this.toggleInputAndText.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
        this.inputSubmit = this.inputSubmit.bind(this);
        this.handleBioUpdate = this.handleBioUpdate.bind(this);
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value });
    }
    handleBioUpdate(newBio) {
        this.props.updateBioState(newBio);
    }
    inputSubmit(e) {
        e.preventDefault();
        fetch("/bio/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.handleBioUpdate(this.state.newBio);
                    this.toggleInputAndText();
                } else {
                    this.setState({ error: true });
                }
            });
    }
    toggleInputAndText() {
        if (!this.state.inputRendered) {
            this.setState({ inputRendered: true, bioRendered: false });
        } else {
            this.setState({ inputRendered: false, bioRendered: true });
        }
    }
    render() {
        return (
            <>
                <ThemeProvider theme={theme}>
                    {this.state.erorr && <div>ERRORROORR!</div>}
                    <img
                        onClick={this.toggleInputAndText}
                        className="editIcon"
                        src="../edit.png"
                    ></img>
                    {this.props.bioEdit && (
                        <div className="editAddInputAndButton">
                            {this.state.inputRendered && (
                                <>
                                    <textarea
                                        name="newBio"
                                        className="bioInputAndText bioInput"
                                        rows={"8"}
                                        cols={"48"}
                                        onChange={this.inputUpdate}
                                    ></textarea>

                                    <Button
                                        className="editAddButton"
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
                                        Edit Bio
                                    </Button>
                                </>
                            )}
                            {this.state.bioRendered && (
                                <div
                                    onClick={this.toggleInputAndText}
                                    className="bioText bioInputAndText"
                                >
                                    {this.props.bio}
                                </div>
                            )}
                        </div>
                    )}
                    {this.props.bioAdd && (
                        <div className="editAddInputAndButton">
                            {this.state.inputRendered && (
                                <>
                                    <textarea
                                        name="newBio"
                                        className="bioInputAndText bioInput"
                                        rows={"8"}
                                        cols={"48"}
                                        onChange={this.inputUpdate}
                                    ></textarea>

                                    <Button
                                        className="editAddButton"
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
                                        Add Bio
                                    </Button>
                                </>
                            )}
                            {this.state.bioRendered && (
                                <div className="bioText bioInputAndText"></div>
                            )}
                        </div>
                    )}
                </ThemeProvider>
            </>
        );
    }
}
