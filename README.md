# La Ruche by InovElite · site vitrine

Site vitrine du SaaS **La Ruche** : « Vendez l'audiovisuel comme un expert. »
HTML, CSS et JavaScript, sans framework ni étape de build. Hébergé sur GitHub Pages depuis le dossier `docs/`.

## Ce que contient le dépôt

| Chemin | Rôle |
|---|---|
| `docs/index.html` | La page d'accueil (toutes les sections) |
| `docs/mentions-legales.html`, `docs/confidentialite.html` | Pages légales (à compléter, voir plus bas) |
| `docs/404.html` | Page d'erreur, autonome |
| `docs/assets/css/site.css` | Styles |
| `docs/assets/js/hive.js` | La ruche animée du haut de page (canvas) |
| `docs/assets/js/main.js` | Interactions : démonstration, faisceaux, compteurs, vidéo, formulaire |
| `docs/assets/js/config.js` | **Réglages du formulaire de démo** |
| `docs/assets/media/` | Vidéos web (1080p et 720p) et sous-titres `.vtt` |
| `docs/assets/img/` | Visuels extraits du film de lancement, icônes SVG |
| `docs/assets/fonts/` | Polices Poppins et Inter, hébergées sur le site (licence SIL OFL) |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Notes produit et système de design (non publiés) |

Seul le dossier `docs/` est publié. Attention : le dépôt est **public**, donc tout ce qui s'y trouve est lisible sur GitHub.

## Voir le site en local

Depuis la racine du dépôt :

```bash
py -m http.server 8080 --directory docs
```

Puis ouvrez <http://localhost:8080>. Passez par un serveur local plutôt que d'ouvrir le fichier directement : les icônes et les sous-titres en ont besoin.

## Mettre en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**.
2. *Source* : **Deploy from a branch**. *Branch* : `main`, dossier **`/docs`**. Enregistrez.
3. Après une à deux minutes, le site est en ligne à l'adresse <https://sofianmrn.github.io/RucheSite/>.

### Avec un nom de domaine (par exemple `laruche.fr`)

1. Dans **Settings → Pages → Custom domain**, saisissez le domaine (GitHub crée le fichier `docs/CNAME`).
2. Chez votre registrar, faites pointer le domaine vers GitHub Pages ([documentation](https://docs.github.com/fr/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. Remplacez `https://sofianmrn.github.io/RucheSite/` par votre domaine dans `docs/index.html` (balises `canonical`, `og:url`, `og:image` et JSON-LD), dans `docs/sitemap.xml`, dans `docs/robots.txt` et dans les `canonical` des pages légales.

## Brancher le formulaire de démo

Le formulaire est complet (validation, messages d'erreur, anti-spam) mais **n'envoie rien tant qu'il n'est pas branché**. Il affiche alors un message honnête au visiteur. Pour l'activer, modifiez `docs/assets/js/config.js`.

**Option recommandée, Web3Forms (gratuit, sans serveur) :**
1. Allez sur <https://web3forms.com>, saisissez l'adresse qui doit recevoir les demandes et récupérez la clé d'accès envoyée par e-mail.
2. Dans `config.js` :
   ```js
   formEndpoint: "https://api.web3forms.com/submit",
   web3formsKey: "VOTRE-CLÉ",
   contactEmail: "contact@votre-domaine.fr"
   ```
3. Envoyez une demande de test depuis le site.

**Autres possibilités** : un endpoint Formspree (`formEndpoint: "https://formspree.io/f/xxxx"`), ou seulement `contactEmail`. Dans ce dernier cas, le formulaire ouvre la messagerie du visiteur avec la demande pré-remplie.

Pensez ensuite à indiquer le nom du service retenu dans `confidentialite.html` (section « Destinataires »).

Après chaque modification des fichiers CSS ou JS, augmentez le numéro `?v=1` dans `index.html` pour que les visiteurs reçoivent la nouvelle version.

## À compléter avant la mise en ligne

- [ ] **Mentions légales** (`docs/mentions-legales.html`) : forme juridique, capital, adresse, RCS/SIREN, TVA, téléphone, e-mail, directeur de la publication. Ces champs sont surlignés en rouge sur la page.
- [ ] **Confidentialité** (`docs/confidentialite.html`) : adresse, e-mail de contact RGPD, service d'envoi du formulaire.
- [ ] **Formulaire** : `docs/assets/js/config.js` (voir ci-dessus).
- [ ] **À valider sur le fond** :
  - la signature « Un projet porté par Lamia et Nathalie, pour InovElite » (section InovElite) ;
  - les chiffres de marché (+12 %/an, « la plupart des entreprises mal équipées ») présentés comme estimations InovElite ;
  - la feuille de route 2026-2029.

## Ce qui est volontairement absent

- **Aucun prix** : les offres sont présentées sans tarifs, communiqués pendant la démo.
- **Aucun nom de marque** (fabricant, grossiste, éditeur).
- **Aucun client, témoignage ou chiffre d'usage inventé.** Le produit est en pré-lancement et les données des démonstrations sont fictives et signalées comme telles.
- **Aucun cookie, traceur ni appel à un service tiers.** Polices et vidéos sont hébergées sur le site, donc pas besoin de bandeau cookies.

Si vous ajoutez un outil de mesure d'audience, vérifiez s'il exige un bandeau de consentement (CNIL) et mettez à jour la page Confidentialité.
