import { BrowserRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Logo from "./logo";
import Login from "./login";

export default function Welcome() {
    return (
        <div className="welcomeContainer">
            <Logo />
            <div className="welcome">Welcome</div>
            <BrowserRouter>
                <Route path="/login">
                    <Login></Login>
                </Route>
                <Route exact path="/">
                    <Registration className="registro" />
                </Route>
            </BrowserRouter>
        </div>
    );
}
