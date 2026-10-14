import styles from "./Footer.module.css";

function Footer() {
    return (
        <footer className={`py-3 mt-auto ${styles.footer}`}>

            <div className="px-4 d-flex">
                <h3 className="text-white">Character Forge &trade;</h3>
                <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                    <div className="d-none d-lg-block">
                        <h3 className="text-white">Outside Resources</h3>
                        <ul className="d-flex flex-column flex-lg-row gap-4 p-0">
                            <a className={`${styles.footerLink}`} target="_blank" href="https://5e.tools/races.html">Species</a>
                            <a className={`${styles.footerLink}`} target="_blank" href="https://5e.tools/classes.html">Classes</a>
                            <a className={`${styles.footerLink}`} target="_blank" href="https://5e.tools/feats.html">Feats</a>
                            <a className={`${styles.footerLink}`} target="_blank" href="https://5e.tools/optionalfeatures.html">Features</a>
                            <a className={`${styles.footerLink}`} target="_blank" href="https://5e.tools/backgrounds.html">Backgrounds</a>
                            <a className={`${styles.footerLink}`} target="_blank" href="https://5e.tools/items.html">Items</a>
                            <a className={`${styles.footerLink}`} target="_blank" href="https://5e.tools/spells.html">Spells</a>

                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
