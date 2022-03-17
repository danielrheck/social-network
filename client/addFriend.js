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
                <button onClick={handleButton}>Add Friend</button>
            )}
            {buttonState == "acceptFriend" && (
                <button onClick={handleButton}>Accept Friend</button>
            )}
            {buttonState == "waitResponse" && (
                <button onClick={handleButton}>Wait for response</button>
            )}
            {buttonState == "unfriend" && (
                <button onClick={handleButton}>Unfriend</button>
            )}
        </>
    );
}
