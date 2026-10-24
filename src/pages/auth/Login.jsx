import { useState } from "react";
import styles from "./Login.module.css"
import useUser from "../../hooks/useUser";
function Login() {


    const {error, user, login} = useUser();

    const [submitData, setSubmitData] = useState({
        email: `${user && !error ? user.email : ""}`,
        password: ""
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setSubmitData({
            ...submitData,
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        login(submitData);
    }

    return (
        <div className="container">
            <form className={`form-control ${styles.card}`} method="POST" onSubmit={handleSubmit} data-bs-theme="dark">
                <label className="form-label" htmlFor="email">Email</label>
                <input onChange={handleChange} required className="form-control" type="text" name="email" id="email" placeholder="email@gmail.com" value={submitData.email}></input>
                <label className="form-label" htmlFor="password">Password</label>
                <input onChange={handleChange} required className="form-control" type="password" name="password" id="password" placeholder="password"></input>
                <button type="submit" className={`btn ${styles.submit}`}>Login</button>
                {
                    error &&
                    <div className={styles.error}>{error}</div>
                }
            </form>
        </div>
    )
}

export default Login;