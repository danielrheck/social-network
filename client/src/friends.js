import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
    acceptFriend,
    fetchFriends,
    deleteFriend,
} from "./redux/friends/slice";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        // 1 - Make fetch to get friends and requests
        fetch("/getAllFriendships")
            .then((resp) => resp.json())
            .then((rows) => {
                // 2 - Dispatch an action to add your friends and requests to redux
                dispatch(fetchFriends(rows.rows));
            });
    }, []);

    let handleAccept = (id) => {
        // 1 - POST to update DB
        fetch("/changeFriendsStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonState: "acceptFriend",
                otherUserId: id,
            }),
        }).then(() => {
            dispatch(acceptFriend(id));
        });
        // 2 - Dispatch an action to update Redux store
    };
    let handleUnfriend = (id) => {
        // 1 - POST to update DB
        // 2 - Dispatch an action to update Redux store
        fetch("/changeFriendsStatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buttonState: "unfriend",
                otherUserId: id,
            }),
        }).then(() => {
            dispatch(deleteFriend(id));
        });
    };

    // select data from redux
    const requests = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friendship) => !friendship.accepted)
    );
    const current_friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friendship) => friendship.accepted)
    );

    return (
        <section>
            <h1>FRIENDS</h1>
            <div className="friendsContainer">
                {current_friends &&
                    current_friends.map((item, idx) => {
                        return (
                            <Paper
                                elevation={5}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "205px",
                                    height: "241px",
                                    p: 1,
                                    bgcolor: "#d2edff6b",
                                }}
                                key={idx}
                            >
                                <div className="friendItem">
                                    <img
                                        className="profilePicFriendsPage"
                                        src={item.profile_pic}
                                    ></img>
                                    <img
                                        className="cancelIcon"
                                        src="./reject.png"
                                        onClick={() => handleUnfriend(item.id)}
                                    />
                                    <div className="friendName">
                                        {" "}
                                        {item.firstname} {item.lastname}
                                    </div>
                                </div>
                            </Paper>
                        );
                    })}
            </div>
            <h1>REQUESTS</h1>
            <div className="friendshipRequestsContainer">
                {requests &&
                    requests.map((item, idx) => {
                        return (
                            <Paper
                                elevation={5}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "205px",
                                    p: 1,
                                    bgcolor: "#d2edff6b",
                                    height: "241px",
                                }}
                                key={idx}
                            >
                                <h1 key={idx}>
                                    <div className="friendItem">
                                        <img
                                            className="profilePicFriendsPage"
                                            src={item.profile_pic}
                                        ></img>
                                        <div className="acceptCancelIcons">
                                            <img
                                                className="cancelIcon"
                                                src="./reject.png"
                                                onClick={() =>
                                                    handleUnfriend(item.id)
                                                }
                                            />
                                            <img
                                                className="acceptIcon"
                                                src="./accept.png"
                                                onClick={() =>
                                                    handleAccept(item.id)
                                                }
                                            />
                                        </div>
                                        <div className="friendRequestName">
                                            {" "}
                                            {item.firstname} {item.lastname}
                                        </div>
                                    </div>
                                </h1>
                            </Paper>
                        );
                    })}
            </div>
        </section>
    );
}
