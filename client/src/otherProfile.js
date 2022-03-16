import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function OtherProfile() {
    const history = useHistory();
    const { id } = useParams();
    const [error, setError] = useState(false);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [picUrl, setPicUrl] = useState("");

    useEffect(() => {
        fetch("/getUserProfileByID/" + id)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    if (!data.rows[0]) {
                        setError(true);
                    }
                    if (id == data.loggedUserId) {
                        history.push("/");
                    }
                    setBio(data.rows[0].bio);
                    setPicUrl(data.rows[0].profile_pic);
                    setFirstName(data.rows[0].firstname);
                    setLastName(data.rows[0].lastname);
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
            <div>{firstname}</div>
            <div>{lastname}</div>
            <div>{bio}</div>
            <div>{picUrl}</div>
        </>
    );
}
