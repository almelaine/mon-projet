# llm-council — origine et portée dans ce projet

Skill tierce, installée telle quelle le 2026-10-29 à partir de
`llm-council-skill-main.zip` (dépôt
[oliwoodman/llm-council-skill](https://github.com/oliwoodman/llm-council-skill),
skill créée par [Ole Lehmann](https://x.com/itsolelehmann), méthodologie
adaptée de [Karpathy's LLM Council](https://github.com/karpathy/llm-council)).
`SKILL.md` n'a pas été modifié par rapport au téléchargement.

## À ne pas confondre avec `revue-cadree`

Ce projet a déjà un dispositif à 5 rôles pour cadrer ses décisions techniques
(voir [`GOUVERNANCE.md`](../../../GOUVERNANCE.md), skill
[`revue-cadree`](../revue-cadree/SKILL.md)). Les deux coexistent, sur des
terrains différents — **ne pas remplacer l'un par l'autre** :

| | `llm-council` | `revue-cadree` |
| --- | --- | --- |
| Terrain | Décisions business/stratégiques/perso ("quel positionnement", "quel prix"...) | Décisions techniques sur **ce gabarit** (architecture, secrets, conventions) |
| Ancrage | Raisonnement pur, pas de lecture de fichiers | Agents outillés (Read/Grep/Bash), citent des fichiers et des lignes réels |
| Sortie | Verdict en chat, pas de fichier modifié | Pensé pour alimenter de vrais fichiers de décision (`SECURITE.md`...) |
| Déclencheurs | « council this », « pressure-test this », « stress-test this »... | `/revue-cadree`, ou le workflow `revue-cadree.js` |

Pour une question technique sur ce dépôt (architecture, sécurité, convention),
utiliser `revue-cadree`. Pour une question de décision plus générale (offre,
priorisation, "est-ce que je me trompe"), `llm-council` convient mieux.

Installée ici en projet (pas en global utilisateur) à la demande d'Alain du
2026-10-29 : ne s'applique qu'à ce dépôt et aux projets qui en copient
`.claude/`, pas aux autres projets du poste.
