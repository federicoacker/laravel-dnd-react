import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useBackgrounds(query = "") {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [backgrounds, setBackgrounds] = useState([]);
    const [backgroundError, setBackgroundError] = useState("");
    const [backgroundPending, setBackgroundPending] = useState(true);
    const [lastPage, setLastPage] = useState(1);
    useEffect(() => {
        // Questa fetch deve settare a true il pending per far tornare la variabile di stato a false dopo il fetch fatto nella filterContext
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBackgroundPending(true);
        setBackgroundError("");

        const queryString = query ? `?${query}` : "";
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/backgrounds${queryString}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                console.log(json);
                setBackgrounds(json.data.data);
                if (json.data.last_page) {
                    setLastPage(json.data.last_page);
                }
                setBackgroundPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setBackgroundError("No backgrounds found");
                }
                else {
                    setBackgroundError("There was an error while fetching backgrounds");
                }
                setBackgroundPending(false);
            });
    }, [user, baseApiUrl, query]);

    return { backgrounds, backgroundError, backgroundPending, lastPage };
}

export default useBackgrounds