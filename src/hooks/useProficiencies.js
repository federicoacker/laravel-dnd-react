import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useProficiencies() {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [proficiencies, setProficiencies] = useState([]);
    const [proficiencyError, setProficiencyError] = useState("");
    const [proficiencyPending, setProficiencyPending] = useState(true);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/proficiencies`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setProficiencies(json.data);
                setProficiencyPending(false);
            })
            .catch(error => {
                if(error.message === "404"){
                    setProficiencyError("No proficiencies found");
                }
                else{
                    setProficiencyError("There was an error while fetching proficiencies");
                }
                setProficiencyPending(false);
            });
    }, [user, baseApiUrl]);

    return { proficiencies, proficiencyError, proficiencyPending};
}

export default useProficiencies