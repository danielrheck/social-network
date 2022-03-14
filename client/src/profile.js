import { Component } from "react";
import ProfilePic from "./profilePic.js";
import BioEditor from "./bioEditor";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false,
            bio: "",
            bioEdit: "",
            bioAdd: "",
        };
    }

    render() {
        return (
            <>
                <ProfilePic
                    profilePicBig={true}
                    profilePic={this.props.profilePic}
                    first={this.props.first}
                    last={this.props.last}
                    updatePicState={this.props.updatePicState}
                    toggleUploader={this.props.toggleUploader}
                ></ProfilePic>
                <BioEditor
                    updateBioState={this.props.updateBioState}
                    bioEdit={this.props.bioEdit}
                    bioAdd={this.props.bioAdd}
                    first={this.props.first}
                    last={this.props.last}
                    bio={this.props.bio}
                ></BioEditor>
            </>
        );
    }
}
