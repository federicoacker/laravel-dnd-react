import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useFeatures(query = "") {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [features, setFeatures] = useState([]);
    const [featureError, setFeatureError] = useState("");
    const [featurePending, setFeaturePending] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        // Questa fetch deve settare a true il pending per far tornare la variabile di stato a false dopo il fetch fatto nella filterContext
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFeaturePending(true);
        setFeatureError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };

        const queryString = query ? `?${query}` : "";

        fetch(`${baseApiUrl}/features${queryString}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setFeatures(json.data.data);
                if (json.data.last_page) {
                    setLastPage(json.data.last_page);
                }
                setFeaturePending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setFeatureError("No classes found");
                }
                else {
                    setFeatureError("There was an error while fetching classes");
                }
                setFeaturePending(false);
            });
    }, [user, baseApiUrl, query]);

    return { features, featureError, featurePending, lastPage };
}

export default useFeatures