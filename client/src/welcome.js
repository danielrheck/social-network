import { BrowserRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Logo from "./logo";
import Login from "./login";
import ResetPassword from "./resetPassword";

export default function Welcome() {
    return (
        <div className="welcomeContainer">
            <Logo />

            <BrowserRouter>
                <Route path="/reset">
                    <ResetPassword></ResetPassword>
                </Route>
                <Route path="/login">
                    <Login></Login>
                </Route>
                <Route exact path="/">
                    <Registration className="register" />
                </Route>
            </BrowserRouter>
        </div>
    );
}
