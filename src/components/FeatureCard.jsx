import { Link } from "react-router"
import styles from "./FeatureCard.module.css"
function FeatureCard({ id, name}) {
    return (
        <Link to={`/features/${id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name}</div>
                </section>
            </div>
        </Link>
    )
}

export default FeatureCard