# Contrat d'exécution Docker — `mon-projet`

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

Date de rédaction : `<date>`
Date de validation : `<date>`
Auteur : `<auteur>`

## 1. Objectif du contrat

Ce document fixe, **avant toute écriture de Dockerfile**, la manière dont chaque service de `mon-projet` s'exécute dans un conteneur : langage, commande de démarrage, port interne, dépendances, healthcheck.

Il ne décrit pas les volumes (document 03), les variables et secrets (04) ni le réseau.

Règle : un Dockerfile n'est écrit qu'une fois ce contrat validé (document 06).

## 2. Périmètre

Services couverts par ce contrat :

| Service (`<application>`) | Rôle | Langage / framework | Dossier source |
|---|---|---|---|
| `<application-1>` | `<rôle>` | `<Python Flask / Node.js Express / autre>` | `<dossier>` |
| `<application-2>` | `<rôle>` | `<…>` | `<dossier>` |

*Une ligne par service. Les lignes ci-dessus sont des emplacements à remplacer.*

Hors périmètre : `<ce qui n'est pas dockerisé, avec la raison>`.

## 3. Règles communes à tous les services

1. **Un Dockerfile unique** par service, utilisé à l'identique en local, en CI et dans la plateforme de déploiement.
2. **Image de base** épinglée par version (`python:3.12-slim`, `node:24-slim`, etc.), jamais `latest`.
3. **Utilisateur non root** dans l'image finale quand l'application le permet.
4. **Aucun secret** dans l'image ni dans Git : les valeurs viennent de l'environnement (document 04).
5. **Aucune donnée persistante** dans l'image : elles vont dans un volume (document 03).
6. **Écoute sur `0.0.0.0`** dans le conteneur, sur le port interne défini au §6.
7. **Route `/health`** qui répond sans authentification (§9).
8. **`restart: unless-stopped`** pour tous les services.
9. **Journaux sur la sortie standard** (lisibles par `docker logs`).
10. **Fichier `.dockerignore`** : exclut `.git`, `.docker-data`, `node_modules`, `.venv`, fichiers `.env`.

## 4. Contrat pour un service Python (Flask ou autre)

À renseigner si le projet contient un service Python.

| Point | Valeur |
|---|---|
| Version Python | `<3.12>` |
| Gestion des dépendances | `<uv + pyproject.toml / requirements.txt>` |
| Serveur d'exécution | `<gunicorn / uvicorn / flask run (interdit en recette et production)>` |
| Point d'entrée | `<module:application>` |
| Port interne | `<port>` |
| Dossier de travail | `/app` |

Exemple (marqué « exemple », à adapter) :

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install --no-cache-dir uv && uv sync --frozen --no-dev
COPY . .
EXPOSE <port>
CMD ["uv", "run", "gunicorn", "-b", "0.0.0.0:<port>", "<module:application>"]
```

## 5. Contrat pour un service Node.js (Express ou autre)

À renseigner si le projet contient un service Node.js.

| Point | Valeur |
|---|---|
| Version Node | `<24>` |
| Installation | `npm ci` (ou `npm install` sans `package-lock.json`) |
| Démarrage | script `start` déclaré dans `package.json` |
| Port interne | `<port>` |
| Dossier de travail | `/app` |

Exemple (à adapter) :

```dockerfile
FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE <port>
CMD ["npm", "start"]
```

## 6. Ports internes

Le port interne est celui sur lequel l'application écoute **dans le conteneur**. Il n'est jamais publié sur l'hôte en recette ni en production : seul le reverse proxy joint le service par le réseau.

| Service | Port interne | Variable de port |
|---|---|---|
| `<application-1>` | `<port>` | `<APPLICATION>_PORT` |
| `<application-2>` | `<port>` | `<APPLICATION>_PORT` |

Règle de nommage : `<APPLICATION>` est le nom du service en majuscules ; la variable préfixée évite qu'un `PORT` générique entre en conflit entre services.

### 6.1 Exposition directe pour les tests locaux

En local uniquement, le fichier compose peut publier le port sur `127.0.0.1:<port-hôte>:<port>`. Cette ligne `ports:` n'existe **pas** dans la stack de déploiement.

## 7. Dépendances partagées

| Dépendance | Utilisée par | Mode d'accès | Remarque |
|---|---|---|---|
| `<base de données, fichier, service tiers>` | `<services>` | `<volume / URL interne / variable>` | `<contraintes d'accès concurrent, sauvegarde>` |

Si aucune dépendance n'est partagée entre services, l'écrire explicitement : « Aucune dépendance partagée ».

## 8. Commandes de démarrage

| Service | Commande en conteneur | Commande en local hors conteneur |
|---|---|---|
| `<application-1>` | `<commande>` | `<commande>` |

Les migrations de base de données s'exécutent au démarrage, doivent pouvoir être rejouées sans effet de bord, et sont précédées d'une sauvegarde pour toute correction de données.

## 9. Healthchecks

Chaque service expose `GET /health`, sans authentification, qui répond `200` avec un corps minimal (`{"status": "ok"}`).

| Service | Route | Réponse attendue | Intervalle | Délai de grâce |
|---|---|---|---|---|
| `<application-1>` | `/health` | `200` | `30s` | `<20s>` |

Exemple de bloc compose (à adapter) :

```yaml
healthcheck:
  test: ["CMD", "curl", "-fsS", "http://localhost:<port>/health"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 20s
```

## 10. Critères d'acceptation avant Dockerfile

- [ ] Chaque service du périmètre (§2) a un langage, un point d'entrée et un port interne.
- [ ] Aucun port n'est destiné à être publié sur l'hôte en recette ou production.
- [ ] Chaque service a une route `/health` documentée.
- [ ] Les dépendances partagées (§7) sont listées, ou leur absence est écrite.
- [ ] Les commandes de démarrage (§8) sont testées en local.
- [ ] Le document est validé dans la matrice (document 06) à la date indiquée en tête.
