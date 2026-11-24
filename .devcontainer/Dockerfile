# Environnement de developpement pour mon-projet.
# Base officielle Microsoft : Git, zsh, sudo et l'utilisateur non-root "vscode"
# deja inclus. Node.js, Docker-in-Docker et Claude Code sont ajoutes via les
# "features" de devcontainer.json, pas ici.
FROM mcr.microsoft.com/devcontainers/python:3.12

# Outils systeme. Ajuster cette liste au projet reel : tout vient des depots
# Debian trixie de cette image, ni depot tiers, ni binaire telecharge.
#
# Toujours utiles :
#   build-essential         : compilation de paquets Python natifs
#   jq                      : lecture de sorties JSON (API, CI)
#   openssh-client          : ssh/git par SSH, cle fournie par le relais
#                             d'agent de VS Code, jamais copiee dans l'image.
#                             Voir SECURITE.md (a retirer sinon, avec les
#                             permissions "ssh ..." de .claude/settings.json)
#   curl, less, ca-certificates : confort et appels reseau
#
# Selon le projet :
#   sqlite3, libsqlite3-dev : bases SQLite
#   postgresql-client       : psql vers la base locale ou de recette
#   chromium                : navigateur headless pour le serveur MCP
#                             chrome-devtools (reproduction d'anomalies
#                             d'interface). Inutile pour
#                             Playwright, qui installe son propre Chromium
#                             dans post-create.sh.
#   poppler-utils           : pdftoppm, rasterisation de PDF (OCR)
#   libgl1, libglib2.0-0    : requis par OpenCV (PaddleOCR, RapidOCR, docTR)
#
# Pour activer un paquet optionnel, l'ajouter a la liste ci-dessous (pas de
# ligne commentee a l'interieur du RUN : le parseur Dockerfile la refuse).
RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        build-essential \
        jq \
        openssh-client \
        curl \
        less \
        ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# uv : gestionnaire de dependances de tous les projets du gabarit
# (pyproject.toml + uv.lock). ruff, mypy et pytest ne sont PAS installes ici :
# ils viennent des dependances de developpement du projet
# ([project.optional-dependencies].dev de pyproject.toml), pour etre a la
# meme version que la CI.
RUN pip install --no-cache-dir uv

# Points de montage des volumes nommes declares dans devcontainer.json
# ("mounts"). Ils sont crees ici et appropries a "vscode" : un volume vide
# herite du contenu ET des droits du repertoire present dans l'image, alors
# qu'un volume monte sur un chemin absent de l'image est cree "root:root" par
# le demon Docker. Sans cela, docker est inutilisable dans le
# conteneur ("permission denied").
RUN mkdir -p /home/vscode/.claude /home/vscode/.docker \
    && chown -R vscode:vscode /home/vscode/.claude /home/vscode/.docker
