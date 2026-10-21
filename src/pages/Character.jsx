import { useParams } from "react-router";
import useCharacter from "../hooks/useCharacter";
import styles from "./Character.module.css"
import CharacterShow from "../components/CharacterShow";

function Character() {
    let {id} = useParams();
    const {character, error, pending} = useCharacter(id);
    console.log(error);
  return (
    <div className={styles.card}>
        {!error ? 
        pending ? "Loading Character" : 
        <CharacterShow {...character}/>
        : error.toString()}
    </div>
  )
}

export default Character