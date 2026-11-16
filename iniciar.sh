#!/usr/bin/env bash
# Mac / Linux: ./iniciar.sh
cd "$(dirname "$0")" || exit 1
echo "ACADEMIA VERITAS UNICLASS"
if ! command -v node >/dev/null 2>&1; then
  echo "[ERRO] Node.js não encontrado. Instale a versão LTS em https://nodejs.org"; exit 1
fi
MAJ=$(node -p "process.versions.node.split('.')[0]")
if [ "$MAJ" -lt 20 ]; then echo "[ERRO] Node $MAJ é antigo. Instale a versão LTS em https://nodejs.org"; exit 1; fi
[ -d node_modules ] || npm install --no-audit --no-fund || { echo "[ERRO] Instalação falhou."; exit 1; }
( sleep 8; (command -v open >/dev/null && open http://localhost:3000/inicio) || xdg-open http://localhost:3000/inicio >/dev/null 2>&1 ) &
npm run dev
