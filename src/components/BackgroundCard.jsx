import { Link } from "react-router"
import styles from "./BackgroundCard.module.css"
function BackgroundCard({ id, name, feat, ability_scores, equipment, description }) {
    return (
        <Link to={`/backgrounds/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name}</div>
                    <hr/>
                    <p className="px-4">{description}</p>
                </section>
                <hr/>
                <div className={styles.cardInfo}>
                    <div className={styles.cardTitle}>Feat</div>
                    <ul>
                        <li>{feat.name}</li>
                    </ul>
                    <div className={styles.cardTitle}>Equipment</div>
                    <p className="px-2">{equipment}</p>
                    <div className={styles.cardTitle}>Ability Scores</div>
                    <p className="px-2">{ability_scores}</p>
                </div>
            </div>
        </Link>
    )
}

export default BackgroundCard