import { io } from "socket.io-client";
import {
    fetchTenLastMessages,
    addNewMessage,
} from "./redux/generalChat/slice.js";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("lastTenMessages", (messages) =>
            store.dispatch(fetchTenLastMessages(messages))
        );

        socket.on("message", (message) =>
            store.dispatch(addNewMessage(message))
        );
    }
};
