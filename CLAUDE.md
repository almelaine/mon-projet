@AGENTS.md

## Claude Code (extension VS Code / CLI dans le devcontainer)

- `AGENTS.md` est la seule source des règles. Ce fichier ne les répète pas.
- Au début de chaque session, lire `docs/15-suivi-projet.md` (état, lots, journal) s'il existe, avant toute proposition.
- Ne jamais afficher de jeton.
- Ne jamais fusionner de code dans `main`. Les actions externes (tag, déploiement) ne se font que sur demande explicite.
- Contexte propre au projet : `<à renseigner>` (documents de référence, notes de session).
