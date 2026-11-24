# Matrice de validation des contrats — `mon-projet`

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

Date de rédaction : `<date>`
Date de validation : `<date>`

## 1. Objectif

Ce document sert à valider humainement les contrats techniques du projet avant d'autoriser :

- la création des Dockerfile ;
- la création du `docker-compose.yml` ;
- la préparation de la stack de déploiement / reverse proxy.

Il centralise les décisions validées sur l'architecture, les ports, les commandes, les routes utilisateur, les volumes, les secrets et les risques acceptés, avant toute implémentation Docker.

## 2. Synthèse de l'architecture validée

À compléter pour `mon-projet`. Points à trancher, un par ligne :

- Nombre de services applicatifs Docker : `<n>`.
- Modules intégrés à un autre service, sans conteneur propre : `<liste ou aucun>`.
- Domaine utilisateur : `<domaine>`.
- Services exposés aux utilisateurs via un nom DNS : `<liste>`.
- Services internes au réseau Docker, sans DNS dédié : `<liste>`.
- Aucun service ne publie de port directement sur l'hôte en production.
- Les appels frontend sont relatifs et same-origin ; pas de CORS applicatif. Tout besoin cross-origin futur est validé puis traité au niveau du reverse proxy.
- La communication interservices passe par les noms Docker internes.
- Les données métier sont persistées dans des volumes ou montages validés.
- Les secrets réels sont stockés dans la plateforme de déploiement.
- Les liens vers des URL externes à la stack sont distingués des services internes routés par le reverse proxy.

Services Docker :

| Service | Nom Docker |
| --- | --- |
| `<application>` | `<application>` |

## 3. Tableau de validation globale

| Élément à valider | Décision validée | Statut | Validé par | Date de validation | Commentaire / réserve |
| --- | --- | --- | --- | --- | --- |
| Architecture et domaine | `<décision>` | `<à valider / VALIDÉ>` | `<nom>` | `<date>` | exemple |
| Absence de ports publiés sur l'hôte | Ne pas publier les ports internes en production | `<à valider / VALIDÉ>` | `<nom>` | `<date>` | Accès via le reverse proxy uniquement |
| Routage reverse proxy | `Host(<domaine>)` + `PathPrefix(<chemin>)` si besoin | `<à valider / VALIDÉ>` | `<nom>` | `<date>` | Routes à tester avec les frontends |
| Same-origin sans CORS applicatif | Appels frontend relatifs | `<à valider / VALIDÉ>` | `<nom>` | `<date>` |  |
| Communication interservices | `http://<service>:<port>` | `<à valider / VALIDÉ>` | `<nom>` | `<date>` | Remplace `localhost` / `127.0.0.1` |
| Volumes persistants | Volumes pour bases, uploads, données, exports | `<à valider / VALIDÉ>` | `<nom>` | `<date>` | Voir le contrat de persistance |
| Secrets dans la plateforme de déploiement | Aucun secret réel dans le dépôt, `.env.example` ou l'image | `<à valider / VALIDÉ>` | `<nom>` | `<date>` |  |
| Chemins absolus Windows | Remplacer par volume, montage ou variable | `<à valider / VALIDÉ>` | `<nom>` | `<date>` |  |
| URL `localhost` / `127.0.0.1` | Remplacer ou paramétrer avant déploiement | `<à valider / VALIDÉ>` | `<nom>` | `<date>` | Risque bloquant frontend / API |

## 4. Tableau de validation par service

| Service | Type | Nom Docker cible | Port interne cible | Commande de démarrage cible | Exposition DNS directe | Port hôte publié | Accès utilisateur | Volumes requis | Secrets requis | Risque bloquant | Statut | Validé par | Date de validation |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<application>` (exemple) | `<Flask / Node.js Express / …>` | `<application>` | `<port>` | `<commande explicite>` | `<oui / non>` | non en production | `https://<domaine>/<chemin>` | `<liste>` | `<liste>` | `<liste>` | `<à valider>` | `<nom>` | `<date>` |

## 5. Validation des routes utilisateur

| Route utilisateur | Service cible | Type de routage | Statut | Validé par | Date de validation | Commentaire |
| --- | --- | --- | --- | --- | --- | --- |
| `/<chemin>` | `<application>` | `PathPrefix(/<chemin>)` | `<à valider>` | `<nom>` | `<date>` | exemple |

## 6. Validation des volumes

| Donnée persistante | Services concernés | Volume / chemin cible proposé | Criticité | Statut | Validé par | Date de validation | Commentaire |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<donnée>` (exemple) | `<service>` | `${VOLUME_ROOT}/<application>/<dossier>/` | `<Critique / Élevée / …>` | `<à valider>` | `<nom>` | `<date>` | `<sauvegarde, accès RW / RO>` |

Règles :

- Une base partagée entre plusieurs services existe une seule fois sur l'hôte ; aucun service n'en a une copie.
- Un volume réservé aux données propres d'un service ne contient pas les données d'un autre.
- `${VOLUME_ROOT}` est toujours saisie, jamais déduite.

## 7. Validation des secrets

| Secret / variable sensible | Services concernés | Mode cible | Statut | Validé par | Date de validation | Commentaire |
| --- | --- | --- | --- | --- | --- | --- |
| `<SECRET>` | `<services>` | Plateforme de déploiement | `<à valider>` | `<nom>` | `<date>` | Valeur par défaut remplacée, rotation avant production |

## 7.1 Validation des URL externes

| URL externe | Usage | Type | Criticité | Statut validation | Validé par | Date de validation | Commentaire |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<url>` | `<usage>` | `<lien navigateur / appel serveur>` | `<criticité>` | `<à valider>` | `<nom>` | `<date>` |  |

Règles de validation :

- Pour un lien navigateur, le poste utilisateur accède directement à l'URL externe.
- Pour un appel serveur sortant, le conteneur doit pouvoir résoudre les DNS, sortir en HTTPS, utiliser un proxy sortant si nécessaire et disposer des certificats CA requis.
- Ces URL ne sont pas des services Docker de la stack et ne sont pas routées par le reverse proxy.

## 8. Risques acceptés

Cocher les risques acceptés pour `mon-projet` :

- [ ] Base partagée conservée avec risque documenté
- [ ] Chemins absolus Windows remplacés par volumes ou montages
- [ ] URL `localhost` / `127.0.0.1` à corriger ou paramétrer pendant l'intégration Docker
- [ ] Services internes sans DNS dédié
- [ ] Services internes sans ports publiés sur l'hôte
- [ ] Secrets stockés dans la plateforme de déploiement avant déploiement
- [ ] `package.json` incohérents traités par commandes de démarrage explicites
- [ ] URL externes distinguées des services Docker internes
- [ ] Applications servies sous `PathPrefix` à tester (URL frontend, assets ou appels API codés en absolu)
- [ ] CORS applicatif supprimé ; besoin cross-origin futur traité au niveau du reverse proxy après validation

## 9. Cases de validation humaine

- [ ] Architecture et domaine validés
- [ ] Services Docker validés
- [ ] Ports internes validés
- [ ] Commandes de démarrage validées
- [ ] Routes utilisateur validées
- [ ] Volumes persistants validés
- [ ] Secrets stockés dans la plateforme de déploiement validés
- [ ] URL externes validées
- [ ] Routage reverse proxy validé
- [ ] Architecture same-origin sans CORS applicatif validée
- [ ] Risques acceptés
- [ ] Autorisation de passer aux Dockerfile

## 10. Décision finale de validation

- [ ] VALIDÉ POUR DOCKERFILE
- [ ] VALIDÉ AVEC RÉSERVES POUR DOCKERFILE
- [ ] NON VALIDÉ

Décision : `<à renseigner>`

Domaine validé : `<domaine>`

Commentaire : `<à renseigner>`

Responsable validateur : `<nom>`

Date : `<date>`

Réserves acceptées : `<références à la section 8>`
