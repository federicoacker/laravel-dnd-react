import { useEffect } from "react";
import { useState } from "react"
import useUser from "./useUser";

function useClasses() {
    const { user } = useUser();
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const [classes, setClasses] = useState([]);
    const [classError, setClassError] = useState("");
    const [classPending, setClassPending] = useState(true);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };
        fetch(`${baseApiUrl}/classes`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            }
            )
            .then(json => {
                setClasses(json.data);
                setClassPending(false);
            })
            .catch(error => {
                if(error.message === "404"){
                    setClassError("No classes found");
                }
                else{
                    setClassError("There was an error while fetching classes");
                }
                setClassPending(false);
            });
    }, [user, baseApiUrl]);

    return {classes, classError, classPending};
}

export default useClasses