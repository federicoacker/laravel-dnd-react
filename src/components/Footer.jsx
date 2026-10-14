import styles from "./Footer.module.css";
import resources from "../utils/data/outside_resources";

function Footer() {

    return (
        <footer className={`py-3 mt-auto ${styles.footer}`}>
            <div className="px-4 d-flex">
                <h3 className="text-white">Character Forge &trade;</h3>
                <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                    <div className="d-none d-lg-block">
                        {resources && resources.length > 0 &&
                            <div>
                                <h3 className="text-white text-center">Outside Resources</h3>
                                <ul className="d-flex flex-column flex-lg-row gap-4 p-0">
                                    {
                                        resources.map(
                                            (resource) =>
                                                <a
                                                    key={resource.name}
                                                    className={`${styles.footerLink}`}
                                                    target="_blank"
                                                    href={resource.href}
                                                >
                                                    {resource.name}
                                                </a>)
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
