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