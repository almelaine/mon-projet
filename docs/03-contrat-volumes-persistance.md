# Contrat de volumes et persistance — `mon-projet`

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

Date de rédaction : `<date>`
Date de validation : `<date>`
Auteur : `<auteur>`

## 1. Objectif

Ce document liste les données qui doivent survivre à la recréation d'un conteneur et dit où elles sont stockées, en local comme sur le serveur hôte.

Principe : **tout ce qui n'est pas dans un volume est perdu** quand le conteneur est recréé (mise à jour, retour arrière, redémarrage de la stack).

## 2. Données persistantes identifiées

| Donnée | Service | Nature | Sensibilité | Sauvegarde nécessaire |
|---|---|---|---|---|
| `<base de données>` | `<application>` | `<SQLite / fichier>` | `<oui / non>` | `<oui / non>` |
| `<documents déposés>` | `<application>` | `<fichiers>` | `<…>` | `<…>` |
| `<journaux applicatifs>` | `<application>` | `<fichiers>` | `<…>` | `<…>` |

*Les lignes ci-dessus sont des emplacements à remplacer. Écrire « aucune donnée persistante » si le service est sans état.*

## 3. Structure cible

| Environnement | Racine des volumes | Origine de la valeur |
|---|---|---|
| Local | `./.docker-data` | chemin relatif dans le compose |
| Recette | `${VOLUME_ROOT}` | variable saisie dans la plateforme de déploiement, ex. `/data/volumes/mon-projet-recette` |
| Production | `${VOLUME_ROOT}` | variable saisie dans la plateforme de déploiement, ex. `/data/volumes/mon-projet` |

Arborescence type sous la racine :

```text
<racine>/
├── <application-1>/
│   ├── data/
│   └── logs/
└── <application-2>/
    └── data/
```

Règles :

1. `VOLUME_ROOT` est **toujours saisie, jamais déduite** : un chemin faux ne provoque aucune erreur, Docker crée silencieusement un dossier vide.
2. La stack de déploiement utilise `${VOLUME_ROOT:?message}` pour échouer si la variable est absente.
3. Jamais de `./.docker-data` dans une stack de déploiement.
4. Le dossier `.docker-data` est ignoré par Git.

## 4. Contrat par application

Dupliquer le bloc ci-dessous pour chaque service.

### 4.x `<application>`

| Point | Valeur |
|---|---|
| Chemin dans le conteneur | `<chemin>` |
| Chemin local | `./.docker-data/<application>/<dossier>` |
| Chemin recette / production | `${VOLUME_ROOT}/<application>/<dossier>` |
| Droits requis | `<utilisateur / groupe / mode>` |
| Contenu | `<description>` |
| Sauvegarde | `<qui, à quelle fréquence>` |
| Remise à zéro possible | `<oui en local / non en production>` |

## 5. Cas particulier : base de données partagée entre services

À renseigner seulement si plusieurs services accèdent au même fichier de base (SQLite, par exemple).

| Point | Valeur |
|---|---|
| Fichier | `<nom du fichier>` |
| Service propriétaire (écriture) | `<application>` |
| Services en lecture seule | `<applications>` |
| Mode de montage | `<read-write / read-only>` |
| Risque | verrous d'écriture concurrents, corruption si deux écrivains |

Règle : un seul service écrit. Les autres montent le volume en `:ro` ou passent par l'API du propriétaire.

## 6. Cas particulier : partage réseau ou dossier du poste

À renseigner seulement si l'application lit ou écrit un dossier extérieur au conteneur (partage réseau, lecteur mappé).

Un chemin de poste de travail (lecteur mappé, chemin Windows) n'est jamais écrit en dur dans le code ni dans l'image. Il est remplacé par :

1. une variable d'environnement (`<APPLICATION>_DATA_DIR`) ;
2. un volume ou un montage validé sur le serveur hôte ;
3. un contrôle au démarrage qui échoue clairement si le dossier est absent.

| Point | Valeur |
|---|---|
| Source | `<partage / dossier>` |
| Montage sur le serveur hôte | `<chemin hôte>` |
| Chemin dans le conteneur | `<chemin>` |
| Droits | `<lecture seule / lecture-écriture>` |

## 7. Critères d'acceptation

- [ ] Chaque donnée persistante (§2) a un chemin dans le conteneur et un chemin hôte.
- [ ] Aucun fichier de données n'est dans l'image.
- [ ] `VOLUME_ROOT` est documentée dans `.env.deploy.example` pour la recette et la production.
- [ ] Les accès partagés (§5, §6) ont un propriétaire unique en écriture.
- [ ] La sauvegarde de chaque donnée sensible est attribuée à une personne.
- [ ] Le document est validé dans la matrice (document 06).
