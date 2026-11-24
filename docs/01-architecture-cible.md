# Architecture cible du projet `mon-projet`

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

Date de rédaction : `<AAAA-MM-JJ>`

Ce document synthétise l'architecture cible décrite dans l'inventaire (`docs/00-inventaire-applications.md`) et dans les contrats (`docs/02` à `docs/05`). Il ne définit pas une nouvelle architecture et ne crée aucun artefact Docker.

## 1. Objectif de l'architecture cible

Dockeriser le projet progressivement, sans modifier le comportement métier des applications.

Objectifs types :

- supprimer la dépendance à Python et Node.js installés directement sur l'hôte ;
- préparer un déploiement Docker ;
- préparer l'exposition HTTP via le reverse proxy ;
- conserver les ports internes et les commandes de démarrage validés ;
- préserver les données métier existantes ;
- sortir les secrets du code et les stocker dans la plateforme de déploiement ;
- remplacer les chemins Windows et les URLs locales par des contrats Docker explicites.

## 2. Architecture initiale constatée

À renseigner à partir de l'inventaire : nombre d'applications, technologies, mode de lancement historique (poste du développeur, partage réseau, scripts manuels), dépendances partagées entre applications.

## 3. Architecture cible

### 3.1 Services applicatifs

| Application | Répertoire | Technologie | Service Docker | Port interne | Exposition |
| --- | --- | --- | --- | --- | --- |
| `<application>` (exemple) | `<répertoire>` | `<technologie>` | `<application>` | `<port>` | `/<chemin>` sous `<domaine>` |

### 3.2 Réseaux

- Réseau externe `proxy` : seuls les services exposés aux utilisateurs y sont attachés.
- Réseau interne du projet : communication entre services par noms Docker.
- Aucun port publié sur l'hôte en production.

### 3.3 Exposition utilisateur (reverse proxy)

Option A — domaine commun avec routage par chemin (option par défaut) :

- un seul domaine utilisateur : `<domaine>` ;
- règles `Host(`<domaine>`) && PathPrefix(`/<chemin>`)` vers `<service>:<port>` ;
- avantages : peu de DNS, surface exposée réduite, migration prudente ;
- inconvénients : dépend des liens existants, peut demander l'adaptation des URLs des frontends, impose de valider les routes réellement utilisées.

Option B — sous-domaines par service (exception, à justifier par écrit dans le contrat de l'application et à faire valider) :

- avantages : séparation claire, débogage simple ;
- inconvénients : plus de DNS, plus de labels du reverse proxy, plus de décisions de sécurité, risque de casser les URLs existantes.

Choix retenu pour `mon-projet` : `<A ou B>` ; justification : `<texte>`.

### 3.4 Communication entre services

Lister les URLs internes Docker, par exemple `http://<service>:<port>`. Aucune URL `localhost` entre services.

### 3.5 Persistance

La persistance couvre, selon le projet :

- bases de données (fichier ou serveur) ;
- fichiers téléversés ;
- fichiers de données (JSON, exports) ;
- index, configuration, caches à conserver ;
- équivalent Docker d'un éventuel partage réseau historique.

Le détail des volumes (chemins hôte, chemins conteneur, criticité) est défini dans `docs/03-contrat-volumes-persistance.md`. En local, les données sont sous `./.docker-data` ; en déploiement, sous `${VOLUME_ROOT}`.

## 4. Accès aux URL externes

Les liens ou accès vers des URL externes à la stack Docker ne sont pas des services de la stack et ne sont pas routés par le reverse proxy.

Distinguer deux cas :

- lien affiché dans l'application : le navigateur de l'utilisateur accède directement à l'URL, le conteneur n'a pas besoin d'accès sortant ;
- appel serveur sortant : le conteneur doit résoudre le DNS, sortir en HTTPS, utiliser un proxy sortant si nécessaire et disposer des certificats CA requis.

| URL externe | Usage | Type | Criticité | Statut validation | Commentaire |
| --- | --- | --- | --- | --- | --- |
| `<URL>` (exemple) | `<usage>` | lien navigateur / appel serveur | faible / moyenne / haute | à valider | URL externe à la stack |

## 5. Recommandation

Approche prudente :

- commencer par une architecture testable localement ;
- conserver les ports internes connus ;
- n'exposer par DNS que ce qui est nécessaire, le reste par chemins sous le domaine commun ;
- garder les autres services sur le réseau Docker interne ;
- ne jamais publier leurs ports sur l'hôte en production ;
- ne pas casser les liens existants ;
- documenter les adaptations nécessaires avant de modifier le code.

## 6. Risques structurants

À traiter avant Dockerfile ou avant déploiement :

- base de données partagée entre plusieurs applications ;
- dépendance à un lecteur ou partage Windows ;
- URLs `localhost` / `127.0.0.1` dans les frontends et les APIs ;
- routage par `PathPrefix` à valider avant la stack du reverse proxy ;
- secrets et mots de passe en dur ;
- scripts de démarrage incohérents (`package.json`, etc.) ;
- code chargé depuis un autre répertoire applicatif ;
- routes ou fonctions non portables sous Linux (ouverture de fichiers locaux, lancement de processus sur l'hôte) ;
- appels serveur sortants vers des URL externes : DNS, HTTPS, proxy, certificats CA.

## 7. Décisions à valider

- port de chaque service et traitement des collisions ;
- intégration des modules statiques ;
- routage par domaine commun et chemins ;
- absence de publication de port hôte en production ;
- stratégie de persistance ;
- stratégie de remplacement des chemins Windows ;
- stratégie pour toute base partagée ;
- stratégie d'URLs internes Docker ;
- secrets stockés dans la plateforme de déploiement ; Docker secrets ou autre mécanisme : options futures non retenues ;
- URL externes proposées par l'application : liens et appels serveur à valider.

## 8. Liens avec les autres documents

Ce document complète et synthétise :

- `docs/00-inventaire-applications.md`
- `docs/02-contrat-execution-docker.md`
- `docs/03-contrat-volumes-persistance.md`
- `docs/04-contrat-env-secrets.md`
- `docs/contracts/*.md`
- `docs/06-matrice-validation-contrats.md`
