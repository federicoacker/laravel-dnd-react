import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useProficiencies(query = "") {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [proficiencies, setProficiencies] = useState([]);
    const [proficiencyError, setProficiencyError] = useState("");
    const [proficiencyPending, setProficiencyPending] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProficiencyPending(true);
        setProficiencyError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        const queryString = query ? `?${query}` : "";
        fetch(`${baseApiUrl}/proficiencies${queryString}`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setProficiencies(json.data.data);
                if(json.data.last_page){
                    setLastPage(json.data.last_page);
                }
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
    }, [user, baseApiUrl, query]);

    return { proficiencies, proficiencyError, proficiencyPending, lastPage};
}

export default useProficiencies