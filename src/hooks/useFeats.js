import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useFeats(query = "") {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [feats, setFeats] = useState([]);
    const [featError, setFeatError] = useState("");
    const [featPending, setFeatPending] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        // Questa fetch deve settare a true il pending per far tornare la variabile di stato a false dopo il fetch fatto nella filterContext
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFeatPending(true);
        setFeatError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };

        const queryString = query ? `?${query}` : "";

        fetch(`${baseApiUrl}/feats${queryString}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setFeats(json.data.data);
                if(json.data.last_page){
                    setLastPage(json.data.last_page);
                }
                setFeatPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setFeatError("No feats found");
                }
                else {
                    setFeatError("There was an error while fetching feats");
                }
                setFeatPending(false);
            });
    }, [user, baseApiUrl, query]);

    return { feats, featError, featPending, lastPage };
}

export default useFeats