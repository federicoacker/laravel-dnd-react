import { useEffect, useState } from "react";
import useUser from "./useUser";

function useCharacters(query, scope = "public", page = 1) {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        let cancelled = false;

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };

        fetch(`${baseApiUrl}/characters?${query.toString()}&scope=${scope}&page=${page}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(json => {
                if (!cancelled) {
                    setCharacters(json.data.data);
                    setLastPage(json.data.last_page);
                    setError("");
                    setPending(false);
                }
            })
            .catch(error => {
                if (!cancelled) {
                    setCharacters([]);
                    setLastPage(1);
                    setError(error.message === "404" ? "No characters found" : "Error while fetching characters");
                    setPending(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [user, baseApiUrl, query, scope, page]);

    return { error, characters, pending, lastPage };
}

export default useCharacters