import { useState } from "react"
import CharactersCard from "./CharactersCard"
import styles from "./ProfileCard.module.css"
function ProfileCard({ name, email, characters, handleSubmit, handleEdit, message, isSubmitting, logout }) {
    const [passwordEditToggle, setPasswordEditToggle] = useState(false);
    return (
        <div>
            <div className="d-flex gap-2 justify-content-end">
                <button className={`btn ${styles.actionBtn}`} onClick={()=>setPasswordEditToggle(current => !current)}>Change Password</button>
                <button className={`btn ${styles.actionBtn}` } onClick={logout}>Logout</button>
            </div>
            <h1 className="text-center">{name}</h1>
            <h6 className="text-center">{email}</h6>
            <div className={passwordEditToggle ? "d-block" : "d-none"}>
                <form className="form-control" data-bs-theme="dark" onSubmit={handleSubmit}>
                    <label className="form-label" htmlFor="current_password">Current Password</label>
                    <input onChange={handleEdit} className="form-control" type="password" name="current_password" id="current_password"></input>
                    <label className="form-label" htmlFor="password">New Password</label>
                    <input onChange={handleEdit} className="form-control" type="password" name="password" id="password"></input>
                    <label className="form-label" htmlFor="password_confirmation">Confirm New Password</label>
                    <input onChange={handleEdit} className="form-control" type="password" name="password_confirmation" id="password_confirmation"></input>
                    <button disabled={isSubmitting} className={`d-block mx-auto my-2 btn ${styles.actionBtn}`} type="submit">
                        {isSubmitting ? "Updating Password..." : "Update Password"}
                    </button>
                    {message && <p role="status">{message}</p>}
                </form>
            </div>
            {characters.length>0 &&
                <div >
                    <hr />
                    <h2 className="text-center">Your Characters</h2>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">

                        {characters?.map(character =>
                            <div key={`character-${character?.id}`} className="col">
                                <CharactersCard {...character} />
                            </div>)}
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfileCard