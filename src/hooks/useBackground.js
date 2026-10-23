import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useBackground(id) {
    const [background, setBackground] = useState({});
    const [backgroundError, setBackgroundError] = useState("");
    const [backgroundPending, setBackgroundPending] = useState(true);
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const { user } = useUser();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBackgroundPending(true);
        setBackgroundError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/backgrounds/${id}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                console.log(json);
                setBackground(json.data);
                setBackgroundPending(false);
            })
            .catch(error => {
                if (error.message === "404") {
                    setBackgroundError("Background not found");
                }
                else {
                    setBackgroundError("There was an error while fetching the background");
                }
                setBackgroundPending(false);
            });
    }, [id, baseApiUrl, user.token]);

    return { background, backgroundError, backgroundPending };
}

export default useBackground