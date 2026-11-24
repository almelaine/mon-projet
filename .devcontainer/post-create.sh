#!/usr/bin/env bash
# Execute une fois, apres la creation du conteneur (postCreateCommand).
# Installe les dependances Python via uv (tous les projets du gabarit ont un
# pyproject.toml - voir pyproject.toml a la racine) et, si present,
# package.json -> npm ci / npm install (+ Playwright si declare).
set -e

# ---------------------------------------------------------------------------
# Droits des volumes nommes. Les cibles existent dans l'image et appartiennent
# deja a vscode (Dockerfile) ; ce for couvre les volumes crees en root sur un
# poste anterieur a ce correctif, et le cas ou le script est rejoue a la main.
# ---------------------------------------------------------------------------
for d in "$HOME/.claude" "$HOME/.docker"; do
  [ -d "$d" ] && sudo chown -R vscode:vscode "$d" || true
done

# ---------------------------------------------------------------------------
# Git : le depot est un montage de l'hote et peut apparaitre comme appartenant
# a root vu d'ici, alors que nous tournons en "vscode". Sans cette exception,
# git refuse d'operer ("detected dubious ownership") et GitLens echoue en
# silence. Idempotent.
# ---------------------------------------------------------------------------
git config --global --add safe.directory "$PWD" 2>/dev/null || true

# ---------------------------------------------------------------------------
# Dependances Python : environnement .venv local, versions figees dans uv.lock.
# ---------------------------------------------------------------------------
uv sync --all-extras

# ---------------------------------------------------------------------------
# Dependances Node.js : a la racine et dans chaque application de premier
# niveau (depot multi-applications). npm ci si un lock
# existe (reproductible, comme la CI), npm install sinon.
# ---------------------------------------------------------------------------
for pkg in package.json */package.json; do
  [ -f "$pkg" ] || continue
  dir=$(dirname "$pkg")
  case "$dir" in node_modules|*/node_modules) continue ;; esac
  echo "npm : $dir"
  if [ -f "$dir/package-lock.json" ]; then
    npm ci --prefix "$dir" --no-audit --no-fund
  else
    npm install --prefix "$dir" --no-audit --no-fund
  fi
done

# Verification visuelle dans un vrai navigateur (npm run test:visuel). Chromium sans interface (--only-shell) et ses
# bibliotheques systeme, installes par Playwright lui-meme.
if [ -f package.json ] && grep -q '"@playwright/test"' package.json; then
  npx playwright install --with-deps --only-shell chromium
fi

# ---------------------------------------------------------------------------
# Bandeau.
# ---------------------------------------------------------------------------
echo ""
echo "=================================================="
echo " mon-projet - environnement de developpement"
echo "=================================================="
python --version
uv --version
node --version
npm --version
sqlite3 --version 2>/dev/null | cut -d' ' -f1 || true
docker --version
claude --version 2>/dev/null || echo "claude : CLI absent (feature claude-code non installee ?)"

echo ""
echo "Rappels :"
echo "  1. Copier .env.example vers .env et le renseigner (jamais versionne)."
echo "  2. Interpreteur Python : .venv/bin/python, cree par uv sync."
echo "     Voir devcontainer.json."
echo "  3. docker compose ... s'execute directement ICI, dans ce conteneur"
echo "     (Docker-in-Docker) : aucune commande Docker n'est necessaire sur le"
echo "     poste hote."
echo ""
