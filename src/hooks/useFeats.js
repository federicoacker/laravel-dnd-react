import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useFeats() {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [feats, setFeats] = useState([]);
    const [featError, setFeatError] = useState("");
    const [featPending, setFeatPending] = useState(true);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/feats`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setFeats(json.data);
                setFeatPending(false);
            })
            .catch(error => {
                if(error.message === "404"){
                    setFeatError("No feats found");
                }
                else{
                    setFeatError("There was an error while fetching feats");
                }
                setFeatPending(false);
            });
    }, [user, baseApiUrl]);

    return {feats, featError, featPending};
}

export default useFeats