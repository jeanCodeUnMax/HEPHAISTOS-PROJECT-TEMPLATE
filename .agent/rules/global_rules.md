---
description: Règles et Garde-fous globaux de l'environnement Hephaistos
globs: 
alwaysApply: true
---

# 🛑 GARDE-FOUS ET DISCIPLINE HEPHAISTOS

Ce document dicte les règles absolues et interdictions strictes pour préserver l'intégrité de l'environnement de développement et assurer une amélioration continue.

## 1. GARDE-FOUS DE DÉPENDANCES ET D'ENVIRONNEMENT
- **Audit Obligatoire (Check First)** : Ne jamais exécuter de script d'installation (`npm install`, `pip install`, `apt-get`) sans avoir d'abord prouvé l'absence de l'outil via une commande de diagnostic (ex: `node -v`, `psql --version`).
- **Isolation Stricte** : Les installations globales (flag `-g` ou hors environnement virtuel) sont **STRICTEMENT INTERDITES** sans accord explicite de l'humain.
- **Conteneurisation** : Pour les services lourds (Bases de données, caches), les agents doivent privilégier l'usage de conteneurs isolés (Docker) afin de ne pas polluer l'hôte pour les futurs projets.

## 2. PROTOCOLE D'ESCALADE (ANTI DOOM-LOOP)
- **Circuit Breaker** : Si un agent échoue à résoudre une erreur (tests unitaires, compilation) plus de 3 fois d'affilée, il DOIT cesser de modifier le code.
- **Escalade** : L'agent passe la tâche en état de diagnostic, rédige un rapport d'échec, et invoque (ou simule l'appel) d'un agent de profil Debugger/Auditeur.
- **Résolution** : Le Debugger doit s'appuyer sur la mémoire externe (Base de données RAG de l'entreprise ou Recherche Web) pour trouver une solution, avant de rendre la main au codeur.

## 3. APPRENTISSAGE CONTINU
- Toute résolution d'un bug majeur ou d'une erreur systémique issue d'un agent doit faire l'objet d'un recadrage positif.
- Les leçons apprises ne doivent pas surcharger le *System Prompt* de l'agent. Elles doivent être refactorisées et centralisées sous forme de "règles de fonctionnalités" communes à tous.
