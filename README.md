# mon-projet

> Gabarit générique : à compléter pour le projet `mon-projet` ; supprimer cette phrase une fois le document renseigné.

<Description courte du projet — une ou deux phrases : à quoi il sert, pour qui.>

## Démarrer

1. Ouvrir ce dépôt dans VS Code, puis « Dev Containers: Reopen in Container ».
2. Copier `.env.example` vers `.env` et le renseigner (jamais commité).
3. Lancer les tests (`Ctrl+Shift+P` > *Tasks: Run Test Task*, ou directement
   `uv run pytest` / `npm run test:js` selon le langage).
4. Démarrer l'application en local : `docker compose -f docker-compose.local.yml up --build`.

## Règles et documentation

- Règles pour l'assistant (Claude Code) : [`AGENTS.md`](AGENTS.md) — seule
  source des règles, `CLAUDE.md` n'en est que le lanceur.
- Cadrage technique (architecture, Docker, volumes, secrets) :
  [`docs/`](docs/) — à lire et compléter avant toute évolution structurante.
- Secrets et jetons : [`docs/04-contrat-env-secrets.md`](docs/04-contrat-env-secrets.md)
  et `SECURITE.md` du gabarit.
