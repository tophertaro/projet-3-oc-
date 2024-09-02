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
    trash.addEventListener("click", function (event) { // ajout event à chaque trash
      

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


// Fonction pour ouvrir la modale
function openModal() {
  document.body.classList.add('modal-open'); // Empêche le défilement de la page lorsque la modale est ouverte
  modal.showModal();
  displayWorksInModal(data.works); // Affiche la galerie des travaux dans la modale
}

// Fonction pour fermer la modale
function closeModal() {
  document.body.classList.remove('modal-open'); // Réactive le défilement de la page lorsque la modale est fermée
  modal.close();
}

document.addEventListener("DOMContentLoaded", function () {
  // Créer la modale
  createModal();

  // Ouvre la modale lorsqu'on clique sur le bouton "Modifier"
  document.getElementById("edit-projects").onclick = openModal;

  // Ferme la modale avec la croix
  closeButton.onclick = closeModal;

  // Ferme la modale sur clic extérieur
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Ferme la modale avec le bouton "close-btn" dans le contenu de la modale
  document.getElementById('close-btn').addEventListener('click', closeModal);
});


// PASSAGE MODALE 2
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('add-photo').addEventListener('click', secondModal);
});

// Fonction pour créer le contenu de la modal 2 
function secondModalContent() {
  return `
    <div id="second-modal-header">
      <span id="arrow-return"><i class="fa-solid fa-arrow-left"></i></span>
      <span id="close-btn"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <form id="second-modal">
      <h3>Ajout photo</h3>
      <div id="form-content"> 
        <div id="img-upload">
          <label for="upload-img" class="upload-label">
          <i class="fa-regular fa-image"></i>
            <span>+ Ajouter photo</span>
          </label>
          <input type="file" id="upload-img" name="image" accept="image/*">
          <p>jpg, png : 4mo max</p>
        </div>
        <label for="work-title">Titre</label>
        <input type="text" id="work-title" name="title">
        <label for="work-category">Catégorie</label>
        <select id="work-category" name="category">
        </select>
      </div>
      <hr id="modal-barre">
      <div id="submit-add"> 
        <button type="button" id="submit-btn">Valider</button>
      </div>
    </form>
  `;
}


// Fonction pour configurer l'événement de changement de l'image
function setupImageUpload() {
  const imgInput = document.getElementById('upload-img');
  imgInput.addEventListener("change", function() {
    const file = imgInput.files[0];
    if (file.size > 4 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 4MB.");
      imgInput.value = null;
    } else {
      previewImage(file);
    }
  });
}

// Fonction pour gérer la soumission du formulaire
function formSubmission() {
  const titleInput = document.getElementById('work-title');
  const select = document.getElementById('work-category');
  const imgInput = document.getElementById('upload-img');

  document.getElementById('submit-btn').addEventListener('click', async function(event){
    event.preventDefault();
    // si l'un des champs n'est pas remplis
    if (!imgInput.files.length || !titleInput.value.trim || !select.value) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const formData = new FormData();
    formData.append('image', imgInput.files[0]);
    formData.append('title', titleInput.value.trim());
    formData.append('category', select.value);

    try {
      const token = localStorage.getItem('token'); // recupère le token
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du travail');
      }

      const newWork = await response.json(); // convertit la reponse en json
      data.works.push(newWork); // ajout travail à la liste
      displayWorks(data.works); // gallery maj sur page accueil
      displayWorksInModal(data.works); // maj dans la modale
      document.getElementById('second-modal').reset(); // form reinitialisé
      returnToFirstModal(); 
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de l\'ajout du travail.');
    }
  });
}

function secondModal() {
  let modalContent = document.getElementById("dialog-content");
  modalContent.innerHTML = secondModalContent();
  
  const select = document.getElementById('work-category');
  categoriesOptions(select);

  document.getElementById('close-btn').addEventListener('click', closeModal);

  document.getElementById('arrow-return').addEventListener('click', returnToFirstModal);


  setupImageUpload();
  checkFormChange();
  formSubmission();
}
  

// FONCTION VISUALISATION IMAGE DANS MODAL 2
function previewImage(file) {
  const preview = document.getElementById('img-upload');

  if (file.type.match("image.*")) { // vérifie si le fichier est une img
    const reader = new FileReader();

    reader.addEventListener("load", function (event) {
      preview.style.padding = '0'; // enlève le padding

      // remplace le contenu du conteneur par l'image
      preview.innerHTML = ''; // vide le conteneur
      const image = document.createElement('img');
      image.src = event.target.result;
      preview.appendChild(image); // ajoute l'image au conteneur
    });

    reader.readAsDataURL(file); // lit le contenu sous forme d'url de données
  }
}

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

function returnToFirstModal() {
  let modalContent = document.getElementById("dialog-content");
  modalContent.innerHTML = ''; // vide contenu de la seconde modale

  // Code pour recharger la première modale
  modalContent.innerHTML = `
    <span id="close-btn"><i class="fa-solid fa-xmark"></i></span>
    <h3>Galerie photo</h3>
    <div id="gallery-modal"></div>
    <hr id="modal-barre">
    <input type="submit" id="add-photo" value="Ajouter une photo">
  `;

  document.getElementById('close-btn').addEventListener('click', function() {
    document.body.classList.remove('modal-open'); 
    modal.close(); 
  });

  document.getElementById('add-photo').addEventListener('click', secondModal);

  // Affiche la galerie
  displayWorksInModal(data.works);
}

function checkFormChange() {
  const imgInput = document.getElementById('upload-img');
  const titleInput = document.getElementById('work-title');
  const select = document.getElementById('work-category');
  const submitButton = document.getElementById('submit-btn');

  // Surveille les changements dans les champs du formulaire
  imgInput.addEventListener('change', checkFormFields); // changement si fichier est select ou modifié
  titleInput.addEventListener('input', checkFormFields);
  select.addEventListener('change', checkFormFields); // changement lorsque une nouvelle catégorie est selectionné 

  function checkFormFields() {
    if (imgInput.files.length > 0 && titleInput.value.trim() !== '' && select.value !== '') {
      submitButton.style.backgroundColor = '1D6154'; // Change la couleur de fond du bouton en vert
      submitButton.style.color = 'white'; // Change la couleur du texte en blanc pour un meilleur contraste
    } else {
      submitButton.style.backgroundColor = ''; // Réinitialise la couleur de fond (revient à la couleur par défaut)
      submitButton.style.color = ''; // Réinitialise la couleur du texte
    }
  }
}


