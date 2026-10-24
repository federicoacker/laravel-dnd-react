import { useParams } from "react-router"
import styles from "./FeatureShow.module.css";
import FeatureShowCard from "../../components/FeatureShowCard";
import useFeature from "../../hooks/useFeature";

function FeatureShow() {
    const params = useParams();
    const { feature, featureError, featurePending } = useFeature(params.id);
    return (
        <div className={styles.card}>
            {featurePending ? "Loading Feature" : !featureError ?
                <div>
                    <FeatureShowCard {...feature}/>
                </div>
                : featureError
            }
        </div>
    )
}

export default FeatureShow