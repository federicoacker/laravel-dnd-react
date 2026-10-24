import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useFeature(id) {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [feature, setFeature] = useState([]);
    const [featureError, setFeatureError] = useState("");
    const [featurePending, setFeaturePending] = useState(true);


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

        fetch(`${baseApiUrl}/features/${id}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setFeature(json.data);
                setFeaturePending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setFeatureError("Feature not found");
                }
                else {
                    setFeatureError("There was an error while fetching the feature");
                }
                setFeaturePending(false);
            });
    }, [user, baseApiUrl, id]);

    return { feature, featureError, featurePending };
}

export default useFeature