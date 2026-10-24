import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useCharacter from "../hooks/useCharacter";
import styles from "./Character.module.css"
import CharacterShow from "../components/CharacterShow";
import useUser from "../hooks/useUser";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

function Character() {
  let { id } = useParams();
  const { user } = useUser();
  const { character, error, pending } = useCharacter(id);
  const [deleteError, setDeleteError] = useState("");
  const [deletePending, setDeletePending] = useState(false);
  const navigate = useNavigate();



  const deleteCharacter = () => {
    setDeleteError("");
    setDeletePending(true);

    const options = {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${user.token}`
      }
    }
    fetch(`${import.meta.env.VITE_API_URL}/characters/${character.id}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
      })
      .catch(error => {
        console.error(error.message);
        if (error.message === "401" || error.message === "403") {
          setDeleteError("You don't have permission to delete this character.");
        } else if (error.message === "404") {
          setDeleteError("This character could not be found. It may already have been deleted.");
        } else {
          setDeleteError("The character could not be deleted. Please try again.");
        }
      })
      .finally(() => {
        const modalElement = document.getElementById("deleteModal");
        const modal = Modal.getInstance(modalElement);

        modalElement.addEventListener(
          "hidden.bs.modal",
          () => navigate("/characters"),
          { once: true }
        );
        setDeletePending(false);
        modal.hide();
      })

  }

  return (
    <>
      <div className={styles.card}>
        {!error ?
          pending ? "Loading Character" :
            <CharacterShow {...character} />
          : error.toString()}
      </div>
      <div className="modal fade" id="deleteModal" tabIndex={-1} data-bs-theme="dark">
        <div className={`modal-dialog ${styles.deleteModal}`}>
          <div className={styles.modalContent}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Delete Character</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-danger">
              Are you sure you want to delete {character.name}?
              {deleteError && <div className={styles.deleteError} role="alert">{deleteError}</div>}
            </div>
            <div className="modal-footer d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">No</button>
              <button type="button" className="btn btn-outline-danger" onClick={deleteCharacter} disabled={deletePending}>
                {deletePending ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Character