import { Component } from "react";
import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

const Input = styled("input")({
    display: "none",
});

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

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.inputUpdate = this.inputUpdate.bind(this);
        this.inputSubmit = this.inputSubmit.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.handlePicUpdate = this.handlePicUpdate.bind(this);
        this.fileInput = React.createRef();
        this.state = {};
    }
    inputUpdate({ target }) {
        this.setState({ [target.name]: target.value });
    }
    selectFile({ target }) {
        this.setState({ file: target.files[0] });
    }
    handlePicUpdate(newPic) {
        this.props.updatePicState(newPic);
    }
    inputSubmit(e) {
        e.preventDefault();
        let file = this.fileInput.current.files[0];
        const fd = new FormData();
        fd.append("file", file);
        fetch("/pic/upload", {
            method: "POST",
            body: fd,
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.props.toggleUploader();
                    this.handlePicUpdate(data.profilePic);
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((e) => {
                console.log("AAAAAAAAAAA", e);
                this.setState({ error: true }).then(() => {});
            })
            .catch((e) => {
                console.log("ERROR:  ", e);
            });
    }
    render() {
        return (
            <div className="uploaderContainer">
                <div
                    className="closeButtonBox"
                    onClick={this.props.toggleUploader}
                >
                    <img className="closeButton" src="/cross-mark.png"></img>
                </div>

                <ThemeProvider theme={theme}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <label
                            className="uploadFormContainer"
                            htmlFor="icon-button-file"
                        >
                            <Input
                                accept="image/*"
                                id="icon-button-file"
                                type="file"
                                ref={this.fileInput}
                                key="imagefile"
                                name="imageFile"
                                onChange={this.selectFile}
                            />
                            <IconButton
                                size="large"
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                            >
                                <PhotoCamera />
                            </IconButton>
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
                                onClick={this.inputSubmit}
                            >
                                Update!
                            </Button>
                        </label>
                    </Stack>
                </ThemeProvider>
            </div>
        );
    }
}
