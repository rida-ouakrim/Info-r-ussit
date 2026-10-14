# -*- coding: utf-8 -*-
"""
Script de création et intégration du cours Multimédia :
- 100% en Français (pas de bilingue / arabe)
- Contenu universel adapté aux Concours d'État (Ministères, Offices, Ingénieurs, Techniciens) et au partage académique
- Pas de mention de CRMEF ou d'enseignement
- Couvre : Image numérique, Son numérique, Vidéo numérique, Post-production vidéo (Q19), Débits & Formats
- Illustrations pédagogiques Nano Banana intégrées
"""

import json
import sqlite3
import os

COURSE_TITLE = "Technologies du Multimédia : Image, Son, Vidéo & Post-Production"
SUBDOMAIN = "LOG_OFFICE"

CONTENT_FR = r"""# Technologies du Multimédia : Image, Son, Vidéo & Post-Production

Le **multimédia** désigne la convergence, l'intégration synchrone et le traitement interactif de différents médias numériques : **le texte, l'image (fixe ou vectorielle), le son (voix, musique, effets sonores) et la vidéo**.

Ce module constitue un socle fondamental dans les évaluations informatiques, les concours de recrutement d'ingénieurs et techniciens d'État ainsi que dans la gestion de projets audiovisuels et numériques :
1. **L'image numérique** : distinction matricielle vs vectorielle, définition, résolution (DPI/PPI), profondeur de couleur, calculs de taille brute et compression.
2. **Le son numérique** : numérisation CAN (échantillonnage temporel, théorème de Nyquist-Shannon, quantification d'amplitude), traitement sonore, distorsion harmonique et calculs de taille audio.
3. **La vidéo numérique & l'animation** : cadencement (FPS), compression intra/inter-images, débit binaire (*bitrate*), notion de keyframe (*image-clé*).
4. **Le cycle de production vidéo & la Post-Production** : les 3 phases majeures (Pré-production, Production/Tournage et **Post-production : montage, effets visuels VFX, étalonnage, mixage sonore, encodage**).

---

## 1. L'Image Numérique : Matricielle vs Vectorielle

![Comparaison Image Matricielle vs Image Vectorielle](/images/multimedia_raster_vector.jpg)

### A. L'Image Matricielle (Raster / Bitmap)
Une image matricielle est constituée d'une grille orthogonale d'éléments élémentaires indivisibles appelés **pixels** (*Picture Elements*).

- **Caractéristique fondamentale** : Une image matricielle est définie par un **nombre fixe de pixels** (déterminé par sa définition $L \times H$).
- **Définition** : Nombre total de pixels en largeur et en hauteur (exemple : $1920 \times 1080 = 2\,073\,600$ pixels).
- **Résolution (DPI / PPI)** : Densité de pixels par unité de longueur physique, exprimée en points par pouce (*Dots Per Inch* ou *Pixels Per Inch*). Un pouce équivaut exactement à $2{,}54\text{ cm}$.
  - Plus la résolution est élevée pour une même dimension physique, plus le niveau de détail est fin (ex : 72 à 96 DPI pour les écrans standards, 300 DPI pour l'impression haute définition).
  - **Sensibilité au zoom (Crénelage / Pixellisation)** : Lorsqu'on agrandit une image matricielle au-delà de sa définition native, les pixels deviennent visibles sous forme de petits carrés ; c'est le phénomène de pixellisation (effet d'escalier ou *aliasing*).

#### Profondeur de couleur (bpp : bits per pixel)
La profondeur de couleur correspond au nombre de bits alloués pour coder l'information chromatique de chaque pixel :
- **1 bit** : $2^1 = 2$ couleurs (Monochrome / Noir et Blanc).
- **8 bits** : $2^8 = 256$ nuances (Niveaux de gris ou palette de couleurs indexées).
- **16 bits** : $2^{16} = 65\,536$ couleurs (*High Color*).
- **24 bits** : $2^{24} = 16\,777\,216$ couleurs (**True Color** / Vraies couleurs RVB).
  - 3 octets par pixel : 8 bits pour le canal Rouge (R), 8 bits pour le Vert (V) et 8 bits pour le Bleu (B).
- **32 bits** : 24 bits RVB + 8 bits pour le canal **Alpha** (gestion de la transparence).

#### Formule de calcul de la taille mémoire brute d'une image matricielle
$$\text{Taille (octets)} = \frac{\text{Largeur (pixels)} \times \text{Hauteur (pixels)} \times \text{bpp}}{8}$$

> **Cas pratique** :  
> Une image non compressée de $800 \times 600$ pixels, codée en 24 bits (3 octets par pixel) :  
> $$\text{Taille} = 800 \times 600 \times 3\text{ octets} = 1\,440\,000\text{ octets} \approx 1{,}4\text{ Mo}$$

### B. L'Image Vectorielle
Une image vectorielle n'est pas constituée d'une grille de pixels, mais d'une collection d'**objets et de primitives géométriques** (points d'ancrage, segments de droites, polygones, ellipses, courbes de Bézier) définis par des **équations mathématiques et des coordonnées relatives**.

- **Propriété essentielle** : **Indépendance totale vis-à-vis de la résolution**. Une image vectorielle peut être redimensionnée, agrandie ou réduite à l'infini sans **jamais perdre en netteté ni subir de pixellisation**.
- **Utilisation bureautique et CAO** : Les formes prédéfinies insérées dans les suites bureautiques (PowerPoint, Word) et les plans d'ingénierie sont de nature **vectorielle**.
- **Formats standards** : **SVG** (*Scalable Vector Graphics*, standard ouvert pour le Web), **AI** (Adobe Illustrator), **EPS**, **PDF vectoriel**.

### C. Compression d'images : Sans perte vs Avec perte
- **Compression sans perte (Lossless)** : Réduction de la redondance des données sans altérer le moindre pixel (opération totalement réversible).
  - *Algorithmes de référence* : RLE (*Run-Length Encoding*), LZW (*Lempel-Ziv-Welch*), Codage entropique de Huffman.
  - *Formats courants* : **PNG** (supporte la transparence sur 8 bits), **GIF** (limité à 256 couleurs, gère l'animation), **TIFF**, **BMP** (non compressé).
- **Compression avec perte (Lossy)** : Élimination des variations chromatiques et des détails à haute fréquence peu perceptibles par l'œil humain (non réversible).
  - *Algorithme majeur* : **Le codage par transformation (DCT : Transformée en Cosinus Discrète)** associé à une étape de quantification.
  - *Format dominant* : **JPEG / JPG** (idéal pour la photographie et les images complexes).

### D. Traitement avancé de l'image : La segmentation
- **La segmentation d'image** désigne le processus en vision par ordinateur et traitement du signal consistant à **partitionner une image numérique en régions, segments ou objets distincts** partageant des attributs communs (intensité, texture, couleur) afin d'isoler les éléments signifiants pour l'analyse ou la reconnaissance de formes.

---

## 2. Le Son Numérique : Échantillonnage, Quantification & Traitement

![Numérisation du Son : Échantillonnage et Quantification](/images/multimedia_sound_sampling.jpg)

Le son naturel est une vibration mécanique acoustique continue (signal analogique). Sa numérisation s'effectue via un convertisseur analogique-numérique (**CAN / ADC**) suivant deux opérations complémentaires :

### A. Les étapes de la numérisation
1. **L'échantillonnage temporel (Sampling)** :
   - Prélèvement régulier de valeurs d'amplitude du signal à intervalle de temps périodique $T_e = 1 / F_e$, où $F_e$ est la **fréquence d'échantillonnage** (en Hertz).
   - **Théorème de Nyquist-Shannon** : Pour restituer fidèlement un signal continu sans phénomène de repliement spectral (*aliasing*), la fréquence d'échantillonnage doit être au moins égale au double de la fréquence maximale du signal :
     $$F_e \ge 2 \times f_{\max}$$
   - Le spectre audible de l'oreille humaine s'étendant jusqu'à environ $20\text{ kHz}$, il est nécessaire d'avoir $F_e \ge 40\text{ kHz}$. En pratique :
     - **44,1 kHz** : Standard du Compact Disc Audio (CD-DA).
     - **48 kHz / 96 kHz** : Standards professionnels de la vidéo, de la télévision et des régies sonores.

2. **La quantification d'amplitude (Quantization)** :
   - Approximation de la valeur analogique mesurée sur une échelle discrète de niveaux codés sur $n$ bits (**résolution ou profondeur en bits**).
   - Avec $n$ bits, on dispose d'un espace de $2^n$ paliers de discrétisation :
     - **8 bits** : $2^8 = 256$ niveaux (voix téléphonique).
     - **16 bits** : $2^{16} = 65\,536$ niveaux (qualité CD Audio).
     - **24 bits** : $2^{24} = 16\,777\,216$ niveaux (qualité studio haute résolution).

### B. Formule de calcul de la taille d'un fichier audio brut (PCM / WAV)
$$\text{Taille (octets)} = \frac{F_e (\text{Hz}) \times \text{Résolution (bits)} \times \text{Nombre de canaux} \times \text{Durée (secondes)}}{8}$$
- **Nombre de canaux** : **Mono = 1 canal**, **Stéréo = 2 canaux** (voies gauche et droite), **5.1 = 6 canaux**.

#### Exemples de dimensionnement :
> **Exemple 1 (Son stéréo CD)** :  
> Taille occupée par **1 minute** ($60\text{ s}$) de son **stéréo** (2 voies), codée sur **16 bits** à **44,1 kHz** ($44\,100\text{ Hz}$) :  
> $$\text{Taille} = \frac{44\,100 \times 16 \times 2 \times 60}{8} = 44\,100 \times 2 \times 2 \times 60 = 10\,584\,000\text{ octets} \approx 10\text{ Mo}$$

> **Exemple 2 (Son mono)** :  
> Fichier audio **mono** (1 voie), durée de **512 secondes**, fréquence de **1 kHz** ($1\,000\text{ Hz}$), codage sur **16 bits** (2 octets) :  
> $$\text{Taille} = 1\,000 \times 2 \times 1 \times 512 = 1\,024\,000\text{ octets} \approx 1\,000\text{ Ko}$$

### C. Effets et traitement du signal sonore
- **La Distorsion audio** : Altération non linéaire de la forme d'onde sonore (liée à une saturation ou un écrêtage du signal). Sa caractéristique fondamentale est qu'elle **ajoute de nouvelles harmoniques au son** d'origine, enrichissant et modifiant son timbre.
- **L'Égalisation (EQ)** : Ajuste sélectivement l'amplitude de différentes plages de fréquences (basses, médiums, aigus).
- **La Réverbération** : Simule les réflexions acoustiques multiples d'un espace architectural (pièce, salle de spectacle).
- **La Compression dynamique** : Réduit l'écart entre les niveaux sonores les plus faibles et les plus élevés pour homogénéiser le volume.

---

## 3. La Vidéo Numérique & la Chaîne de Production Audiovisuelle

![Les 3 Grandes Étapes de la Production Vidéo](/images/multimedia_video_pipeline.jpg)

### A. Les 3 Grandes Étapes de la Production Vidéo
Toute réalisation vidéo professionnelle s'articule autour d'un pipeline séquentiel structuré en 3 étapes :

#### 1. La Pré-production (Conception & Planification)
Phase préparatoire en amont du tournage :
- Écriture du scénario, du synopsis et de la note d'intention.
- Conception du découpage technique et du **story-board** (scénarimage sous forme de planches séquentielles).
- Repérage des lieux de tournage, casting des comédiens, budget et calendrier de production.

#### 2. La Production / Tournage (Captation sur le plateau)
Phase de captation opérationnelle :
- Enregistrement des flux visuels par les caméras numériques.
- Prise de son direct (microphones cravates, perches, captation d'ambiance).
- Gestion de l'éclairage de plateau et direction des acteurs.

#### 3. La Post-production (Finalisation, Montage & Effets)
> **Définition standard** :  
> **La post-production vidéo est l'étape de production au cours de laquelle le montage et les effets visuels sont ajoutés.**

Elle englobe toutes les opérations techniques et artistiques réalisées après la fin du tournage :
1. **Dérushage & sélection** : Visionnage critique des prises brutes (*rushes*) et indexation des séquences retenues.
2. **Montage vidéo non linéaire (NLE)** : Assemblage chronologique et découpe des plans sur la piste temporelle (*timeline*).
   - **Propriété clé du montage non linéaire** : L'édition s'effectue dans **n'importe quel ordre sans modifier les fichiers sources originaux** (montage non destructif).
3. **Effets visuels numériques (VFX) & Compositing** : Incrustation sur fond vert (*chroma key*), titrage animé, masquage et trucages vidéo.
4. **Animation par Keyframes (Images-clés)** : Un **keyframe** est un **point de repère temporel qui marque une étape clé d'une animation** (position, rotation, échelle, opacité) ; le moteur calcule automatiquement l'interpolation entre deux images-clés.
5. **Étalonnage colorimétrique (*Color Grading*)** : Harmonisation des teintes, réglage de la dynamique lumineuse et création d'une identité visuelle homogène.
6. **Mixage et sonorisation** : Nettoyage des pistes vocales, ajout des bruitages, musiques et voix off, égalisation et mastering audio.
7. **Exportation & Encodage final** : Compression selon le format conteneur et le codec adapté à la diffusion.

---

## 4. Codecs, Conteneurs, Débits et Formules Vidéo

![Comparaison des Formats Multimédia, Compression et Débits](/images/multimedia_formats_codecs.jpg)

### A. Distinction fondamentale : Conteneur vs Codec
- **Le Conteneur (Wrapper / Enveloppe)** : Fichier conteneur qui encapsule et synchronise au sein d'un même fichier le flux vidéo, les pistes audio, les sous-titres et les métadonnées.
  - *Formats conteneurs usuels* : **.mp4**, **.mkv** (Matroska), **.avi**, **.mov** (Apple QuickTime), **.webm**.
- **Le Codec (Coder-Decoder)** : Algorithme mathématique chargé de **compresser** les flux bruts lors de l'enregistrement et de les **décompresser** lors de la lecture.
  - *Codecs vidéo majeurs* :
    - **H.264 / AVC** : Standard le plus universellement compatible.
    - **H.265 / HEVC** : Haute efficacité, offrant une économie d'environ **50% de débit** par rapport au H.264 à qualité perçue égale (standard de la 4K).
    - **AV1** : Codec ouvert, moderne et libre de droits soutenu par l'alliance AOMedia.
    - **Apple ProRes / Avid DNxHD** : Codecs de travail intra-image optimisés pour le montage en post-production.

### B. Calcul de la taille d'une vidéo brute non compressée
$$\text{Taille (octets)} = \text{Largeur} \times \text{Hauteur} \times \text{Octets par pixel} \times \text{FPS} \times \text{Durée (secondes)}$$

> **Application numérique** :  
> Vidéo capturée en **Full HD ($1920 \times 1080$)**, profondeur de **24 bits (3 octets/pixel)**, à **30 images par seconde (FPS)**, sans compression, durée de **20 secondes** :  
> 1. Poids d'une image : $1920 \times 1080 \times 3\text{ octets} = 6\,220\,800\text{ octets} \approx 5{,}93\text{ Mio}$.  
> 2. Poids d'une seconde : $6\,220\,800 \times 30 = 186\,624\,000\text{ octets/s} \approx 178\text{ Mio/s}$.  
> 3. Poids pour 20 secondes : $186\,624\,000 \times 20 = 3\,732\,480\,000\text{ octets} \approx 3\,560\text{ Mo (en base 1024) ou } 3{,}56\text{ Go}$.

### C. Débit Binaire (Bitrate) et Capacité de Stockage
Le débit binaire (*bitrate*) mesure le flux de données numériques transmis ou enregistré par unité de temps, exprimé en **kbps** ou **Mbps** ($1\text{ Mbps} = 10^6\text{ bits/seconde}$).

$$\text{Taille (octets)} = \frac{\text{Débit binaire (bps)} \times \text{Durée (secondes)}}{8}$$
$$\text{Durée (secondes)} = \frac{\text{Capacité de stockage (bits)}}{\text{Débit binaire (bps)}} = \frac{\text{Capacité (octets)} \times 8}{\text{Débit binaire (bps)}}$$

> **Cas pratique 1** :  
> Carte mémoire de **4 Go** ($4 \times 1024^3\text{ octets}$), enregistrement vidéo à un débit de **8 Mbps** ($8 \times 10^6\text{ bits/s}$) :  
> $$\text{Durée} = \frac{4 \times 1\,073\,741\,824 \times 8\text{ bits}}{8\,000\,000\text{ bits/s}} \approx 4\,295\text{ secondes}$$

> **Cas pratique 2** :  
> Vidéo HD encodée à **4 Mbps** d'une durée de **15 minutes** ($900\text{ s}$) :  
> $$\text{Taille} = \frac{4\,000\,000 \times 900}{8} = 450\,000\,000\text{ octets} \approx 400\text{ à } 429\text{ Mo}$$

### D. Enregistrement d'écran : Le Screencast
- **Le Screencast** désigne l'enregistrement vidéo continu de l'activité visuelle affichée sur l'écran d'un ordinateur, le plus souvent enrichi d'un commentaire audio explicatif (très utilisé pour la documentation logicielle, les démonstrations de systèmes d'information et les tutoriels techniques).
"""

EXAMPLES_FR = r"""# Exercices d'Application & Questions Types Résolues

Ce recueil présente les cas pratiques et questions types fréquemment rencontrés dans les concours de recrutement d'ingénieurs et techniciens informatiques, avec leurs solutions détaillées et leurs justifications techniques.

---

### Cas Pratique 1 : La Post-Production Vidéo
**Question :** Qu'est-ce que la post-production vidéo ?  
A) L'étape de production où les scènes sont tournées  
B) L'étape de production où le montage et les effets visuels sont ajoutés  
C) L'étape de production où le son est enregistré  
D) L'étape de production où les acteurs apprennent leurs rôles  
E) Aucune des réponses ci-dessus  

✅ **Réponse correcte : B**  
**Justification technique :**  
La chaîne de production audiovisuelle est rigoureusement structurée en 3 phases chronologiques :
- **Pré-production** : écriture du scénario, synopsis, découpage technique, repérages, casting (option D).
- **Production / Tournage** : captation caméra sur le plateau, jeu d'acteurs, prise de son direct (options A et C).
- **Post-production** : phase suivant le tournage où interviennent le dérushage, le montage vidéo, la conception des effets visuels numériques (VFX), l'étalonnage colorimétrique, le mixage audio et l'encodage final.

---

### Cas Pratique 2 : Traitement Acoustique et Distorsion Sonore
**Question :** Dans le domaine du traitement du son, qu'est-ce que la distorsion du son ?  
A) Un effet qui ajoute des harmoniques au son  
B) Un effet qui modifie la balance des fréquences dans le son  
C) Un effet qui simule l'acoustique d'un espace  
D) Un effet qui réduit la dynamique du son  

✅ **Réponse correcte : A**  
**Justification technique :**  
- La distorsion altère la linéarité du signal sonore par saturation ou écrêtage (*clipping*), ce qui génère de nouvelles fréquences multiples de la fréquence fondamentale appelées **harmoniques**.
- Modifier la balance des fréquences relève de l'égaliseur (EQ - option B).
- Simuler l'acoustique d'un espace est le rôle de la réverbération (option C).
- Réduire la plage dynamique correspond au compresseur de dynamique (option D).

---

### Cas Pratique 3 : Systèmes de Montage Non Linéaire (NLE)
**Question :** Le montage non linéaire signifie que :  
A) Les modifications sont destructives et irréversibles.  
B) L'édition peut se faire dans n'importe quel ordre sans modifier le fichier source.  
C) Le montage est réalisé uniquement sur bande magnétique.  
D) Les effets sont limités à un seul type de média.  

✅ **Réponse correcte : B**  
**Justification technique :**  
Contrairement aux anciens bancs de montage analogiques linéaires sur bande magnétique qui imposaient une copie séquentielle, les logiciels de montage non linéaire sur ordinateur (NLE) permettent d'accéder instantanément à n'importe quel extrait vidéo, de déplacer librement les séquences sur la piste de montage et d'appliquer des coupes ou des effets sans jamais modifier ni écraser les fichiers sources (édition non destructive).

---

### Cas Pratique 4 : Animation Numérique et Notion de Keyframe
**Question :** Qu'est-ce que le keyframe dans l'animation ?  
A) Un dessin de base utilisé pour animer un personnage  
B) Un point de repère pour indiquer une étape clé de l'animation  
C) Un outil de contrôle de la vitesse d'animation  
D) Une technique d'animation pour ajouter des ombres et des reflets  

✅ **Réponse correcte : B**  
**Justification technique :**  
Une image-clé (*keyframe*) est un repère temporel posé sur la timeline pour fixer la valeur d'un paramètre (position, rotation, échelle, opacité) à un instant précis. L'ordinateur calcule ensuite automatiquement les images intermédiaires par interpolation numérique.

---

### Cas Pratique 5 : Dimensionnement d'un Flux Audio Stéréo CD
**Question :** La taille mémoire occupée sur un support numérique par une minute de son stéréo codée sur 16 bits et avec une fréquence d'échantillonnage de 44,1 kHz est :  
A) 2,5 Mo  
B) 5 Mo  
C) 10 Mo  
D) 20 Mo  

✅ **Réponse correcte : C**  
**Calcul pas à pas :**  
$$\text{Taille} = 44\,100\text{ Hz} \times \frac{16\text{ bits}}{8\text{ bits/octet}} \times 2\text{ canaux (stéréo)} \times 60\text{ secondes}$$
$$\text{Taille} = 44\,100 \times 2 \times 2 \times 60 = 10\,584\,000\text{ octets} \approx 10{,}09\text{ Mo} \approx 10\text{ Mo}$$

---

### Cas Pratique 6 : Image Matricielle vs Graphismes Vectoriels
**Question 1 :** Une image matricielle est caractérisée par :  
A) Une forme fixe lorsqu'on change ses dimensions  
B) Une qualité fixe lorsqu'on augmente le zoom  
C) Un nombre variable de pixels  
D) Un nombre fixe de pixels  
✅ **Réponse correcte : D** (Une image matricielle est constituée d'une grille finie avec un nombre prédéterminé et invariable de pixels).

**Question 2 :** Les formes de dessin prédéfinies dans les logiciels de présentation sont de type :  
A) Matriciel  
B) Vectoriel  
C) Sectoriel  
D) Pixiel  
✅ **Réponse correcte : B** (Les formes géométriques automatiques sont générées par des équations vectorielles).

---

### Cas Pratique 7 : Calcul de Taille d'Image Non Compressée
**Question :** La taille d'une image sans compression en 800 x 600 pixels, codée en 24 bits, est environ :  
A) 0,5 Mo  
B) 1,4 Mo  
C) 4,8 Mo  
D) 11,5 Mo  

✅ **Réponse correcte : B**  
**Calcul pas à pas :**  
- 24 bits = 3 octets par pixel.
- Nombre total de pixels = $800 \times 600 = 480\,000$ pixels.
- Taille en octets = $480\,000 \times 3 = 1\,440\,000\text{ octets}$.
- Taille en Mo $= \frac{1\,440\,000}{1\,048\,576} \approx 1{,}37\text{ Mo} \approx 1{,}4\text{ Mo}$.
"""

ASTUCES_FR = r"""# Fiche Mémo, Formules Clés et Pièges Classiques

### 1. Formulaire synthétique de dimensionnement
| Domaine | Paramètres | Formule de Calcul du Poids Brut |
| :--- | :--- | :--- |
| **Image Matricielle** | $L$ (largeur px), $H$ (hauteur px), $p$ (bits/pixel) | $\text{Taille} = \frac{L \times H \times p}{8}\text{ octets}$ |
| **Audio PCM (WAV)** | $F_e$ (Hz), $R$ (bits/échantillon), $C$ (canaux), $t$ (s) | $\text{Taille} = \frac{F_e \times R \times C \times t}{8}\text{ octets}$ |
| **Vidéo Brute** | $L \times H$, octets/px, $FPS$, durée $t$ (s) | $\text{Taille} = (\text{Poids image}) \times FPS \times t$ |
| **Flux Compressé** | Débit binaire $D$ (bits/seconde), durée $t$ (s) | $\text{Taille} = \frac{D \times t}{8}\text{ octets}$ |

---

### 2. Les 3 Pièges Classiques à Éviter
1. **La distinction Bits vs Octets (Bytes)** :
   - Les débits réseaux et vidéo s'expriment en **bits par seconde** (ex: 8 Mbps = 8 Mégabits/s).
   - Les capacités de stockage mémoire sont en **octets** (ex: 4 Go = 4 Giga-octets).
   - 👉 **Règle d'or** : Toujours diviser le débit en bits par 8 pour obtenir le volume en octets par seconde ($8\text{ Mbps} = 1\text{ Mo/s}$).

2. **Le facteur Canaux Audio (Mono vs Stéréo)** :
   - Pour un signal **mono**, le facteur canal est $C = 1$.
   - Pour un signal **stéréo**, le facteur canal est $C = 2$ (voie gauche + voie droite).

3. **Approximations décimales vs binaires** :
   - Système décimal : $1\text{ Mo} = 1\,000\text{ Ko} = 1\,000\,000\text{ octets}$.
   - Système binaire : $1\text{ Mio} = 1024\text{ Kio} = 1\,048\,576\text{ octets}$.
   - Dans les QCM, les choix de réponses diffèrent généralement d'un ordre de grandeur (facteur 10) ; calculez d'abord la valeur approchée pour sélectionner l'option correspondante.

---

### 3. Synthèse des 3 Phases de Réalisation Vidéo
- **PRÉ-PRODUCTION** : Conception intellectuelle (Scénario, Story-board, Casting, Repérages).
- **PRODUCTION** : Enregistrement sur le plateau (Caméras, Micros, Éclairage, Tournage).
- **POST-PRODUCTION** : Assemblage et finition (Dérushage, **Montage**, **Effets visuels VFX**, Étalonnage, Mixage, Encodage).
"""

MULTIMEDIA_EXAM_QUESTIONS = [
    ('2025', 'Q77'),
    ('2025', 'Q78'),
    ('2025', 'Q79'),
    ('2025', 'Q80'),
    ('2024', 'Q17'),
    ('2024', 'Q18'),
    ('2024', 'Q19'), # Post-production vidéo
    ('2024', 'Q20'),
    ('2023', 'Q62'),
    ('2023', 'Q63'),
    ('2023', 'Q64'),
    ('2022', 'Q61'),
    ('2022', 'Q62'),
    ('2022', 'Q63'),
    ('2022', 'Q68'),
    ('2021', 'Q17'),
    ('2021', 'Q22'),
    ('2020', 'Q17'),
]


def update_sqlite(db_path, course_id):
    if not os.path.exists(db_path):
        print(f"Skipping non-existent {db_path}")
        return
    print(f"\n[+] Updating SQLite DB: {db_path}...")
    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    c.execute("PRAGMA table_info(syllabus_course)")
    col_names = [r[1] for r in c.fetchall()]

    all_data = {
        'id': course_id,
        'subdomain_id': SUBDOMAIN,
        'title': COURSE_TITLE,
        'title_ar': None,
        'content': CONTENT_FR,
        'content_fr': CONTENT_FR,
        'content_ar': None,
        'examples': EXAMPLES_FR,
        'examples_fr': EXAMPLES_FR,
        'examples_ar': None,
        'astuces': ASTUCES_FR,
        'astuces_fr': ASTUCES_FR,
        'astuces_ar': None,
        'video_url': None
    }

    record = {k: v for k, v in all_data.items() if k in col_names}

    c.execute("SELECT id FROM syllabus_course WHERE subdomain_id = ? AND title = ?", (SUBDOMAIN, COURSE_TITLE))
    row = c.fetchone()
    if row:
        target_id = row[0]
        print(f"Course already exists with ID {target_id}. Updating content to French-only...")
        upd_cols = [k for k in record if k not in ('id', 'subdomain_id', 'title')]
        set_clause = ", ".join(f"{k} = ?" for k in upd_cols)
        values = [record[k] for k in upd_cols] + [target_id]
        c.execute(f"UPDATE syllabus_course SET {set_clause} WHERE id = ?", values)
    else:
        target_id = course_id
        print(f"Inserting new course with ID {target_id}...")
        ins_cols = list(record.keys())
        placeholders = ", ".join("?" for _ in ins_cols)
        col_list = ", ".join(ins_cols)
        values = [record[k] for k in ins_cols]
        c.execute(f"INSERT INTO syllabus_course ({col_list}) VALUES ({placeholders})", values)

    linked_count = 0
    for yr, qnum in MULTIMEDIA_EXAM_QUESTIONS:
        c.execute("UPDATE exams_question SET course_id = ? WHERE exam_year = ? AND question_number = ?", (target_id, yr, qnum))
        linked_count += c.rowcount
    print(f"Linked {linked_count} questions to course ID {target_id} in {db_path}")

    conn.commit()
    conn.close()


def update_initial_data_json():
    json_path = 'backend/initial_data.json'
    print(f"\n[+] Updating {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    course_item = next(
        (x for x in data if x.get('model') == 'syllabus.course' and x.get('fields', {}).get('title') == COURSE_TITLE),
        None
    )
    if course_item:
        print("Course found in initial_data.json, updating to French-only...")
        pk = course_item['pk']
        course_item['fields'].update({
            'title_ar': None,
            'content': CONTENT_FR,
            'content_fr': CONTENT_FR,
            'content_ar': None,
            'examples': EXAMPLES_FR,
            'examples_fr': EXAMPLES_FR,
            'examples_ar': None,
            'astuces': ASTUCES_FR,
            'astuces_fr': ASTUCES_FR,
            'astuces_ar': None,
        })
    else:
        existing_pks = [x['pk'] for x in data if x.get('model') == 'syllabus.course']
        pk = max(existing_pks) + 1 if existing_pks else 150
        print(f"Creating new course entry in initial_data.json with PK {pk}...")
        new_course = {
            "model": "syllabus.course",
            "pk": pk,
            "fields": {
                "subdomain": SUBDOMAIN,
                "title": COURSE_TITLE,
                "title_ar": None,
                "content": CONTENT_FR,
                "content_fr": CONTENT_FR,
                "content_ar": None,
                "examples": EXAMPLES_FR,
                "examples_fr": EXAMPLES_FR,
                "examples_ar": None,
                "astuces": ASTUCES_FR,
                "astuces_fr": ASTUCES_FR,
                "astuces_ar": None,
                "video_url": None
            }
        }
        data.append(new_course)

    updated_q = 0
    for item in data:
        if item.get('model') == 'exams.question':
            f = item.get('fields', {})
            yr = str(f.get('exam_year'))
            qnum = f.get('question_number')
            if (yr, qnum) in MULTIMEDIA_EXAM_QUESTIONS:
                f['course'] = pk
                updated_q += 1

    print(f"Updated {updated_q} questions in initial_data.json to point to course PK {pk}")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def update_dump():
    dump_path = 'backend/zrida_db_dump.sql'
    if not os.path.exists(dump_path):
        return
    print(f"\n[+] Updating {dump_path}...")
    with open('backend/initial_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    c_item = next((x for x in data if x.get('model') == 'syllabus.course' and x.get('pk') == 150), None)
    if not c_item:
        return
    flds = c_item['fields']

    def pg_escape(s):
        if s is None:
            return r'\N'
        return s.replace('\\', r'\\').replace('\t', r'\t').replace('\n', r'\n').replace('\r', '')

    row_cols = [
        '150',
        pg_escape(flds.get('title')),
        pg_escape(flds.get('content')),
        pg_escape(flds.get('examples')),
        pg_escape(flds.get('astuces')),
        pg_escape(flds.get('subdomain')),
        pg_escape(flds.get('video_url')),
        pg_escape(flds.get('content_ar')),
        pg_escape(flds.get('content_fr')),
        pg_escape(flds.get('astuces_ar')),
        pg_escape(flds.get('astuces_fr')),
        pg_escape(flds.get('examples_ar')),
        pg_escape(flds.get('examples_fr')),
        pg_escape(flds.get('title_ar'))
    ]
    new_line = '\t'.join(row_cols)

    with open(dump_path, 'r', encoding='utf-8', errors='ignore') as f:
        sql = f.read()

    # If course 150 already exists in dump, replace its line
    needle = 'COPY public.syllabus_course (id, title, content, examples, astuces, subdomain_id, video_url, content_ar, content_fr, astuces_ar, astuces_fr, examples_ar, examples_fr, title_ar) FROM stdin;\n'
    idx = sql.find(needle)
    if idx != -1:
        end_idx = sql.find('\n\\.', idx)
        table_chunk = sql[idx + len(needle):end_idx]
        lines = table_chunk.split('\n')
        new_lines = []
        replaced = False
        for l in lines:
            if l.startswith('150\t'):
                new_lines.append(new_line)
                replaced = True
            else:
                new_lines.append(l)
        if not replaced:
            new_lines.insert(0, new_line)
        sql = sql[:idx + len(needle)] + '\n'.join(new_lines) + sql[end_idx:]
        sql = sql.replace("setval('public.syllabus_course_id_seq', 149, true)", "setval('public.syllabus_course_id_seq', 150, true)")
        with open(dump_path, 'w', encoding='utf-8') as f:
            f.write(sql)
        print('[+] Successfully updated zrida_db_dump.sql with French-only content')


if __name__ == '__main__':
    update_sqlite('backend/db.sqlite3', 251)
    update_sqlite('backend/test_fresh.sqlite3', 150)
    update_initial_data_json()
    update_dump()
    print("\n[SUCCESS] All files updated with French-only content!")
