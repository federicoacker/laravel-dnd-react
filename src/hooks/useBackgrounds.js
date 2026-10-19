import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useBackgrounds() {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [backgrounds, setBackgrounds] = useState([]);
    const [backgroundError, setBackgroundError] = useState("");
    const [backgroundPending, setBackgroundPending] = useState(true);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/backgrounds`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setBackgrounds(json.data);
                setBackgroundPending(false);
            })
            .catch(error => {
                if(error.message === "404"){
                    setBackgroundError("No backgrounds found");
                }
                else{
                    setBackgroundError("There was an error while fetching backgrounds");
                }
                setBackgroundPending(false);
            });
    }, [user, baseApiUrl]);

    return {backgrounds, backgroundError, backgroundPending};
}

export default useBackgrounds