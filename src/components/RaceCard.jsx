import { Link } from "react-router"
import styles from "./RaceCard.module.css"
function RaceCard({ id, name, features, image }) {
    return (
        <Link to={`/races/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name}</div>
                    {image ?
                        <div className={styles.cardImgWrapper}>
                            <img src={image} alt={`Immagine ${name}`} />
                        </div>
                        :
                        <div className={styles.cardImgWrapper}>
                            <img src="./placeholder.svg" alt={`Immagine Placeholder`} />
                        </div>
                    }
                </section>
                <div className={styles.cardInfo}>
                    <div className={styles.cardTitle}>Features</div>
                    <ul>
                        {features.map(feature => <li key={`feature-${feature.id}`}>{feature.name}</li>)}
                    </ul>
                </div>
            </div>
        </Link>
    )
}

export default RaceCard