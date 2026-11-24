---
name: revue-cadree
description: Cadre une décision technique structurante (architecture, sécurité, convention) en la faisant passer par 4 regards spécialisés avant de l'appliquer. À invoquer avant un changement important sur ce gabarit ou un projet qui en dérive — pas pour une correction mineure.
---

# Revue cadrée à 4 regards

Ce projet définit quatre personas réutilisables dans `.Codex/agents/` :
`architecte`, `optimiste`, `contradicteur`, `etranger`. Le cinquième rôle,
l'orchestrateur, c'est toi (la session en cours) — jamais un sous-agent.

## Quand l'utiliser

Avant d'appliquer une décision qui serait coûteuse à défaire : évolution
d'architecture du gabarit, choix touchant aux secrets ou à la sécurité,
changement de convention versionné (ce qui finira dans `.Codex/`,
`.devcontainer/`, ou une règle `AGENTS.md`). Pas pour une correction évidente
ou un détail cosmétique — le coût de la revue doit rester inférieur au risque
de se tromper.

**Note** : juste après la création ou la modification d'un des quatre fichiers
`.Codex/agents/*.md`, l'outil Agent peut mettre un moment à le reconnaître
comme `subagent_type` (délai d'enregistrement constaté le 2026-10-29, pas une
limite permanente). Si un appel `subagent_type: "architecte"` échoue juste après
une modification, préfixer le prompt par le contenu du fichier en repli
temporaire plutôt que renoncer.

## Procédure

1. **Propositions en parallèle.** Appeler l'outil Agent deux fois dans le même
   message : `subagent_type: "architecte"` et `subagent_type: "optimiste"`,
   chacun avec le même énoncé du sujet. Ne pas attendre l'un pour lancer l'autre.
2. **Critique en parallèle.** Une fois les deux propositions en main, les
   transmettre telles quelles (jamais résumées ou édulcorées) à `contradicteur`
   et `etranger`, à nouveau dans un seul message avec deux appels Agent.
3. **Synthèse.** Toi seul trancher : choisir une proposition, une combinaison,
   ou aucune des deux si les critiques l'imposent. Dire explicitement ce que
   chaque critique a changé dans la décision — ne jamais ignorer un verdict
   `bloquant` sans le signaler à l'utilisateur.
4. **Présentation.** Rendre compte à l'utilisateur de la décision et de sa
   justification, pas du détail de l'échange entre les quatre rôles — celui-ci
   reste un outil de travail interne, pas le livrable.

Pour une version journalisée et reproductible de cette même séquence (utile
pour une décision qu'on veut pouvoir rejouer ou auditer plus tard), lancer le
workflow `revue-cadree` (`.Codex/workflows/revue-cadree.js`) avec
`args: { sujet: "...", contexte: "..." }` au lieu de dérouler les 4 étapes à la
main. Le lancement d'un workflow reste soumis à l'autorisation de l'utilisateur :
proposer, ne pas lancer silencieusement.
