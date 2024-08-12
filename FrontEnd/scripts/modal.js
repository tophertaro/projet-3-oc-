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

//MODAL 2

function secondModal() {
  let modalContent = document.getElementById("dialog-content");
  modalContent.innerHTML = ''; // vide contenu modal 1


  modalContent.innerHTML = `
    <span id="arrow-return"><i class="fa-solid fa-arrow-left"></i></span>
    <span id="close-btn"><i class="fa-solid fa-xmark"></i></span>
    <form id="second-modal">
      <h3>Ajout photo</h3>
      <div id="form-content"> 
        <input type="file" id="upload-img" name="image">
        <label>Titre<input type="text" id="work-title" name="title"></label>
        <label>Catégorie
          <select id="work-category" name="category">
          </select>
        </label>
      </div>
      <button type="button" id="submit-add">Valider</button>
    </form>
  `;
 
  const select = document.getElementById('work-category');
  categoriesOptions(select);

  document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('dialog-content').parentElement.close(); 
  });
}





document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('add-photo').addEventListener('click', secondModal);
});

/* METHODE AVEC APPENCHILD
function secondModal() {
  let modalContent = document.getElementById("dialog-content");
  modalContent.innerHTML = ''; // vide contenu modal 1

  // création éléments modal 2
  const form = document.createElement('form');
  form.id = 'modal-form';

  // Création du bouton pour fermer la modale
  const arrowReturn = document.createElement("span");
  arrowReturn.id = "arrow";
  arrowReturn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

  const addPhotoTitle = document.createElement('h3');
  addPhotoTitle.textContent = 'Ajout photo';

  const addImg = document.createElement('input');
  addImg.type = 'file';
  addImg.name = 'image'; 
  addImg.id = 'upload-img';

  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Titre';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.name = 'title';
  titleInput.id = 'work-title';

  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Catégorie';
  const categorySelect = document.createElement('select');
  categorySelect.name = 'category';
  categorySelect.id = 'work-category';

  const validateBtn = document.createElement('button');
  validateBtn.type = 'button'; 
  validateBtn.textContent = 'Valider';
  validateBtn.id = 'submit-add';
  

  // ajout des éléments à la modal
  modalContent.appendChild(arrowReturn);
  modalContent.appendChild(closeButton);
  form.appendChild(addPhotoTitle);
  form.appendChild(addImg);
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(categoryLabel);
  form.appendChild(categorySelect);
  form.appendChild(validateBtn);
  modalContent.appendChild(form);
} */

function categoriesOptions(selectElement) {
  // Ajoute l'option "Tous"
  const categoryAll = document.createElement('option');
  categoryAll.value = 'all';
  categoryAll.textContent = 'Tous';
  selectElement.appendChild(categoryAll);

  // Ajoute toutes les catégories obtenues via l'API
  data.categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectElement.appendChild(option);
  });
}