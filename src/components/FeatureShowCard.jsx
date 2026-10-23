
import styles from './FeatureShowCard.module.css';
function FeatureShowCard({name, description}) {
  return (
    <div className={styles.feature}>
      <h6>{name}</h6>
      <p dangerouslySetInnerHTML={{__html: description}}></p>
    </div>
  )
}

export default FeatureShowCard