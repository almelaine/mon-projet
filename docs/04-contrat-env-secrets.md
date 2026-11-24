# Contrat des variables d'environnement et secrets — `mon-projet`

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

Date de rédaction : `<date>`
Date de validation : `<date>`
Auteur : `<auteur>`

## 1. Objectif

Ce document recense toutes les variables d'environnement de `mon-projet`, dit lesquelles sont des secrets, et où chaque valeur est saisie.

## 2. Règles générales

1. **Aucun secret dans Git, dans l'image ni dans un fichier compose.** Les secrets sont saisis dans la plateforme de déploiement (stack, section variables d'environnement).
2. Le dépôt contient `.env.deploy.example` : il liste **tous** les noms de variables, avec des valeurs factices ou vides, et un commentaire par variable.
3. Un fichier `.env` local n'est jamais committé (il figure dans `.gitignore`).
4. Une variable obligatoire utilise la syntaxe `${NOM:?message}` pour que la stack refuse de démarrer si elle manque.
5. Les variables d'un service portent le préfixe de ce service (`<APPLICATION>_…`).
6. Une variable ne change pas de nom entre local, recette et production : seule la valeur change.
7. Un secret affiché dans un journal, un ticket ou un message est considéré comme compromis et renouvelé.
8. Une variable n'est **jamais déduite** d'une autre par convention implicite (ex. `<domaine>-${APP_ENV}`, un nom de réseau composé d'un suffixe d'environnement). Deux valeurs qui se ressemblent en recette peuvent diverger en production sans suivre de règle commune (ex. un domaine de production qui ne porte pas le nom de son environnement, à la différence de la recette) : chaque variable concernée est saisie indépendamment dans la plateforme de déploiement, même si cela duplique une valeur qui, par coïncidence, suivrait la règle ailleurs.

## 3. Variables globales

| Variable | Rôle | Secret | Exemple (factice) | Obligatoire |
|---|---|---|---|---|
| `VOLUME_ROOT` | racine des volumes sur l'hôte | non | `/data/volumes/mon-projet-recette` | oui (plateforme) |
| `IMAGE_TAG` | tag de l'image à déployer, sans `v` | non | `1.0.0` | oui (plateforme) |
| `APP_ENV` | environnement d'exécution | non | `recette` | oui |
| `TZ` | fuseau horaire | non | `Europe/Paris` | non |

*Lignes d'exemple, à adapter.*

## 4. Variables par service

Dupliquer le bloc ci-dessous pour chaque service.

### 4.x `<application>`

| Variable | Rôle | Secret | Exemple (factice) | Local | Recette / production |
|---|---|---|---|---|---|
| `<APPLICATION>_PORT` | port d'écoute interne | non | `<port>` | `.env` | stack |
| `<APPLICATION>_DB_PATH` | chemin de la base | non | `/data/app.db` | `.env` | stack |
| `<APPLICATION>_SECRET_KEY` | clé de signature | **oui** | *(vide)* | `.env` | Plateforme de déploiement |

## 5. Secrets à stocker dans la plateforme de déploiement

| Secret | Service | Qui le fournit | Rotation | Qui le saisit |
|---|---|---|---|---|
| `<NOM_DU_SECRET>` | `<application>` | `<personne / service>` | `<fréquence>` | `<personne>` |

Un secret n'est jamais envoyé par courriel ni écrit dans un ticket : il est transmis par un canal convenu, puis saisi directement dans la plateforme de déploiement.

## 6. Variables liées aux URLs internes

Les services d'un même projet se joignent par leur nom de service sur le réseau Docker, pas par une adresse IP ni par le nom public.

| Variable | Valeur | Utilisée par |
|---|---|---|
| `<APPLICATION>_INTERNAL_URL` | `http://<application>:<port>` | `<application-appelante>` |

## 7. URLs externes

| Variable | Valeur recette | Valeur production |
|---|---|---|
| `<APPLICATION>_PUBLIC_URL` | `https://<domaine-recette>` | `https://<domaine-production>` |
| `<SERVICE_TIERS>_URL` | `<url>` | `<url>` |

## 8. Critères d'acceptation

- [ ] Toutes les variables lues par le code figurent dans `.env.deploy.example`.
- [ ] Chaque secret est identifié (colonne « Secret ») et absent de Git.
- [ ] Les variables obligatoires utilisent `${NOM:?message}`.
- [ ] Les valeurs de recette et de production sont distinctes.
- [ ] Une personne est désignée pour la saisie et la rotation de chaque secret.
- [ ] Le document est validé dans la matrice (document 06).
