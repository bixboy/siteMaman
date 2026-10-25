---
name: publier
description: Mettre en ligne sur www.main-e-merveille.fr les changements de la branche Work (fusion dans main, envoi FTP vers OVH, vérification). À utiliser seulement quand l'utilisateur demande explicitement de publier.
---

# Publier le site

Un push sur `main` met le site en ligne : **demander une confirmation explicite** juste avant l'étape 4,
même si la publication a été demandée plus tôt. Git : `git -c http.sslBackend=schannel push` sur ce poste.

1. Être sur `Work`, arbre propre (`git status`), `Work` poussé sur GitHub.
2. `npm test` doit finir par « tests OK ».
3. Lister ce qui sera publié : `git log --oneline origin/main..Work`.
4. Après confirmation : `git switch main`, `git merge --ff-only Work` (sinon `git merge Work`),
   `git push origin main`, `git switch Work`.
5. Suivre le workflow « Publication » (dépôt public, sans authentification) :
   `https://api.github.com/repos/bixboy/siteMaman/actions/runs?branch=main&per_page=1` jusqu'à
   `status: completed`. En cas d'échec, l'erreur est dans les annotations du job
   (`/check-runs/<job_id>/annotations`).
6. Vérifier en ligne : `curl -I` sur `https://www.main-e-merveille.fr/`, une page modifiée, et les redirections
   `http://main-e-merveille.fr/` → `https://www.main-e-merveille.fr/` (301).

Prérequis (une seule fois) : secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` dans l'environnement GitHub
`github-pages` (Settings → Environments) et déploiement
Git désactivé dans OVH. S'ils ne sont pas confirmés, s'arrêter : sinon OVH publierait le code source et le
site tomberait.
