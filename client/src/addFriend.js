import { useState, useEffect } from "react";

export default function AddFriend(props) {
    const [buttonState, setButtonState] = useState("");
    const [errorState, setErrorState] = useState(false);

    function handleButton(e) {
        e.preventDefault();
        fetch("/changeFriendsStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonState: buttonState,
                otherUserId: props.otherUserId,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setButtonState(data.buttonState);
            });
    }

    function handleCancelRequest(e) {
        e.preventDefault();
        fetch("/changeFriendsStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonState: "unfriend",
                otherUserId: props.otherUserId,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setButtonState(data.buttonState);
            });
    }

    useEffect(() => {
        fetch("/getFriendshipStatus?otherUserId=" + props.otherUserId)
            .then((resp) => resp.json())
            .then((data) => {
                setButtonState(data.buttonState);
            });
    }, []);

    return (
        <>
            {errorState == true && <div className="error">ERROR!!!!</div>}
            {buttonState == "addFriend" && (
                <div className="friendshipButtonOtherProfile">
                    {" "}
                    <img
                        title="Add Friend"
                        alt="Add Friend"
                        onClick={handleButton}
                        className="addFriendIcon"
                        src="../add-friend.png"
                    ></img>
                </div>
            )}
            {buttonState == "acceptFriend" && (
                <img
                    title="Accept Friendship"
                    alt="Accept Friendship"
                    src="../accept-request.png"
                    className="acceptIcon"
                    onClick={handleButton}
                ></img>
            )}
            {buttonState == "waitResponse" && (
                <div className="icons">
                    <img
                        title="Waiting Response"
                        alt="Waiting Response"
                        id="waitingIcon"
                        src="../waiting-icon.png"
                    ></img>
                    <img
                        title="Cancel Request"
                        alt="Cancel Request"
                        className="cancelRequestIcon"
                        src="../cancel-request.png"
                        onClick={handleCancelRequest}
                    ></img>
                </div>
            )}
            {buttonState == "unfriend" && (
                <div className="friendshipButtonOtherProfile">
                    <img
                        title="Unfriend"
                        alt="Unfriend"
                        onClick={handleButton}
                        className="unfriendIcon"
                        src="../unfriend.png"
                    ></img>
                </div>
            )}
        </>
    );
}
