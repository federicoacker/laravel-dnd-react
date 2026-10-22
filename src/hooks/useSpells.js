import { useEffect, useState } from "react";
import useUser from "./useUser";

function useSpells(query = "") {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [spells, setSpells] = useState([]);
    const [spellError, setSpellError] = useState("");
    const [spellPending, setSpellPending] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        // Questa fetch deve settare a true il pending per far tornare la variabile di stato a false dopo il fetch fatto nella filterContext
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSpellPending(true);
        setSpellError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        const queryString = query ? `?${query}` : "";
        fetch(`${baseApiUrl}/spells${queryString}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setSpells(json.data.data);
                if (json.data.last_page) {
                    setLastPage(json.data.last_page);
                }
                setSpellPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setSpellError("No spells found");
                } else {
                    setSpellError("There was an error while fetching spells");
                }
                setSpellPending(false);
            });
    }, [user, baseApiUrl, query]);

    return { spells, spellError, spellPending, lastPage };
}

export default useSpells