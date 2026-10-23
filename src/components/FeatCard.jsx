import { Link } from "react-router"
import styles from "./FeatCard.module.css"
function FeatCard({ id, name}) {
    return (
        <Link to={`/feats/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name}</div>
                </section>
            </div>
        </Link>
    )
}

export default FeatCard