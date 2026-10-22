import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useClasses(query = "") {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [classes, setClasses] = useState([]);
    const [classError, setClassError] = useState("");
    const [classPending, setClassPending] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        // Questa fetch deve settare a true il pending per far tornare la variabile di stato a false dopo il fetch fatto nella filterContext
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setClassPending(true);
        setClassError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };

        const queryString = query ? `?${query}` : "";

        fetch(`${baseApiUrl}/classes${queryString}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setClasses(json.data.data);
                if (json.data.last_page) {
                    setLastPage(json.data.last_page);
                }
                setClassPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setClassError("No classes found");
                }
                else {
                    setClassError("There was an error while fetching classes");
                }
                setClassPending(false);
            });
    }, [user, baseApiUrl, query]);

    return { classes, classError, classPending, lastPage };
}

export default useClasses