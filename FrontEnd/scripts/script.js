// création d'un objet contenant 2 arrays vide pour stocker les données des API
export const data = { 
  works: [],
  categories: []
}

document.addEventListener('DOMContentLoaded', async function() {
  data.works = await fetchWorks();
  displayWorks(data.works,'gallery-js');
  fetchCategories();
});

// (1.1) FETCH API  

export async function fetchWorks() {

    try { //bloc try pour capturer et gérer les erreurs qui pourraient survenir dans le bloc de code try
      const response = await fetch('http://localhost:5678/api/works') // requête http vers l'url 

      if(!response.ok){ //si reponse pas ok = lancer une erreur
        throw new Error('Could not fetch works')
      } else { 
        const works = await response.json(); //si reponse ok = await attend que la reponse soit convertie en JSON qui sera stocké dans la const works
        return works;
      }
    }
      catch(error){ //ce bloc gère les erreurs survenue dans le bloc try
        console.error(error)
      }
}
// (1.2) FETCH CATEGORIES

export async function fetchCategories() {
  try {
    const response = await fetch ('http://localhost:5678/api/categories');

      if(!response.ok) {
        throw new Error('Could not fetch categories')
      } else {
        data.categories = await response.json()
        createFilters(data.categories); //appel à la fonction permettant la génération des boutons
      }
  }
  catch (error) {
    console.error(error);
  }
}

// (1.1) DISPLAY PROJETS ARCHITECTE

export function displayWorks(works) { 
  let gallery = document.getElementById('gallery-js'); 
  gallery.innerHTML =''; //supprime le contenu html dans la div gallery-js
  

  let galleryContent = ''; //la variable va contenir le code html pour chaque travail généré
  works.forEach(work => {
    galleryContent += 
    ` <figure>
        <img src="${work.imageUrl}" alt="${work.title}"
        <figcaption>${work.title}</figcaption>
      </figure>
    `;
  });
  gallery.innerHTML = galleryContent; //valeur de galleryContent inséré dans le HTML class gallery

  /* Méthode alternatif
  works.forEach(work => {
    const figure = document.createElement('figure')

    const img = document.createElement('img')
      img.src = work.imageUrl;
      img.alt = work.title;


    const figcaption = document.createElement('figcaption')
      figcaption.textContent = work.title


      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
});*/

}

// (1.2) CREATION BOUTONS FILTRE

function createFilters(categories) {

  // création du boutons 'Tous'
  let filters = document.getElementById('filters')
  let filtersBtn = '';
  filtersBtn += `<button data-category="all">Tous</button>`
  
 /* autre méthode pour ajouter bouton 'Tous'
  categories.unshift({
  id: 0,
  name: "Tous",
}); */

  categories.forEach(category => {
    filtersBtn += 
    ` <button data-category="${category.id}">
        ${category.name}
      </button>`;
      
  // display les boutons filtres
  filters.innerHTML = filtersBtn;
});



// AJOUT EVENT A CHAQUE BOUTON
document.querySelectorAll('#filters button').forEach(button => {
  button.addEventListener('click', (event) => {
    const categoryId = event.target.getAttribute('data-category'); // retourne l'id du bouton selectionne
    filterGallery(categoryId);
  });
});
}


function filterGallery(categoryId) {
  let filteredGallery = '';

    if (categoryId === 'all') {
      filteredGallery = data.works;
    } else {
      filteredGallery = data.works.filter(work => work.categoryId == categoryId);
    }
    displayWorks(filteredGallery);
}

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('token')) {
    document.querySelectorAll('.logged-in').forEach(element => {
      element.style.display = 'flex';
    });
    document.getElementById('filters').style.display = 'none';
    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerHTML = '<a href="#" id="logout-btn" style="text-decoration: none;">logout</a>';

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
        logout(); 
      });
    }
  }
});

function logout() {
  localStorage.removeItem('token'); // Supprime le jeton de localStorage
  window.location.href = 'index.html'; // Redirige vers la page logged-out
}
