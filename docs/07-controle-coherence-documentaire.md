# Contrôle de cohérence documentaire — `mon-projet`

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

Date de contrôle : `<date>`

## 1. Synthèse du contrôle

Le contrôle porte sur les documents de cadrage, les contrats globaux et les contrats applicatifs du projet.

Documents à contrôler :

- `docs/00-inventaire-applications.md`
- `docs/01-architecture-cible.md`
- `docs/02-contrat-execution-docker.md`
- `docs/03-contrat-volumes-persistance.md`
- `docs/04-contrat-env-secrets.md`
- `docs/06-matrice-validation-contrats.md`
- `docs/contracts/*.md`
- `AGENTS.md`

Conclusion générale : `<à renseigner>`

Statut final : **`<COHÉRENT / COHÉRENT AVEC RÉSERVES / INCOHÉRENT>`**

## 2. Contrôle du périmètre

Attendu : `<n>` services applicatifs Docker et `<modules intégrés>`.

| Point contrôlé | Statut | Documents concernés |
| --- | --- | --- |
| Nombre de services Docker | `<Conforme / Écart>` | `<documents>` |
| Modules intégrés, sans conteneur séparé | `<Conforme / Écart>` | `<documents>` |

Réserves : `<à renseigner>`

## 3. Contrôle des ports

| Service | Port attendu | Statut | Documents de référence |
| --- | ---: | --- | --- |
| `<application>` | `<port>` | `<Conforme / Écart>` | `<documents>` |

Réserves : un écart historique entre le port par défaut du code et le port cible Docker n'est pas une incohérence ; c'est un écart à traiter.

## 4. Contrôle des commandes de démarrage

| Service | Commande attendue | Statut | Commentaire |
| --- | --- | --- | --- |
| `<application>` | `<commande explicite>` | `<Conforme / Écart>` | `<remarque>` |

Réserves : l'inventaire décrit l'état constaté, les contrats décrivent la cible Docker. Une différence entre les deux est normale tant qu'elle est identifiée.

## 5. Contrôle des interdictions et limites de l'étape

Attendu :

- Pas de Dockerfile avant validation des contrats.
- Pas de `docker-compose.yml` ni de stack de déploiement avant validation des contrats.
- Pas de modification du code métier à ce stade.

Résultat : `<Conforme / Écart>`

Constats : `<à renseigner>`

## 6. Contrôle des noms Docker

| Nom Docker attendu | Statut | Documents concernés |
| --- | --- | --- |
| `<application>` | `<Conforme / Écart>` | `<documents>` |

## 7. Contrôle des risques structurants

| Risque attendu | Statut | Documents concernés |
| --- | --- | --- |
| Base de données partagée | `<Conforme / Écart / Sans objet>` | `<documents>` |
| Chemins absolus Windows | `<Conforme / Écart / Sans objet>` | `<documents>` |
| Secrets en dur | `<Conforme / Écart / Sans objet>` | `<documents>` |
| `localhost` / `127.0.0.1` | `<Conforme / Écart / Sans objet>` | `<documents>` |
| Dépendances entre services | `<Conforme / Écart / Sans objet>` | `<documents>` |
| `package.json` incohérent | `<Conforme / Écart / Sans objet>` | `<documents>` |
| Secrets stockés dans la plateforme de déploiement | `<Conforme / Écart>` | `<documents>` |
| URL externes hors stack Docker | `<Conforme / Écart / Sans objet>` | `<documents>` |

## 8. Incohérences trouvées

Pour chaque incohérence, remplir un bloc :

### 8.1 `<titre>`

- Documents concernés : `<documents>`
- Constat : `<ce qui diffère>`
- Impact : `<faible / moyen / bloquant>`
- Correction recommandée : `<action>`

## 9. Corrections recommandées

1. `<correction>`

## 10. Statut final

Statut final : **`<COHÉRENT / COHÉRENT AVEC RÉSERVES / INCOHÉRENT>`**

Justification : `<à renseigner>`
