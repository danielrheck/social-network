import { produce } from "immer";

export default function friendsReducer(friends = [], action) {
    if (action.type === "friends-and-requests/fetch") {
        return action.payload.friendships;
    } else if (action.type === "friends-and-requests/accept") {
        let updatedFriends = produce(friends, (draft) => {
            for (let i = 0; i < draft.length; i++) {
                if (draft[i].id == action.payload.id) {
                    draft[i].accepted = true;
                }
            }
            return draft;
        });
        return updatedFriends;
    } else if (action.type === "friends-and-requests/delete") {
        const updatedFriends = produce(friends, (draft) => {
            for (let i = 0; i < draft.length; i++) {
                if (draft[i].id == action.payload.id) {
                    draft.splice(i, 1);
                }
            }
            return draft;
        });
        return updatedFriends;
    }
    return friends;
}

export function fetchFriends(friendships) {
    return {
        type: "friends-and-requests/fetch",
        payload: { friendships },
    };
}

export function acceptFriend(id) {
    return {
        type: "friends-and-requests/accept",
        payload: { id },
    };
}

export function deleteFriend(id) {
    return {
        type: "friends-and-requests/delete",
        payload: { id },
    };
}
