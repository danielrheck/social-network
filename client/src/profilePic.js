import { Component } from "react";

export default class ProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = { userImageLoaded: false };
    }
    render() {
        return (
            <div className="picContainer">
                <h1>{`Welcome, ${this.props.first}`}</h1>
                <img
                    style={
                        this.state.userImageLoaded ? {} : { display: "none" }
                    }
                    className="profilePic"
                    src={this.props.profilePic}
                    alt={`${this.props.first} ${this.props.last}`}
                    onClick={this.props.toggleUploader}
                    onLoad={() => this.setState({ userImageLoaded: true })}
                />
            </div>
        );
    }
}
