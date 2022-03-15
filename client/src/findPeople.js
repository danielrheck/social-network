import { useState, useEffect } from "react";

export default function FindPeople() {
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        console.log("Fetch");
        fetch("/findPeople/lastThree")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    setResults(data.rows);
                    setLoaded(true);
                }
            })
            .catch((e) => {
                console.log("Error fetching last users:  ", e);
            });
    }, []);

    useEffect(() => {
        let abort;
        if (loaded) {
            fetch("/findPeople/search/?search=" + search)
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.success) {
                        console.log(data.rows);
                        if (!abort) {
                            setResults(data.rows);
                        }
                    }
                })
                .catch((e) => {
                    console.log("Error fetching last users:  ", e);
                });
        }
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
                        <div className="fullName">
                            {item.firstname} {item.lastname}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}