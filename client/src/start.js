import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
import Logo from "./logo";

fetch("/users/id.json").then((resp) =>
    resp
        .json()
        .then((data) => {
            if (data.userId) {
                console.log("ALSO TRIGGERS");
                ReactDOM.render(<Logo />, document.querySelector("main"));
            } else {
                ReactDOM.render(<Welcome />, document.querySelector("main"));
            }
        })
        .catch(() => {
            console.log("Error fetching cookie");
        })
);
