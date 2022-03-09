import Registration from "./registration";
import Logo from "./logo";

export default function Welcome() {
    return (
        <div className="welcomeContainer">
            <Logo />
            <div className="welcome">Welcome</div>

            <Registration className="registro" />
        </div>
    );
}
