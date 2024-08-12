import { data, displayWorks, fetchCategories } from "./script.js";

let modal = "";
let closeButton = "";
let addPhoto = "";

// PARTIE MODAL

function createModal() {
  // Création de la balise <dialog>
  modal = document.createElement("dialog");
  modal.id = "modal";

  // Création de la div pour le contenu de la modale
  const modalContent = document.createElement("div");
  modalContent.id = "dialog-content";

  // Création du bouton pour fermer la modale
  closeButton = document.createElement("span");
  closeButton.id = "close-btn";
  closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  // Création du titre de la modale
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = "Galerie photo";

  // Création de la div pour les travaux
  const galleryModal = document.createElement("div");
  galleryModal.id = "gallery-modal";

  // Barre de séparation
  const barreModal = document.createElement("hr"); 
  barreModal.id = "modal-barre"; 

  // Création du bouton 'ajouter une photo'
  addPhoto = document.createElement("input");
  addPhoto.id = "add-photo";
  addPhoto.type = "submit";
  addPhoto.value = "Ajouter une photo";

  // Ajout de tous les éléments dans le contenu de la modale
  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(galleryModal);
  modalContent.appendChild(barreModal); 
  modalContent.appendChild(addPhoto);

  // Ajout du contenu de la modale dans l'élément <dialog>
  modal.appendChild(modalContent);
  
  // Ajout de la modale dans le corps du document
  document.body.appendChild(modal);
}

async function displayWorksInModal(works) {
  let gallery = document.getElementById("gallery-modal");
  gallery.innerHTML = ""; //supprime le contenu html dans la div gallery-js

  let galleryContent = ""; //la variable va contenir le code html pour chaque travail généré
  works.forEach((work) => {
    galleryContent += `<div id= 'gallery-content'>
            <span><i class="fa-solid fa-trash-can" data-id="${work.id}"></i></span>
            <img src="${work.imageUrl}" alt="${work.title}" />
          </div>
          `;
  });

  gallery.innerHTML = galleryContent; //valeur de galleryContent inséré dans le HTML class gallery
  // On ajoute les évènements de suppression.
  deleteWorks();
}

function deleteWorks() {
  const trashes = document.querySelectorAll(".fa-trash-can");
  trashes.forEach((trash) => {
    trash.addEventListener("click", function (event) {
      

      const id = event.target.dataset.id; // récupère l'ID depuis le dataset
      const token = localStorage.getItem('token'); // récupère le token de localStorage

      // Appel API pour supprimer les travaux
      fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // token autorisation
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete the work');
        }
        return response.json();
      })
      .then(() => {
        const deletion = event.target.closest("div"); 
        if (deletion) {
          deletion.remove(); // supprime l'élément du DOM
        }
        data.works = data.works.filter((work) => work.id !== Number(id)); // met à jour le modèle de données
      })
      .catch(error => console.error('Error:', error));
    });
  });
}
// OUVERTURE & FERMETURE MODAL

document.addEventListener("DOMContentLoaded", function () {
  createModal();

  // Ouverture de la modale lorsqu'on clique sur le bouton "Modifier"
  document.getElementById("edit-projects").onclick = function () {
    modal.showModal();
    // On affiche la galerie.
    displayWorksInModal(data.works);
  };
  // fermeture de la modale
  closeButton.onclick = () => modal.close();
});