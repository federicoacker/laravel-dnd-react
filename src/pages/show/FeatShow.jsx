import { useParams } from "react-router"
import styles from "./FeatShow.module.css";
import FeatureShowCard from "../../components/FeatureShowCard";
import useFeat from "../../hooks/useFeat";

function FeatShow() {
    const params = useParams();
    const { feat, featError, featPending } = useFeat(params.id);
    return (
        <div className={styles.card}>
            {featPending ? "Loading Feat" : !featError ?
                <div>
                    <FeatureShowCard {...feat}/>
                </div>
                : featError
            }
        </div>
    )
}

export default FeatShow