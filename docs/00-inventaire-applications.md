# Inventaire des applications du projet `mon-projet`

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

Date d'inventaire : `<AAAA-MM-JJ>`

Périmètre analysé : les répertoires applicatifs présents à la racine du projet `mon-projet`. L'inventaire ne modifie aucune application et ne crée ni Dockerfile ni `docker-compose`. Il sert de point de départ à tout le cadrage : on le lit et on le met à jour avant toute action structurante.

## 1. Commandes d'analyse à effectuer

- Lister les répertoires applicatifs de la racine.
- Rechercher les `package.json` et `package-lock.json`.
- Rechercher les `requirements*.txt` et les `pyproject.toml`.
- Rechercher les fichiers de démarrage Python et Node (`server*.py`, `main.py`, `server*.js`, `index.js`).
- Rechercher les ports codés en dur ou lus depuis l'environnement.
- Rechercher les références `process.env` et `os.environ`.
- Rechercher les chemins absolus Windows (`C:\`, `D:\`, lecteurs réseau, variantes `X:/`).
- Rechercher les dossiers de stockage (`uploads`, `documents`, `data`, `files`, `exports`, `storage`, `db`, `static`).
- Rechercher les secrets ou mots de passe en dur.
- Rechercher les URLs `localhost` / `127.0.0.1`.

## 2. Synthèse rapide

Un tableau à compléter, une ligne par application.

| Application | Répertoire | Technologie confirmée | Démarrage probable | Port constaté |
| --- | --- | --- | --- | --- |
| `<application>` (exemple) | `<répertoire>` | `<Python Flask / Node.js Express / autre>` | `<commande>` | `<variable de port>` ou `<port par défaut>` |

## 3. Arborescence source normalisée

Lister ici les répertoires applicatifs réels du projet.

- `<répertoire-1>`
- `<répertoire-2>`

## 4. Cible de dockerisation

Compléter :

- nombre de services applicatifs Docker : `<N>` ;
- liste des services : `<application-1>`, `<application-2>` ;
- modules statiques intégrés à un service existant (sans conteneur propre) : `<module>` ou « aucun ».

Règle de décision : une application sans serveur propre (module HTML/JS statique) est servie par le service qui l'héberge. On ne lui crée pas de conteneur, sauf découverte d'un serveur dédié.

Règles d'exposition utilisateur :

- Le domaine utilisateur est commun, par défaut : `<domaine>`. Chaque application est routée par un chemin (`PathPrefix`).
- Un nom DNS dédié à une application est une exception. Elle se justifie par écrit dans le contrat de l'application et se fait valider.
- Aucun service ne publie de port directement sur l'hôte en production.
- Les services internes communiquent entre eux par noms Docker, jamais par `localhost`.
- Les liens vers des URL externes à la stack ne sont pas des services Docker internes. Ils ne remettent pas en cause la règle du domaine commun.

## 5. Fiche par application

Copier la fiche ci-dessous une fois par application, puis la compléter à partir du code réel. Une information non vérifiée se note « à confirmer », jamais une valeur supposée.

### 5.x `<application>`

- Nom fonctionnel :
- Nom exact du répertoire :
- Technologie confirmée :
- Langage :
- Fichier de démarrage probable :
- Port utilisé ou supposé :
- Dépendances détectées :
- Commande locale probable :
- Variables d'environnement détectées :
- Fichiers `.env` ou de configuration détectés :
- Dépendances externes éventuelles (base partagée, API d'un autre service, SMTP, API externe) :
- Stockage local éventuel :
- Chemins absolus ou dépendances au poste du développeur :
- Secrets en dur :
- Risques ou inconnues :
- Décision recommandée pour Docker :

## 6. Ports confirmés et incertains

Ports confirmés par le code :

- `<application>` : `<port>` par défaut via `<variable>`.

Ports incertains ou incohérents (collision entre applications, port du code différent de celui attendu par le portail ou les scripts) :

- `<application>` : `<constat>` ; recommandation : `<port retenu>`.

## 7. Dépendances externes transverses

Lister ce qui est partagé entre applications :

- bases de données partagées (chemin, applications qui l'utilisent) ;
- partages de fichiers ou lecteurs réseau ;
- SMTP ;
- API d'une application utilisée par une autre ;
- API externes (URL, usage).

## 8. Risques bloquants pour Docker / reverse proxy

Points à vérifier pour chaque projet :

- collision de ports entre applications ;
- chemins absolus Windows, incompatibles tels quels avec un conteneur Linux ;
- secrets et mots de passe en dur ;
- base de données partagée entre plusieurs applications : volume, verrouillage et accès concurrent à traiter explicitement ;
- code chargé depuis un autre répertoire applicatif, qui casse l'indépendance des applications ;
- `package.json` dont le script de démarrage ne correspond pas au fichier réellement utilisé ;
- URLs `localhost` / `127.0.0.1` codées dans les frontends et les APIs ;
- routage par `PathPrefix` à valider avant de créer la stack du reverse proxy, sous peine de casser les liens existants ;
- liens externes à distinguer des services internes ; pour un appel serveur sortant : DNS, sortie HTTPS, proxy sortant éventuel, certificats CA.

## 9. Prochaine étape

Avant de créer les Dockerfiles, valider avec le demandeur :

1. la matrice des ports et des dépendances partagées ;
2. le traitement des modules statiques ;
3. le stockage persistant cible de chaque donnée (base, uploads, JSON, exports) ;
4. le stockage des secrets réels dans la plateforme de déploiement, sans les committer, sans les mettre dans `.env.example` et sans les intégrer aux images.

## 10. Décisions à valider avant Dockerfile

### 10.1 Cible de conteneurisation

- Services applicatifs Docker : `<liste>`.
- Modules sans conteneur propre : `<liste>` ou « aucun ».

### 10.2 Ports

- Port de chaque service, et décision pour chaque collision.

### 10.3 Commandes de démarrage à privilégier

- Une commande par application. Ne pas utiliser `npm start` si `package.json` pointe vers un fichier absent.

### 10.4 Volumes à définir avant Dockerfile

- Une ligne par donnée persistante (voir `docs/03-contrat-volumes-persistance.md`).

### 10.5 Secrets à stocker dans la plateforme de déploiement

- Lister les secrets détectés (clé de session, JWT, SMTP, comptes d'API, mots de passe par défaut).
- Décision : les secrets réels se stockent dans la plateforme de déploiement. Docker secrets ou un autre mécanisme restent des options futures non retenues.

### 10.6 URLs `localhost` / `127.0.0.1`

- Identifier les URLs codées en dur.
- Prévoir leur remplacement par des variables d'environnement ou des URLs internes Docker.
- Ne pas modifier le comportement métier.

### 10.7 Exposition utilisateur

- Domaine commun : `<domaine>`.
- Chemins publics à valider : `/<chemin-1>`, `/<chemin-2>`.
- Route de contrôle de santé : `/health` pour chaque service.

### 10.8 URL externes

| URL externe | Usage | Type | Criticité | Statut validation | Commentaire |
| --- | --- | --- | --- | --- | --- |
| `<URL>` (exemple) | `<usage>` | lien navigateur / appel serveur | faible / moyenne / haute | à valider | URL externe à la stack Docker |
