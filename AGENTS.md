# AGENTS.md

> Modèle générique pour un nouveau projet. À copier à la racine du projet, puis à adapter : remplacer chaque `<paramètre>` et lever chaque `<à renseigner>`. Seule source des règles pour l'assistant ; `CLAUDE.md` n'en est que le lanceur.

## Rôle de l'assistant

L'assistant est un assistant technique du projet `mon-projet`. Il aide à analyser, documenter, tester, dockeriser et livrer le projet, sans modifier le comportement métier existant sans demande explicite.

## Règles strictes

- Partir de la documentation existante du projet (`docs/`) avant toute action.
- Documenter avant de modifier.
- Faire valider les contrats techniques avant implémentation : ports, variables d'environnement, volumes, chemins, URLs internes, secrets, exposition HTTP.
- Ne pas modifier le code applicatif sans demande explicite.
- Préserver le comportement métier existant.
- Tenir compte des répertoires avec espaces et accents.
- Privilégier les changements incrémentaux, traçables et réversibles.
- Séparer clairement analyse, documentation, configuration Docker et modification applicative.
- Mettre au point les tests avant le code (voir « Méthode de travail »).

## Interdictions

- Ne pas créer de Dockerfile tant que les décisions de contrat ne sont pas validées.
- Ne pas créer de `docker-compose.yml` de déploiement tant que les contrats ne sont pas validés.
- Ne pas renommer ni déplacer les répertoires ou fichiers applicatifs sans demande explicite validée.
- Ne pas refactorer le code métier sans demande explicite.
- Ne pas remplacer des chemins, URLs ou secrets directement dans le code sans validation préalable.
- Ne pas supposer que Python ou Node.js sont installés sur l'hôte de production.
- Ne pas publier les ports applicatifs directement sur l'hôte en production.
- Ne pas confondre les URL externes affichées par une application avec les services Docker internes de la stack.
- Ne jamais committer de secret, de fichier `.env` réel, de base de données ni de données de recette ou de production.
- Ne jamais afficher, journaliser ni copier un jeton ou une clé API.
- Ne pas ajouter de CORS applicatif sans décision validée ; ne jamais le remplacer par `origin: "*"`. Un besoin cross-origin validé se traite au niveau du reverse proxy.

## Méthode de travail

1. Lire ou mettre à jour la documentation de contexte avant toute action structurante.
2. Identifier les fichiers réellement utilisés par l'application.
3. Vérifier dans le code les ports, dépendances, stockages et variables d'environnement.
4. Lister les chemins absolus Windows, les secrets en dur et les URLs `localhost` / `127.0.0.1`.
5. Proposer les contrats Docker attendus (gabarit : `docs/contracts/template-contrat-application.md`).
6. Faire valider ces contrats.
7. Écrire un test qui échoue avant de développer, puis faire passer le test.
8. Créer ensuite seulement le Dockerfile et le compose.

## Ordre des étapes

1. Cadrage documentaire (contrat d'application).
2. Validation des contrats d'exécution.
3. Définition des volumes et des secrets.
4. Définition des routes et des noms de services Docker.
5. Développement avec tests.
6. Dockerfile, puis `docker-compose.local.yml`.
7. Tests locaux.
8. Publication d'une version (tag), puis déploiement.

## Branches et versions

- Ne supprimer une branche qu'après confirmation qu'elle est fusionnée ou archivée en tag `archive/*`.
- `main` n'est mis à jour que par fusion d'une branche relue. Aucun push direct sur `main`, sauf le tout premier commit d'un projet vide.
- L'assistant ne fusionne jamais le code : le merge dans `main` est une action de l'utilisateur.
- Un tag de version est annoté et s'écrit `vX.Y.Z`, sans préfixe : X pour une rupture, Y pour une fonctionnalité, Z pour une correction. Poser un tag est une action de l'utilisateur ; l'assistant ne le fait que sur demande explicite.
- Retirer les worktrees dès la tâche terminée.

## Règles Docker

- Un service ne possède qu'un seul Dockerfile, commun au build local, à la CI et aux images déployées.
- Chaque service se construit et se teste localement avec `docker-compose.local.yml` et un `.env` dérivé de `.env.example`.
- Chaque application peut aussi démarrer hors Docker, pour le débogage avec VS Code (interpréteur natif Python ou Node.js).
- Une route `/health` répond `200` quand le service est prêt ; elle sert de contrôle de santé.
- Chaque service déclare `restart: unless-stopped`.
- Les données persistantes locales vivent exclusivement sous `./.docker-data`, jamais versionné.
- Les secrets, sessions, bases de données, uploads et données de recette ou de production ne sont jamais dans Git, dans `.env.example` ni dans une image.
- Les chemins de partages réseau d'un poste (par exemple `Z:\…`) sont remplacés par des volumes, des montages ou des variables d'environnement validés.

## Exposition HTTP

- Ne pas exposer les ports internes hors du réseau Docker.
- Prévoir des noms de services Docker stables pour remplacer les URLs `localhost` / `127.0.0.1`.
- Les appels frontend sont relatifs et same-origin.
- Ne pas casser les URLs métier existantes sans décision validée.

## Points à faire valider avant implémentation

- Port d'exécution de l'application : `<à renseigner>`.
- Stratégie de volume pour les données persistantes (bases, uploads, exports) : `<à renseigner>`.
- Stockage des secrets détectés dans le code : `<à renseigner>`.
- Remplacement des URLs `localhost` / `127.0.0.1` par des variables ou des URLs internes Docker : `<à renseigner>`.
- Exposition HTTP (domaine, chemin) : `<à renseigner>`.
- URL externes affichées ou appelées par l'application : `<à renseigner>`.
