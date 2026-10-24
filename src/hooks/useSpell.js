import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useSpell(id) {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [spell, setSpell] = useState([]);
    const [spellError, setSpellError] = useState("");
    const [spellPending, setSpellPending] = useState(true);


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

        fetch(`${baseApiUrl}/spells/${id}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setSpell(json.data);
                setSpellPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setSpellError("Spell not found");
                }
                else {
                    setSpellError("There was an error while fetching the spell");
                }
                setSpellPending(false);
            });
    }, [user, baseApiUrl, id]);

    return { spell,spellError,spellPending };
}

export default useSpell