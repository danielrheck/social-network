import { useState, useEffect } from "react";
import AddFriend from "./addFriend";

export default function FindPeople() {
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState([]);

    useEffect(() => {
        fetch("/findPeople/lastThree")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    setResults(data.rows);
                }
            })
            .catch((e) => {
                console.log("Error fetching last users:  ", e);
            });
    }, []);

    useEffect(() => {
        let abort;

        fetch("/findPeople/search/?search=" + search)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    if (!abort) {
                        setResults(data.rows);
                    }
                }
            })
            .catch((e) => {
                console.log("Error fetching last users:  ", e);
            });

        return () => {
            abort = true;
        };
    }, [search]);

    return (
        <div className="searchAndResultsContainer">
            <input
                className="searchInput"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search People..."
            ></input>

            <div className="resultsContainer">
                {results.map((item) => (
                    <div key={item.id} className="resultItem">
                        <img
                            className="resultItemPic"
                            src={item.profile_pic}
                        ></img>
                        <a
                            className="profileLink"
                            href={`/userprofile/${item.id}`}
                        >
                            <div className="fullName">
                                {item.firstname} {item.lastname}
                            </div>
                        </a>
                        <AddFriend otherUserId={item.id}></AddFriend>
                    </div>
                ))}
            </div>
        </div>
    );
}
