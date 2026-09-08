# HEPHAISTOS PROJECT TEMPLATE

Template canonique pour créer des projets pilotés par LLM/agents avec **anti-dérive, anti-amnésie, graphe de tâches déterministe, preuves, protocole scientifique et contrôle Git**.

L’objectif est simple : éviter qu’un modèle, un agent ou un humain perde le fil du projet après plusieurs itérations, saute des étapes, oublie des dépendances ou considère une tâche comme terminée sans validation objective.

Le template reste volontairement **neutre** tant qu’il n’est pas instancié :

```text
status = UNINITIALIZED
```

Un vrai projet est créé seulement avec :

```powershell
.\hephaistos init --name "MON-PROJET" --mission "Décrire la mission"
```

---

## 1. Présentation

HEPHAISTOS PROJECT TEMPLATE fournit un socle réutilisable pour démarrer un nouveau dépôt avec un cadre de travail déjà structuré.

Il combine quatre couches complémentaires.

### 1.1 `.agent/` — cadrage du LLM dans l’IDE

Le dossier `.agent/` contient les règles et skills destinées aux agents/LLM du workspace :

- règles globales de fonctionnement ;
- anti-dérive ;
- anti-amnésie ;
- brainstorming ;
- génération de PRD ;
- découpage milestones / tâches / sous-tâches ;
- développement ;
- protocole scientifique ;
- preuves et ledger ;
- usage des tools/MCP ;
- récupération de contexte ;
- revue et clôture.

Le LLM n’est donc pas seulement invité à « rester discipliné » : il reçoit un contrat de fonctionnement explicite.

### 1.2 HEPHAISTOS CLI — task manager du terminal

Le CLI sert d’interface opérationnelle quotidienne.

Il peut notamment :

- afficher les tâches ;
- montrer la tâche active ;
- vérifier les dépendances ;
- empêcher un saut hors séquence ;
- contrôler les preuves attendues ;
- lancer une tâche ;
- vérifier une tâche ;
- demander sa clôture ;
- synchroniser le MASTER ;
- initialiser un nouveau projet.

### 1.3 Git Watchdog — garde-fou local

Le watchdog Git intervient au niveau du dépôt :

- `pre-commit` ;
- `commit-msg` ;
- `pre-push`.

Il sert de dernier verrou avant inscription dans l’historique Git.

Il peut vérifier notamment :

- cohérence de l’état du projet ;
- présence des sections obligatoires ;
- conflits Git ;
- cohérence du commit avec la tâche active ;
- validations configurées ;
- présence de preuves attendues selon le profil.

### 1.4 `.hephaistos/` — état structuré du projet

Le dossier `.hephaistos/` contient la source de vérité machine :

```text
.hephaistos/
├── project.yaml
├── state.yaml
├── ledger.jsonl
├── tasks/
└── schemas/
```

Git conserve l’historique.  
Le CLI pilote le travail.  
Le watchdog contrôle les transitions Git.  
Les règles `.agent` cadrent le LLM.

---

## 2. Objectifs

### 2.1 Anti-amnésie

La conversation n’est pas la source de vérité.

Le système doit conserver explicitement :

- mission ;
- PRD ;
- hypothèses ;
- expériences ;
- tâches ;
- sous-tâches ;
- dépendances ;
- preuves ;
- résultats négatifs ;
- décisions ;
- prochaines actions ;
- backlog ;
- historique des transitions.

Après une interruption, un changement d’IDE ou un changement de modèle, le projet doit être récupérable depuis le repo.

### 2.2 Anti-dérive

Une tâche ne devient exécutable que lorsque ses prérequis sont satisfaits.

Exemple :

```text
T001 = DONE
T002 = ACTIVE
T003 = BLOCKED
```

Si un agent tente T003 avant T002 :

```text
ORDER VIOLATION
Requested: T003
Missing prerequisite: T002
Expected next task: T002
```

Les idées latérales ne sont pas perdues : elles sont classées en `SUPPORT`, `BACKLOG`, `NEW_HYPOTHESIS` ou `REJECTED`.

### 2.3 Validation objective

Une tâche n’est jamais `DONE` uniquement parce qu’un modèle affirme qu’elle est terminée.

La validation repose sur des éléments vérifiables :

- fichiers attendus ;
- sorties ;
- tests ;
- logs ;
- preuves ;
- dépendances ;
- critères `done_when` ;
- contrôle du CLI ;
- contrôle du watchdog.

Le LLM propose et analyse. Le moteur déterministe décide les transitions d’état.

### 2.4 Reproductibilité scientifique

Pour les travaux expérimentaux, le template encourage la conservation de :

- hypothèse ;
- raison de l’hypothèse ;
- effet attendu ;
- contre-hypothèse ;
- protocole ;
- baseline ;
- dataset ;
- métriques ;
- environnement ;
- manifest d’exécution ;
- résultats bruts ;
- analyse ;
- signaux inattendus ;
- conclusion ;
- décision `KEEP / MODIFY / KILL / INCONCLUSIVE`.

---

## 3. Avantages

### Pour le développement

- moins de tâches oubliées ;
- meilleure granularité ;
- dépendances explicites ;
- commits liés à des unités de travail ;
- validation avant push ;
- réduction des refactors hors sujet ;
- meilleure reprise après interruption ;
- historique technique plus lisible.

### Pour les LLM / agents

- contexte actif explicite ;
- une tâche active par défaut ;
- impossibilité de changer silencieusement d’objectif ;
- backlog pour les idées latérales ;
- protocole commun entre plusieurs modèles et IDE ;
- récupération du contexte à partir du repo plutôt que de la mémoire conversationnelle ;
- séparation claire entre raisonnement et état.

### Pour la recherche

- hypothèses versionnées ;
- résultats négatifs conservés ;
- distinction `REAL / SYNTHETIC / MOCK` ;
- preuves reproductibles ;
- historique des décisions ;
- séparation entre découverte et validation ;
- meilleure traçabilité des expériences.

### Pour les projets clients

Le même moteur peut être spécialisé pour des workflows métier.

Exemple logiciel :

```text
PRD
→ DEV
→ TEST
→ VALIDATION
→ LIVRAISON
→ ACCEPTATION
```

Exemple commercial :

```text
DEVIS
→ SIGNATURE
→ ACOMPTE
→ PRODUCTION
→ VALIDATION CLIENT
→ LIVRAISON
```

Les étapes deviennent des états vérifiables plutôt qu’une simple checklist informelle.

---

## 4. Principe général de fonctionnement

```text
IDÉE / BESOIN
      ↓
BRAINSTORM
      ↓
PRD
      ↓
DÉCOMPOSITION
      ↓
MILESTONES
      ↓
TASKS / SUBTASKS
      ↓
GRAPHE DE DÉPENDANCES
      ↓
TASK_ACTIVE
      ↓
EXÉCUTION
      ↓
PREUVES / TESTS / LOGS
      ↓
HEPHAISTOS CHECK
      ↓
HEPHAISTOS FINISH
      ↓
WATCHDOG GIT
      ↓
COMMIT / PUSH
      ↓
TASK SUIVANTE
```

---

## 5. Hiérarchie recommandée

```text
PROJECT
└── MILESTONE
    └── TASK
        └── SUBTASK
            └── CHECK / EVIDENCE
```

### TASK

Une `TASK` représente un résultat indépendamment vérifiable.

Exemple :

```text
T002 — Capturer les hidden states par layer
```

### SUBTASK

Une `SUBTASK` représente une étape interne nécessaire à la tâche.

Exemple :

```text
T002.1 charger le modèle
T002.2 installer les hooks
T002.3 exécuter le dataset
T002.4 sauvegarder les activations
T002.5 vérifier les dimensions
```

Une sous-tâche devient une TASK indépendante seulement si elle possède son propre résultat, ses propres dépendances ou son propre cycle de validation.

---

## 6. Structure du template

```text
.
├── .agent/
│   ├── rules/
│   └── skills/
│
├── .hephaistos/
│   ├── project.yaml
│   ├── state.yaml
│   ├── ledger.jsonl
│   ├── tasks/
│   └── schemas/
│
├── .githooks/
│   ├── pre-commit
│   ├── commit-msg
│   └── pre-push
│
├── scripts/
│   ├── hephaistos/
│   └── watchdog/
│
├── docs/
│   └── master/
│       └── PROJECT_MASTER.md
│
├── evidence/
├── .watchdog.json
├── .gitignore
├── hephaistos.cmd
├── hephaistos.ps1
├── install-hephaistos.ps1
├── install-hephaistos.sh
└── README.md
```

---

## 7. Source de vérité

Ordre recommandé :

1. `.hephaistos/project.yaml`
2. `.hephaistos/tasks/`
3. `.hephaistos/state.yaml`
4. `.hephaistos/ledger.jsonl`
5. `docs/master/PROJECT_MASTER.md`
6. Git
7. conversation

`PROJECT_MASTER.md` est une **vue humaine synchronisée**, pas la base de données principale.

---

## 8. Rôle du PROJECT_MASTER

`docs/master/PROJECT_MASTER.md` doit permettre à un humain de savoir immédiatement :

- quelle est la mission ;
- quelle hypothèse est active ;
- quelle expérience est active ;
- quelle tâche est active ;
- quel est le critère de succès ;
- quelle est la dernière conclusion ;
- quelle est la prochaine action ;
- quels sujets sont au backlog.

Question à laquelle il doit répondre :

> Où sommes-nous ? Que faisons-nous maintenant ? Qu’est-ce qui vient après ? Qu’est-ce qui est volontairement laissé de côté ?

---

## 9. Créer un nouveau repo depuis ce template

Sur GitHub :

1. ouvrir ce dépôt ;
2. activer **Settings → General → Template repository** si nécessaire ;
3. utiliser **Use this template** ;
4. créer le nouveau dépôt.

Le nouveau repo possède son propre historique indépendant.

Le template lui-même reste neutre.

---

## 10. Initialiser un nouveau projet

Dans le nouveau repo :

```powershell
.\hephaistos init --name "MON-PROJET" --mission "Décrire la mission"
```

L’initialisation transforme l’état :

```text
UNINITIALIZED
→ INITIALIZED
```

À ce stade, le projet possède une identité réelle mais pas encore nécessairement son graphe de tâches final.

---

## 11. Brainstorm → PRD → découpage

### Étape 1 — Brainstorm

Transformer l’idée brute en options, contraintes, hypothèses et risques.

Les idées non retenues sont conservées comme :

- `SUPPORT`
- `BACKLOG`
- `NEW_HYPOTHESIS`
- `REJECTED`

### Étape 2 — PRD

Le PRD doit formaliser au minimum :

- problème ;
- utilisateurs / acteurs ;
- objectifs ;
- non-objectifs ;
- exigences fonctionnelles ;
- exigences non fonctionnelles ;
- contraintes ;
- livrables ;
- risques ;
- critères de succès ;
- critères d’acceptation ;
- inconnues restantes.

### Étape 3 — Décomposition

Transformer le PRD en :

```text
Milestones
→ Tasks
→ Subtasks
→ Dependencies
→ Inputs
→ Outputs
→ Tests
→ Evidence
→ done_when
```

### Règle centrale

Une tâche est valide seulement si son état de fin peut être vérifié objectivement.

Éviter :

```text
T007 — améliorer le système
```

Préférer :

```text
T007 — implémenter l’extraction des hidden states
```

avec outputs, tests, preuves et critères `done_when`.

---

## 12. Format logique d’une tâche

Exemple :

```yaml
id: T002
title: Capture hidden states
milestone: M01
objective: Capture the hidden state of each transformer layer.
status: PENDING

depends_on:
  - T001

subtasks:
  - Implement capture hook
  - Run baseline dataset
  - Validate tensor shapes

inputs:
  - config/model.yaml
  - data/baseline.jsonl

outputs:
  - src/probes/hidden_states.py
  - results/T002/

tests:
  - tests/test_hidden_states.py

evidence:
  - evidence/T002/run_manifest.json
  - evidence/T002/shapes.json
  - evidence/T002/execution.log

done_when:
  - all expected layers captured
  - tensor shapes valid
  - execution exit code zero
  - required evidence present
```

---

## 13. Mode d’emploi quotidien

### Voir la roadmap opérationnelle

```powershell
.\hephaistos tasks
```

Exemple :

```text
✅ T001  DONE     Baseline model and dataset
▶ T002  ACTIVE   Capture hidden states
🔒 T003  BLOCKED  Compute first layer metrics
```

### Voir ce qu’il faut faire maintenant

```powershell
.\hephaistos status
```

### Démarrer une tâche autorisée

```powershell
.\hephaistos start T002
```

### Vérifier une tâche

```powershell
.\hephaistos check T002
```

### Demander la clôture

```powershell
.\hephaistos finish T002
```

`finish` n’est pas une déclaration de succès.

C’est une **demande de validation**.

Si les conditions sont satisfaites :

```text
✅ T002 DONE
➡ T003 ACTIVE
📝 MASTER synced
```

Sinon, la tâche reste active.

---

## 14. Cycle Git recommandé

Après validation d’une tâche :

```powershell
git add .
git status
git commit -m "T002: capture hidden states completed"
git push
```

Le watchdog intervient avant commit/push.

Le repo template lui-même n’utilise pas de faux `T001` métier : les IDs de tâches concernent les projets instanciés à partir du template.

---

## 15. Protocole scientifique

Pour une expérience scientifique, conserver si applicable :

```text
HYPOTHESIS
WHY
EXPECTED_EFFECT
COUNTER_HYPOTHESIS
PROTOCOL
BASELINE
DATASET
MEASUREMENTS
ENVIRONMENT
EXECUTION_MANIFEST
RAW_RESULTS
ANALYSIS
UNEXPECTED_SIGNALS
CONCLUSION
DECISION
NEXT_ACTION
```

### Décision finale

Chaque expérience conclue doit aboutir à :

- `KEEP`
- `MODIFY`
- `KILL`
- `INCONCLUSIVE`

### Classes de données

Distinguer explicitement :

- `REAL`
- `SYNTHETIC`
- `MOCK`

Un mock ne peut pas servir de preuve expérimentale réelle.

Les données synthétiques peuvent tester le pipeline ou servir de contrôle, mais doivent rester explicitement étiquetées.

### Résultats négatifs

Les résultats négatifs ou nuls sont des résultats scientifiques à part entière.

Ils ne doivent pas être supprimés parce qu’ils contredisent l’hypothèse initiale.

---

## 16. Usage des tools / MCP

Lorsqu’une tâche utilise un outil externe, MCP, API ou connecteur, enregistrer lorsque pertinent :

- nom de l’outil ;
- raison de son utilisation ;
- entrée importante ;
- sortie importante ou référence ;
- statut d’exécution ;
- preuve associée.

Un agent ne doit jamais prétendre avoir utilisé un outil qui n’a pas réellement été invoqué.

---

## 17. Règles anti-dérive

Par défaut : une seule TASK active.

Une tâche peut être exécutée seulement si ses dépendances obligatoires sont satisfaites.

Des tâches parallèles sont possibles uniquement si le graphe les déclare indépendantes.

Si une nouvelle idée apparaît pendant une tâche :

```text
ACTIVE TASK
   ↓
nouvelle idée
   ↓
SUPPORT / BACKLOG / NEW_HYPOTHESIS / REJECTED
   ↓
retour ACTIVE TASK
```

L’idée n’est pas perdue, mais elle ne prend pas le contrôle du projet.

---

## 18. Récupération de contexte / anti-amnésie

Après une interruption, un changement de session ou un changement de modèle, l’agent doit reconstruire le contexte dans cet ordre :

```text
project.yaml
→ tasks/
→ state.yaml
→ ledger.jsonl
→ PROJECT_MASTER.md
→ Git
→ conversation
```

Il doit pouvoir résumer :

- mission ;
- tâche active ;
- prérequis terminés ;
- critères encore manquants ;
- prochaine action ;
- backlog pertinent.

---

## 19. Philosophie

HEPHAISTOS ne cherche pas à rendre un LLM « plus discipliné » uniquement par prompt.

Il externalise la discipline dans une structure vérifiable :

```text
Rules
+ Skills
+ State
+ Dependencies
+ Evidence
+ CLI
+ Watchdog
+ Git
```

La mémoire du projet devient explicite, versionnée et contrôlable.

Le principe fondamental est :

> Le LLM propose, raisonne, implémente et analyse. Le moteur déterministe contrôle l’ordre, les dépendances, les preuves et l’état DONE.

---

## 20. Statut

Ce dépôt sert de **template canonique** pour les futurs projets HEPHAISTOS / SKG et pour tout projet nécessitant :

- orchestration LLM/agent ;
- workflow anti-dérive ;
- gestion de tâches déterministe ;
- protocole scientifique ;
- preuves et traçabilité ;
- intégration Git ;
- récupération robuste après interruption.

### V1 canonique

La V1 inclut :

- template neutre `UNINITIALIZED` ;
- `.agent` rules + skills ;
- CLI HEPHAISTOS ;
- `hephaistos init` ;
- graphe de tâches dans `.hephaistos/tasks/` ;
- watchdog Git ;
- MASTER synchronisé ;
- evidence ;
- ledger ;
- installateurs Windows/Linux ;
- source de vérité unique `.hephaistos/`.
