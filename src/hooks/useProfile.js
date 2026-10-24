import { useEffect } from "react";
import { useState } from "react";
import useUser from "./useUser";

function useProfile(id) {
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const {user:savedUser, logout} = useUser();
    const [user, setUser] = useState({});
    const [userError, setUserError] = useState("");
    const [userPending, setUserPending] = useState(true);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserPending(true);
        setUserError("");

        const options = {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${savedUser.token}`
            }
        };

        fetch(`${baseApiUrl}/users/${id}`, options)
        .then(response => {
            if(!response.ok){
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(json => {
            setUser(json.data);
            setUserPending(false);
        })
        .catch(error => {
            setUserPending(false);
            if(error.message === "403"){
                setUserError("You don't have permission to view this User");
            }
            else if(error.message === "404"){
                setUserError("User Not Found");
            }
            else{
                setUserError("There was an error while fetching the user");
            }
            logout();
        })
    }, [baseApiUrl, id, savedUser.token, logout]);

    return {user, userError, userPending};
}

export default useProfile