import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
import App from "./app";

fetch("/users/id.json").then((resp) =>
    resp
        .json()
        .then((data) => {
            if (data.userId) {
                history.pushState(null, null, "/");
                ReactDOM.render(<App />, document.querySelector("main"));
            } else {
                ReactDOM.render(<Welcome />, document.querySelector("main"));
            }
        })
        .catch(() => {
            console.log("Error fetching cookie");
        })
);
