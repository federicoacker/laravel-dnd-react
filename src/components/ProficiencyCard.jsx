
import styles from "./ProficiencyCard.module.css"
function ProficiencyCard({name, description}) {
    return (
            <div className={styles.card}>
                <section className={styles.cardBody}>
                    <div className={styles.cardTitle}>{name}</div>
                </section>
                <div className={styles.cardInfo}>
                    <p>{description}</p>
                </div>
            </div>
    )
}

export default ProficiencyCard