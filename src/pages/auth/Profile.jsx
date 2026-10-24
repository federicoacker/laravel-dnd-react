import { useParams } from "react-router";
import useProfile from "../../hooks/useProfile"
import styles from "./Profile.module.css"
import ProfileCard from "../../components/ProfileCard";
import { useState } from "react";
import useUser from "../../hooks/useUser";

function Profile() {
    const params = useParams();
    const { user: authenticatedUser, logout } = useUser();
    const { user, userError, userPending } = useProfile(params.id);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordPayload, setPasswordPayload] = useState({
        current_password: "",
        password: "",
        password_confirmation: ""

    });
    const baseApiUrl = import.meta.env.VITE_API_URL;

    const handleEdit = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setPasswordPayload({
            ...passwordPayload,
            [name]: value
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        setMessage("");
        setIsSubmitting(true);

        fetch(`${baseApiUrl}/user/password`, {
            method: "PUT",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${authenticatedUser.token}`,
            },
            body: JSON.stringify(passwordPayload),
        })
            .then((response) =>
                response.json().then((data) => ({ response, data }))
            )
            .then(({ response, data }) => {
                if (!response.ok) {
                    if (response.status === 422) {
                        setErrors(data.errors ?? {});
                        setMessage("There was an error in updating your password, check the password you inserted.");
                    } else {
                        setMessage(data.message ?? "Could not update your password.");
                    }
                    return;
                }

                setMessage(data.message ?? "Password updated.");
                setPasswordPayload({
                    current_password: "",
                    password: "",
                    password_confirmation: "",
                });
            })
            .catch(() => {
                setMessage("Could not connect to the server. Please try again.");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };
    return (
        <div className={styles.card}>
            {userPending ? "Loading Profile" : !userError ?
                <div><ProfileCard {...user} handleEdit={handleEdit} handleSubmit={handleSubmit} message={message} isSubmitting={isSubmitting} logout={logout} /></div>
                :
                userError}
        </div>
    )
}

export default Profile