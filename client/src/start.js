import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import reducer from "./redux/reducer";
import { init } from "./socket.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

fetch("/users/id.json").then((resp) =>
    resp
        .json()
        .then((data) => {
            if (data.userId) {
                init(store);
                ReactDOM.render(
                    <Provider store={store}>
                        <App />
                    </Provider>,
                    document.querySelector("main")
                );
            } else {
                ReactDOM.render(<Welcome />, document.querySelector("main"));
            }
        })
        .catch(() => {
            console.log("Error fetching cookie");
        })
);
