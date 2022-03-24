import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function GeneralChat() {
    let messages = [];
    messages = useSelector((state) => {
        return state.generalChatMessages;
    });

    let newMessage = function () {
        console.log("thigger");
        socket.emit("newMessage", "NasdasdaOVA!!!!");
    };

    return (
        <>
            {messages &&
                messages.map((msg) => {
                    return (
                        <div key={msg.message_id} onClick={() => newMessage()}>
                            {msg.message}
                        </div>
                    );
                })}
        </>
    );
}
