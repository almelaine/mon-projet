# Contrat application — NOM_APPLICATION

## 1. Identification

- Nom fonctionnel :
- Répertoire source :
- Type :
- Technologie :
- Langage :
- Service Docker V1 : oui/non
- Module intégré : oui/non
- Rôle dans l’intranet :

## 2. État actuel constaté

- Point d’entrée :
- Commande locale probable :
- Port actuel :
- Port cible Docker :
- Fichier package.json / requirements :
- Fichiers de configuration :
- Particularités :

## 3. Contrat Docker cible

- Image de base recommandée :
- Build context :
- Dockerfile cible :
- Workdir :
- Commande de démarrage :
- Port interne :
- Utilisateur d’exécution :
- NODE_ENV / FLASK_ENV :
- Healthcheck proposé :
- Logs attendus :

### 3.1 Exécution et tests locaux obligatoires

- Commande de build avec l'unique Dockerfile :
- Commande de test avec `docker-compose.local.yml` :
- Commande de démarrage hors Docker :
- Configuration VS Code / interpréteur :
- `.env` local dérivé de `.env.example` : oui/non
- Données locales exclusivement sous `./.docker-data` : oui/non
- Configuration de déploiement dérivée de `.env.deploy.example` : oui/non
- Volumes de déploiement sous `${VOLUME_ROOT}` : oui/non

## 4. Variables d’environnement

| Variable | Obligatoire | Sensible | Exemple | Description | Source constatée |
| --- | --- | --- | --- | --- | --- |
|  | oui/non | oui/non |  |  |  |

## 5. Volumes et persistance

| Donnée | Chemin actuel | Chemin conteneur cible | Volume hôte cible | Criticité | Commentaire |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 6. Dépendances interservices

- Services appelés :
- Services appelants :
- URLs actuelles :
- URLs Docker cibles :
- Risques :

## 7. Exposition HTTP / reverse proxy

- Exposition reverse proxy : oui/non/à confirmer
- Exposition DNS directe : oui/non
- Exposition par port hôte : oui/non
- Accès utilisateur :
- Domaine proposé :
- Route publique éventuelle :
- Port cible :
- Option recommandée :

## 8. Risques connus

- Ports :
- Chemins absolus :
- Secrets :
- Base partagée :
- package.json incohérent :
- Dépendance interservice :
- localhost / 127.0.0.1 :
- Stockage local :

## 9. Critères d’acceptation

- Build image OK :
- Conteneur démarre OK :
- Port interne répond OK :
- Logs lisibles :
- Volumes montés :
- Variables obligatoires documentées :
- Aucun secret dans l’image :
- Secrets réels stockés dans la plateforme de déploiement :
- Aucun besoin de Python/Node installé sur l’hôte :
- Fonction principale testable :
- Même Dockerfile utilisé en local, en CI et pour la plateforme de déploiement :
- Démarrage hors Docker validé :
- Aucun chemin local `./.docker-data` dans la configuration de déploiement :

## 10. Décisions à valider

| Décision | Statut | Commentaire |
| --- | --- | --- |
|  | à valider |  |
