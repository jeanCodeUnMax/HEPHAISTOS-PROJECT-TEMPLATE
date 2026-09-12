# 🧠 HEPHAISTOS SYSTEM - MANIFESTE DE CONSCIENCE (ARCHITECTURE)

Ce document sert de "Single Source of Truth" (Source de Vérité Unique) pour l'orchestration multi-agents du projet `chien-de-la-casse`. Tous les agents (humains ou IA) doivent s'aligner sur ces principes avant toute exécution.

## 1. ORCHESTRATION : LE MODÈLE "PULL"
- **Pas de Micro-Management** : Le système fonctionne via un Kanban asynchrone (dossier `.hephaistos/tasks/`).
- **Autonomie** : Chaque agent consulte l'état des tâches et s'attribue la prochaine tâche `TODO` correspondant à son profil et dont les dépendances (`dependencies`) sont résolues (`DONE`).
- **Mutex (Verrous)** : Pour éviter les collisions, dès qu'une tâche commence, elle passe en `IN_PROGRESS` et est verrouillée via l'identifiant de l'agent (champ `assigned_to`).

## 2. RÔLES ET SÉPARATION DES POUVOIRS
- **Agents d'Exécution (Codeurs)** : Sont autorisés à écrire du code source (`game.js`, `style.css`, etc.) durant la phase `EXEC`.
- **Agents d'Inspection (Auditeurs/Debuggers)** : N'écrivent **aucun code applicatif**. Leur rôle est exclusif à la revue de code, la validation RAG, l'escalade d'erreurs et la sécurité.
- **Le Watchdog (Garde-frontière)** : Le script git-hook qui bloque tout commit si la phase n'est pas `EXEC`.

## 3. TRAÇABILITÉ DES TÂCHES
Chaque fichier de tâche (ex: `T003.yaml`) contient le registre d'état de l'action :
- `dependencies` : Graphe des tâches requises (DAG) pour charger correctement le contexte.
- `assigned_to` : Le profil mandaté.
- `authored_by` : L'identité réelle de l'entité ayant clôturé le travail.
- `decision_log` : Registre court expliquant les choix techniques critiques (pour le contexte futur).
