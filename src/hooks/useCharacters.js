import { useEffect } from "react";
import { useState } from "react";
import useUser from "./useUser";

function useCharacters(query) {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(true);
    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };

        fetch(`${baseApiUrl}/characters${query.toString()}`, options)
            .then(response => {
                setError("");
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(json => {
                setCharacters(json.data);
                setPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setError("Non sono stati trovati personaggi");
                }
                else {
                    setError("C'è stato un errore nel fetch dei personaggi");
                }
                setPending(false);
            })
    }, [user, baseApiUrl, query]);

    return {error, characters, pending};
}

export default useCharacters