
import CharactersCard from '../components/CharactersCard';
import useCharacters from '../hooks/useCharacters';
import useUser from '../hooks/useUser';

function Characters() {
    const { user } = useUser();
    const { error, characters, pending } = useCharacters();
    const pubCharacters = characters.filter(character => character.is_public);
    const priCharacters = characters.filter(character => !character.is_public);

    return (
        <div className="my-4">
            {user.role !== "guest" &&
                <div>
                    <h2 className="text-white text-center">{user.role === "admin" ? "Personaggi Privati" : "I tuoi Personaggi"} </h2>
                    {
                        error ? <div>{error}</div> : !pending ?
                            <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                                {priCharacters.map(character => <div key={character.id} className="col"><CharactersCard {...character} /></div>)}
                            </div>
                            :
                            "Stiamo caricando i personaggi"
                    }
                    <hr />
                </div>
            }
            <h2 className="text-white text-center">Personaggi Pubblici</h2>
            {
                error ? <div>{error}</div> : !pending ?
                    <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
                        {pubCharacters.map(character => <div key={character.id} className="col"><CharactersCard {...character} /></div>)}
                    </div>
                    :
                    "Stiamo caricando i personaggi"
            }
        </div>
    )
}

export default Characters