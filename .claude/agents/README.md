# Agents de cadrage du développement

Quatre personas réutilisables, pour cadrer une décision technique avant de
l'appliquer plutôt que de la décider seul en un seul passage. Un cinquième rôle,
l'**orchestrateur**, n'a pas de fichier : c'est la session Claude Code qui pilote
(celle que l'utilisateur a ouverte), jamais un sous-agent.

| Rôle | Fichier | Fait quoi |
| --- | --- | --- |
| Architecte | [architecte.md](architecte.md) | Construit une solution complète et conforme aux règles du projet |
| Optimiste | [optimiste.md](optimiste.md) | Propose plusieurs pistes, sans s'attarder sur les risques |
| Contradicteur | [contradicteur.md](contradicteur.md) | Cherche activement ce qui ne va pas dans les propositions |
| Étranger | [etranger.md](etranger.md) | Relit à froid, sans contexte implicite, comme un audit externe |
| Orchestrateur | — (la session principale) | Dispatche, collecte les critiques, tranche, rend compte à l'utilisateur |

## Deux façons de les utiliser

**Rapide, dans la session en cours** — pour une question de conception ponctuelle :
l'orchestrateur (la session principale) appelle l'outil Agent avec
`subagent_type: "architecte"` et `subagent_type: "optimiste"` dans le même
message (parallèle), lit les deux réponses, puis appelle `contradicteur` et
`etranger` en parallèle sur ces réponses, et synthétise lui-même la décision à
l'utilisateur.

*Note constatée le 2026-10-29 : juste après la création de ces fichiers, l'outil
Agent de cette application ne les reconnaissait pas encore comme `subagent_type`
(seuls les types intégrés l'étaient) — un délai d'enregistrement, pas une
limite permanente : une fois les fichiers pris en compte, `subagent_type`
fonctionne normalement. Si un appel échoue juste après la création ou la
modification d'un persona, préfixer le prompt par son contenu en repli
temporaire plutôt que renoncer au dispositif.*

**Cadrée, journalisée** — pour une décision structurante (évolution d'architecture,
choix de sécurité, changement de convention) : lancer le workflow
[`revue-cadree`](../workflows/revue-cadree.js), qui exécute exactement cette
même séquence de façon déterministe et laisse une trace relisible. Voir
[GOUVERNANCE.md](../../GOUVERNANCE.md) à la racine du dépôt pour le détail et les
exemples d'utilisation.

Dans les deux cas, aucun des quatre rôles ne décide seul : la décision finale
revient toujours à l'orchestrateur, qui la présente à l'utilisateur plutôt que de
l'appliquer silencieusement.
