import { io } from "socket.io-client";
import {
    fetchTenLastMessages,
    addNewMessage,
} from "./redux/generalChat/slice.js";
import { DateTime } from "luxon";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("lastTenMessages", (messages) => {
            for (let i = 0; i < messages.length; i++) {
                let dt = DateTime.fromISO(messages[i].created_at);
                messages[i].created_at = dt.toLocaleString(
                    DateTime.DATETIME_MED
                );
            }
            store.dispatch(fetchTenLastMessages(messages));
        });

        socket.on("message", (message) => {
            let dt = DateTime.fromISO(message.created_at);
            message.created_at = dt.toLocaleString(DateTime.DATETIME_MED);
            store.dispatch(addNewMessage(message));
        });
    }
};
