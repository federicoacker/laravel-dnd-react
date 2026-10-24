import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useFeat(id) {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [feat, setFeat] = useState([]);
    const [featError, setFeatError] = useState("");
    const [featPending, setFeatPending] = useState(true);


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

        fetch(`${baseApiUrl}/feats/${id}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setFeat(json.data);
                setFeatPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setFeatError("Feat not found");
                }
                else {
                    setFeatError("There was an error while fetching the feat");
                }
                setFeatPending(false);
            });
    }, [user, baseApiUrl, id]);

    return {feat,featError,featPending };
}

export default useFeat