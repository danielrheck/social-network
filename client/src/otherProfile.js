import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import AddFriend from "./addFriend";
import Paper from "@mui/material/Paper";

export default function OtherProfile() {
    const history = useHistory();
    const { otherUserId } = useParams();
    const [error, setError] = useState(false);
    const [loggedUserId, setLoggedUserId] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [picUrl, setPicUrl] = useState("");

    useEffect(() => {
        fetch("/getUserProfileByID/" + otherUserId)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    if (!data.rows[0]) {
                        setError(true);
                    }
                    if (otherUserId == data.loggedUserId) {
                        history.push("/");
                    }
                    setBio(data.rows[0].bio);
                    setPicUrl(data.rows[0].profile_pic);
                    setFirstName(data.rows[0].firstname);
                    setLastName(data.rows[0].lastname);
                    setLoggedUserId(data.loggedUserId);
                } else {
                    console.log("Error");
                }
            })
            .catch((e) => {
                console.log("Error fetching profile from user:  ", e);
                setError(true);
            });
    }, []);

    return (
        <>
            {error && <div>DEU RUIM!</div>}
            <Paper
                className="Papier"
                elevation={5}
                sx={{ width: "500px", p: 3, bgcolor: "#d2edff6b" }}
            >
                <div className="otherProfileContainer">
                    <img id="otherProfilePic" src={picUrl}></img>
                    <div className="otherProfileRow">
                        <div className="otherProfileName">
                            {firstname} {lastname}
                        </div>
                        <div></div>
                        <div>{bio}</div>
                    </div>
                    <AddFriend otherUserId={otherUserId}></AddFriend>
                </div>
            </Paper>
        </>
    );
}
