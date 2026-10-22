import { Link, NavLink } from 'react-router';
import styles from './Header.module.css';
import useUser from '../hooks/useUser';

function Header() {
    const {user, logout} = useUser();

    return (
        <header className={`${styles.header}`}>
            <nav className={`navbar navbar-expand-lg ${styles.navbar}`} data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/"><img src="/character-forge.png" alt="Icona Character Forge" className={styles.logo} /></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                                } aria-current="page" to="./">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                                } aria-current="page" to="/characters">Characters</NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                                } aria-current="page" to="/backgrounds">Backgrounds</NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                                } aria-current="page" to="/classes">Classes</NavLink>
                            </li>
                            <li><NavLink className={({ isActive, isPending }) =>
                                isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                            } aria-current="page" to="/races">Races</NavLink>
                            </li>
                            <li><NavLink className={({ isActive, isPending }) =>
                                isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                            } aria-current="page" to="/features">Features</NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                                } aria-current="page" to="/feats">Feats</NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                                } aria-current="page" to="/proficiencies">Proficiencies</NavLink>
                            </li>
                            <li>
                                <NavLink className={({ isActive, isPending }) =>
                                    isPending ? `${styles.navLink} ${styles.pending}` : isActive ? `${styles.navLink} ${styles.active}` : `${styles.navLink}`
                                } aria-current="page" to="/spells">Spells</NavLink>
                            </li>
                        </ul>
                        {user?.token ? 
                        <div className="d-flex flex-column flex-lg-row gap-2">
                            <Link className={`btn ${styles.actionBtn}`} to="/profile">{user.name}</Link>
                            <button className={`btn ${styles.actionBtn}`} onClick={logout}>Logout</button>
                        </div>
                        :
                        <div className="d-flex flex-column flex-lg-row gap-2">
                            <Link className={`btn ${styles.actionBtn}`} to="/login">Login</Link>
                            <Link className={`btn ${styles.actionBtn}`} to="/register">Register</Link>
                        </div>
                        }
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
