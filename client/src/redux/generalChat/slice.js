import { produce } from "immer";

export default function generalChatReducer(messages = [], action) {
    if (action.type === "general-chat/fetchLastTenMessages") {
        let lastTenMessages = produce(messages, (draft) => {
            action.payload.messages.forEach((message) => {
                draft.push(message);
            });
            return draft;
        });
        return lastTenMessages;
    } else if (action.type === "general-chat/addNewMessage") {
        let newMessage = produce(messages, (draft) => {
            draft.unshift(action.payload.newMessage);
            return draft;
        });
        return newMessage;
    }
    return messages;
}

export function fetchTenLastMessages(messages) {
    return {
        type: "general-chat/fetchLastTenMessages",
        payload: { messages },
    };
}

export function addNewMessage(newMessage) {
    return {
        type: "general-chat/addNewMessage",
        payload: { newMessage },
    };
}
