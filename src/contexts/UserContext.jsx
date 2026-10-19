import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import validateUser from "../utils/functions/validateUser.js";

const UserContext = createContext(null);

function UserProvider({ children }) {
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const guestUser = { name: "", email: "", token: "", role: "guest" };
    const navigate = useNavigate();

    /** VARIABILI DI STATO **/
    const [registrationErrors, setRegistrationErrors] = useState({});
    const [error, setError] = useState("");
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("savedUser");

        if (!savedUser) {
            return guestUser;
        }

        try {
            return { ...guestUser, ...JSON.parse(savedUser) }
        } catch (error) {
            localStorage.removeItem("savedUser");
            console.error(error);
            return guestUser;
        }
    });

    /** USE EFFECT **/
    useEffect(() => {
        localStorage.setItem("savedUser", JSON.stringify(user));
    }, [user]);


    /** FUNZIONI **/
    //LOGIN
    const login = (user) => {
        const options = {
            method: "POST",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            },
            body: JSON.stringify(user)
        }
        fetch(`${baseApiUrl}/login`, options)
            .then(response => {
                setError("");
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(json => {
                setUser({
                    id: json.data.user.id,
                    name: json.data.user.name,
                    role: json.data.user.role,
                    email: json.data.user.email,
                    token: json.data.token
                });
                navigate("./");
            })
            .catch(error => {
                if (error.message === "401") {
                    setError("Le credenziali inserite non sono valide");
                }
                else {
                    setError("C'è stato un problema durante il login, ritenta più tardi");
                }
            })
    }
    //LOGOUT
    const logout = () => {
        if (!user) {
            return;
        }
        const options = {
            method: "POST",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                Authorization: `Bearer ${user.token}`
            }
        };

        fetch(`${baseApiUrl}/logout`, options);


        localStorage.setItem("savedUser", JSON.stringify(guestUser));
        setUser(guestUser);
        setError("");
        navigate('./');
    }

    //REGISTER
    const register = (user) => {
        const { validatedUser, errors } = validateUser(user);
        if (Object.values(errors).some(x => x !== "")) {
            console.error(errors);
            setRegistrationErrors(errors);
            return;
        }

        const options = {
            method: "POST",
            headers: {
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            },
            body: JSON.stringify(validatedUser)
        };

        fetch(`${baseApiUrl}/register`, options)
            .then(response => {
                setRegistrationErrors({});
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(() => {
                const user = {
                    email: validatedUser.email,
                    password: validatedUser.password
                }
                login(user);
            })
            .catch(() => {
                setError("C'è stato un problema durante la registrazione, ritenta più tardi");
            })
    }

    const value = { registrationErrors, error, user, login, logout, register };

    return (
        <UserContext value={value}>{children}</UserContext>
    )

}

export {
    UserProvider,
    UserContext
}