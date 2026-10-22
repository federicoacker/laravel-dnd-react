import { Link } from "react-router"
import styles from "./SpellCard.module.css"

function SpellCard({ id, name, level, casting_time, range, components, duration }) {
    return (
        <Link to={`/spells/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>

            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name}</div>
                    <div className={styles.cardInfo}>
                        <h6>Level: {level}</h6>
                        <h6>Casting Time: {casting_time}</h6>
                        <h6>Range: {range}</h6>
                        <h6>Components: {components}</h6>
                        <h6>Duration: {duration}</h6>
                    </div>
                </section>
            </div>
        </Link>
    )
}

export default SpellCard