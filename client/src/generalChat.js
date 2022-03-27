import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { socket } from "./socket";

export default function GeneralChat(props) {
    const [message, setMessage] = useState([]);

    const inputRef = useRef();

    let messages = [];

    messages = useSelector((state) => {
        return state.generalChatMessages;
    });

    let newMessage = function () {
        if (message != "") {
            socket.emit("newMessage", message);
            inputRef.current.value = "";
            inputRef.current.focus();
        }
    };

    return (
        <div className="chatContainer">
            <div className="chatHeader">
                <div>General Chat</div>
                <img
                    className="minimizeIcon"
                    src="../minimize.png"
                    onClick={props.toggleGeneralChat}
                ></img>
            </div>
            <div className="messagesContainer">
                {" "}
                {messages &&
                    messages.map((msg) => {
                        return (
                            <div
                                className="messageItem"
                                key={msg.message_id}
                                onClick={() => newMessage()}
                            >
                                {" "}
                                <div className="profileAndName">
                                    <img
                                        className="chatProfilePic"
                                        src={msg.profile_pic}
                                    ></img>
                                    <h3 className="userFullName">
                                        {msg.firstname} {msg.lastname}
                                    </h3>
                                    <h4 className="timestamp">
                                        {msg.created_at}
                                    </h4>
                                </div>
                                <div className="messageText">{msg.message}</div>
                            </div>
                        );
                    })}
            </div>
            <div className="messageInputContainer">
                <input
                    ref={inputRef}
                    className="messageInput"
                    onChange={(e) => setMessage(e.target.value)}
                ></input>
                <img
                    src="../send.png"
                    className="sendIcon"
                    onClick={() => newMessage()}
                ></img>
            </div>
        </div>
    );
}
