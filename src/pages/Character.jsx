import { useParams } from "react-router";
import useCharacter from "../hooks/useCharacter";
import styles from "./Character.module.css"
import CharacterShow from "../components/CharacterShow";

function Character() {
    let {id} = useParams();
    const {character, error, pending} = useCharacter(id);
  return (
    <div className={styles.card}>
        {!error ? 
        pending ? "Sto Caricando il Personaggio" : 
        <CharacterShow {...character}/>
        : {error}}
    </div>
  )
}

export default Character