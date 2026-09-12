# Rapport d'Expérience T009 : Performance du Script Ping

## 1. HYPOTHESIS
L'utilisation de `sys.stdout.write` au lieu de `print` permet d'exécuter le script `ping.py` plus rapidement.

## 2. COUNTER_HYPOTHESIS
La différence de temps d'exécution est imperceptible pour un script d'une seule ligne, et `print` pourrait même être optimisé par l'interpréteur Python au même niveau.

## 3. PROTOCOL & DATASET
- Script original (`ping.py`) : `print("Pong")`
- Script alternatif (`ping_sys.py`) : `import sys; sys.stdout.write("Pong\n")`
- Environnement : Windows, Python 3.
- Mesure : Boucle de 100 itérations chronométrée.

## 4. RAW_RESULTS
- `print` : 0.041s pour 100 itérations
- `sys.stdout.write` : 0.040s pour 100 itérations

## 5. ANALYSIS
La différence de temps (0.001s) est statistiquement non significative et tombe dans la marge d'erreur du système d'exploitation (bruit de fond). L'overhead de l'import de la librairie `sys` annule tout gain théorique sur un petit script.

## 6. DECISION
**KILL**
L'hypothèse est rejetée. Nous conservons le script original utilisant `print` car il est plus lisible et n'a aucun impact négatif sur la performance dans ce contexte.
