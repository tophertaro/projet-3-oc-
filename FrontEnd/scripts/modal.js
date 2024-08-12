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