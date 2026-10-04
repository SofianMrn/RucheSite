/* =========================================================
   La Ruche · configuration du site
   ---------------------------------------------------------
   Le formulaire de demande de démo est prêt, mais il n'est
   pas encore branché. Pour l'activer, renseignez UNE des
   options ci-dessous (voir le README à la racine du dépôt) :

   1. Web3Forms (gratuit, sans serveur) :
        formEndpoint: "https://api.web3forms.com/submit",
        web3formsKey: "votre-clé-d-accès",
   2. Formspree ou tout service qui accepte un POST JSON :
        formEndpoint: "https://formspree.io/f/xxxxxxx",
   3. À défaut, une adresse e-mail : le formulaire ouvre
      alors la messagerie du visiteur avec la demande pré-remplie.
        contactEmail: "contact@votre-domaine.fr",
   ========================================================= */
window.LA_RUCHE_CONFIG = {
  formEndpoint: "",
  web3formsKey: "",
  contactEmail: ""
};
