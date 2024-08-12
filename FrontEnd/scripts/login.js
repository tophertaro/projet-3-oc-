document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // empêche la page de se rafraichir suite à l'event submit

  // RECUPERATION VALEUR DANS LES INPUT
  let email = document.getElementById('email').value;
  let pwd = document.getElementById('password').value;

  // FONCTION POUR MESSAGE D'ERREUR
  function errorMessage() {
    let errorMessageDiv = document.getElementById('login-error');
    errorMessageDiv.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
  }

  // FETCH API LOGIN
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: pwd })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      // Si l'authentification est réussie, stocker le token
      localStorage.setItem('token', data.token);
      // Rediriger vers la page d'accueil
      window.location.href = 'index.html'; // renvoi vers la page d'accueil
    } else {
      errorMessage();
    }
  })
  .catch(error => {
    console.error('Error:', error);
    errorMessage();
  });
});




