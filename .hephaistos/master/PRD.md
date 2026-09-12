# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Description du Produit
Un clone d'Arkanoid avec une DA Cyberpunk (néon, sombre, glitch). Le joueur contrôle une raquette en bas de l'écran (souris ou touches directionnelles) et doit faire rebondir une balle pour détruire un mur de briques.

## 2. Fonctionnalités Détaillées (Features)
1. **Rendu Visuel** :
   - Fond noir/sombre avec grille de perspective type "synthwave".
   - Raquette : Barre horizontale bleu cyan ou magenta néon (avec glow).
   - Balle : Sphère lumineuse blanche/jaune brillante.
   - Briques : Blocs avec différentes couleurs néon.
2. **Mécaniques de Jeu** :
   - La balle rebondit selon l'angle d'impact sur la raquette.
   - La raquette reste cantonnée aux bords de l'écran.
   - Si la balle touche le fond bas de l'écran, le joueur perd (Game Over).
   - Si toutes les briques sont détruites, le joueur gagne (You Win).
3. **Contrôles** :
   - Le mouvement de la souris contrôle la position X de la raquette.

## 3. Interfaces (UI/UX)
- Écran unique avec le canvas centré (ex: 800x600 px).
- Score affiché en police "monospace" ou pixel-art en haut de l'écran.
- Messages "Game Over" / "You Win" en superposition, effet glitch.

## 4. Métriques et Validation
- **Succès si** : Le jeu tourne sans lag à 60 FPS, les rebonds sont consistants, les couleurs respectent la thématique.

> **Action :** Phase de PRD terminée. Prêt pour le Plan.
