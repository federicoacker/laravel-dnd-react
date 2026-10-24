
import styles from "./ProficiencyCard.module.css"
function ProficiencyCard({name, description, type, ability_score}) {
    return (
            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name} ({type}) {ability_score!=="" ? `(${ability_score})` : ""}</div>
                </section>
                <div className={styles.cardInfo}>
                    <p>{description}</p>
                </div>
            </div>
    )
}

export default ProficiencyCard