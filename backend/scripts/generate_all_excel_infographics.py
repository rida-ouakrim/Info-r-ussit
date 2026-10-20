import os
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 920

def get_font(size, bold=False, mono=False):
    if mono:
        font_file = "consola.ttf"
    elif bold:
        font_file = "segoeuib.ttf"
    else:
        font_file = "segoeui.ttf"
    path = os.path.join(r"C:\Windows\Fonts", font_file)
    if not os.path.exists(path):
        font_file = "arialbd.ttf" if bold else "arial.ttf"
        path = os.path.join(r"C:\Windows\Fonts", font_file)
    return ImageFont.truetype(path, size)

def draw_header(draw, title, subtitle):
    draw.rounded_rectangle([30, 20, W - 30, 90], radius=14, fill="#0F5132")
    draw.text((W / 2, 42), title, font=get_font(25, bold=True), fill="#FFFFFF", anchor="mm")
    draw.text((W / 2, 70), subtitle, font=get_font(14, bold=False), fill="#D1E7DD", anchor="mm")

def draw_arrow(draw, start, end, color="#2563EB", width=2):
    sx, sy = start
    ex, ey = end
    draw.line([sx, sy, ex, ey], fill=color, width=width)
    angle = math.atan2(ey - sy, ex - sx)
    arrow_len = 9
    arrow_angle = math.pi / 6
    x1 = ex - arrow_len * math.cos(angle - arrow_angle)
    y1 = ey - arrow_len * math.sin(angle - arrow_angle)
    x2 = ex - arrow_len * math.cos(angle + arrow_angle)
    y2 = ey - arrow_len * math.sin(angle + arrow_angle)
    draw.polygon([(ex, ey), (x1, y1), (x2, y2)], fill=color)

def draw_grid(draw, x0, y0, cols, rows, col_w=85, row_h=36, corner_w=38, corner_h=28):
    draw.rectangle([x0, y0, x0 + corner_w, y0 + corner_h], fill="#E2E8F0", outline="#CBD5E1", width=1)
    for i, c in enumerate(cols):
        cx = x0 + corner_w + i * col_w
        draw.rectangle([cx, y0, cx + col_w, y0 + corner_h], fill="#EDF2F7", outline="#CBD5E1", width=1)
        draw.text((cx + col_w / 2, y0 + corner_h / 2), c, font=get_font(13, bold=True), fill="#475569", anchor="mm")
    for j, r in enumerate(rows):
        ry = y0 + corner_h + j * row_h
        draw.rectangle([x0, ry, x0 + corner_w, ry + row_h], fill="#EDF2F7", outline="#CBD5E1", width=1)
        draw.text((x0 + corner_w / 2, ry + row_h / 2), str(r), font=get_font(13, bold=True), fill="#475569", anchor="mm")
        for i in range(len(cols)):
            cx = x0 + corner_w + i * col_w
            draw.rectangle([cx, ry, cx + col_w, ry + row_h], fill="#FFFFFF", outline="#E2E8F0", width=1)

def save_image(im, filename):
    p1 = os.path.join("frontend/public/images", filename)
    p2 = os.path.join("frontend/dist/images", filename)
    im.save(p1, format="PNG", quality=95)
    im.save(p2, format="PNG", quality=95)
    print(f"[OK] Saved {filename}")

# ==============================================================================
# IMAGE 1: Références de cellules (excel_cell_references.png)
# ==============================================================================
from generate_excel_infographic import create_excel_infographic

# ==============================================================================
# IMAGE 2: Fonctions Logiques (excel_logic_if.png)
# ==============================================================================
def create_logic_if_infographic():
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    draw_header(draw, "EXCEL : FONCTIONS LOGIQUES ET CONDITIONS IMBRIQUÉES",
                "Comprendre la Fonction SI(), les Opérateurs Logiques ET/OU, et les Arbres de Décision")

    y_top = 105
    h_top = 345
    draw.rounded_rectangle([30, y_top, W - 30, y_top + h_top], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([30, y_top, W - 30, y_top + 42], fill="#F0FDF4")
    draw.text((50, y_top + 13), "1. LA FONCTION SI SIMPLE : =SI(Condition ; Valeur_si_VRAI ; Valeur_si_FAUX)",
              font=get_font(16, bold=True), fill="#166534")

    # Left: Syntax
    draw.rounded_rectangle([55, y_top + 60, 560, y_top + h_top - 20], radius=10, fill="#F8FAFC", outline="#E2E8F0", width=1)
    draw.text((75, y_top + 75), "Syntaxe Officielle :", font=get_font(15, bold=True), fill="#0F172A")
    draw.text((75, y_top + 102), "=SI(Test_Logique ; Valeur_si_VRAI ; Valeur_si_FAUX)", font=get_font(14, bold=True, mono=True), fill="#1E40AF")
    
    expl = [
        ("[Test_Logique]", "Condition évaluée (ex : Moyenne >= 10). Renvoie VRAI ou FAUX."),
        ("[Valeur_si_VRAI]", "Résultat affiché si la condition est respectée (ex : 'Admis')."),
        ("[Valeur_si_FAUX]", "Résultat affiché si la condition n'est PAS respectée (ex : 'Ajourné')."),
    ]
    ey = y_top + 140
    for p, d in expl:
        draw.text((75, ey), p, font=get_font(13, bold=True), fill="#1E293B")
        draw.text((75, ey + 20), d, font=get_font(12, bold=False), fill="#475569")
        ey += 50
    draw.text((75, ey + 5), "Exemple : =SI(C2>=10 ; \"Admis\" ; \"Ajourné\")", font=get_font(13, bold=True, mono=True), fill="#059669")

    # Right: Flowchart diagram with clean rounded box for condition
    fc_x = 600
    cond_x0, cond_y0 = fc_x + 90, y_top + 130
    cond_w, cond_h = 240, 80
    draw.rounded_rectangle([cond_x0, cond_y0, cond_x0 + cond_w, cond_y0 + cond_h], radius=12, fill="#EFF6FF", outline="#2563EB", width=2)
    draw.text((cond_x0 + cond_w / 2, cond_y0 + 24), "TEST LOGIQUE", font=get_font(12, bold=True), fill="#1E3A8A", anchor="mm")
    draw.text((cond_x0 + cond_w / 2, cond_y0 + 52), "C2 >= 10 ?", font=get_font(18, bold=True, mono=True), fill="#1D4ED8", anchor="mm")

    # True path (upper right)
    draw_arrow(draw, (cond_x0 + cond_w, cond_y0 + 25), (cond_x0 + cond_w + 110, cond_y0 - 25), color="#16A34A", width=3)
    draw.text((cond_x0 + cond_w + 45, cond_y0 - 15), "VRAI", font=get_font(12, bold=True), fill="#16A34A")
    draw.rounded_rectangle([cond_x0 + cond_w + 115, cond_y0 - 65, cond_x0 + cond_w + 310, cond_y0 + 5], radius=8, fill="#DCFCE7", outline="#16A34A", width=2)
    draw.text((cond_x0 + cond_w + 212, cond_y0 - 48), "Valeur si VRAI", font=get_font(11, bold=True), fill="#166534", anchor="mm")
    draw.text((cond_x0 + cond_w + 212, cond_y0 - 24), "\"Admis\"", font=get_font(16, bold=True, mono=True), fill="#14532D", anchor="mm")

    # False path (lower right)
    draw_arrow(draw, (cond_x0 + cond_w, cond_y0 + 55), (cond_x0 + cond_w + 110, cond_y0 + 105), color="#DC2626", width=3)
    draw.text((cond_x0 + cond_w + 45, cond_y0 + 95), "FAUX", font=get_font(12, bold=True), fill="#DC2626")
    draw.rounded_rectangle([cond_x0 + cond_w + 115, cond_y0 + 65, cond_x0 + cond_w + 310, cond_y0 + 135], radius=8, fill="#FEE2E2", outline="#DC2626", width=2)
    draw.text((cond_x0 + cond_w + 212, cond_y0 + 82), "Valeur si FAUX", font=get_font(11, bold=True), fill="#991B1B", anchor="mm")
    draw.text((cond_x0 + cond_w + 212, cond_y0 + 106), "\"Ajourné\"", font=get_font(16, bold=True, mono=True), fill="#7F1D1D", anchor="mm")

    # BOTTOM PANELS
    y_bot = 470
    h_bot = 425
    w_p2 = 680

    # Panel 2: ET and OU
    draw.rounded_rectangle([30, y_bot, 30 + w_p2, y_bot + h_bot], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([30, y_bot, 30 + w_p2, y_bot + 42], fill="#FEF3C7")
    draw.text((50, y_bot + 13), "2. OPÉRATEURS LOGIQUES COMBINÉS : ET() ET OU()", font=get_font(16, bold=True), fill="#92400E")

    # ET Card
    draw.rounded_rectangle([55, y_bot + 58, 30 + w_p2 - 25, y_bot + 215], radius=10, fill="#FAF5FF", outline="#D8B4FE", width=1)
    draw.text((75, y_bot + 72), "Fonction ET(...)  [Exige TOUTES les conditions]", font=get_font(14, bold=True), fill="#581C87")
    draw.text((75, y_bot + 98), "=SI( ET(Ecrit>=10 ; Oral>=10) ; \"Admis Finale\" ; \"Refusé\" )", font=get_font(13, bold=True, mono=True), fill="#6B21A8")
    draw.text((75, y_bot + 128), "• Renvoie VRAI uniquement si CHAQUE condition individuelle est VRAIE.", font=get_font(12, bold=False), fill="#374151")
    draw.text((75, y_bot + 150), "• Exemple : ET(15>=10 ; 12>=10) ==> VRAI   |   ET(15>=10 ; 8>=10) ==> FAUX", font=get_font(12, bold=True, mono=True), fill="#4C1D95")
    draw.text((75, y_bot + 175), "[REGLE D'OR] : Un seul FAUX rend l'ensemble du ET() égal à FAUX !", font=get_font(12, bold=True), fill="#9333EA")

    # OU Card
    draw.rounded_rectangle([55, y_bot + 230, 30 + w_p2 - 25, y_bot + 387], radius=10, fill="#F0FDFA", outline="#99F6E4", width=1)
    draw.text((75, y_bot + 244), "Fonction OU(...)  [Exige AU MOINS UNE condition]", font=get_font(14, bold=True), fill="#0F766E")
    draw.text((75, y_bot + 270), "=SI( OU(Mention=\"Bien\" ; Note>=14) ; \"Bourse\" ; \"Standard\" )", font=get_font(13, bold=True, mono=True), fill="#0D9488")
    draw.text((75, y_bot + 300), "• Renvoie VRAI dès qu'au moins une condition est satisfaite.", font=get_font(12, bold=False), fill="#374151")
    draw.text((75, y_bot + 322), "• Exemple : OU(15>=10 ; 5>=10)  ==> VRAI   |   OU(8>=10 ; 4>=10)  ==> FAUX", font=get_font(12, bold=True, mono=True), fill="#115E59")
    draw.text((75, y_bot + 347), "[REGLE D'OR] : Il suffit d'un seul VRAI pour que le OU() soit VRAI !", font=get_font(12, bold=True), fill="#0D9488")

    # Panel 3: Nested IF
    x_p3 = 30 + w_p2 + 20
    w_p3 = W - 30 - x_p3
    draw.rounded_rectangle([x_p3, y_bot, x_p3 + w_p3, y_bot + h_bot], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([x_p3, y_bot, x_p3 + w_p3, y_bot + 42], fill="#EFF6FF")
    draw.text((x_p3 + 20, y_bot + 13), "3. CONDITIONS IMBRIQUÉES (SI MULTIPLES)", font=get_font(16, bold=True), fill="#1E40AF")

    draw.text((x_p3 + 20, y_bot + 58), "Arbre de Décision : Calcul de Mention selon Moyenne C2", font=get_font(13, bold=True), fill="#0F172A")
    draw.rounded_rectangle([x_p3 + 20, y_bot + 82, x_p3 + w_p3 - 20, y_bot + 135], radius=8, fill="#F8FAFC", outline="#E2E8F0", width=1)
    draw.text((x_p3 + 30, y_bot + 92), "Formule Imbriquée Exacte :", font=get_font(11, bold=True), fill="#64748B")
    draw.text((x_p3 + 30, y_bot + 110), "=SI(C2>=16; \"TB\"; SI(C2>=14; \"Bien\"; SI(C2>=10; \"Passable\"; \"Ajourné\")))",
              font=get_font(12, bold=True, mono=True), fill="#1D4ED8")

    cascade = [
        ("C2 >= 16 ?", "VRAI ==> \"Très Bien\"", "FAUX ==> Passe au test suivant..."),
        ("C2 >= 14 ?", "VRAI ==> \"Bien\"", "FAUX ==> Passe au test suivant..."),
        ("C2 >= 10 ?", "VRAI ==> \"Passable\"", "FAUX ==> \"Ajourné\"")
    ]
    cy = y_bot + 155
    for q, ans_vrai, ans_faux in cascade:
        draw.rounded_rectangle([x_p3 + 20, cy, x_p3 + 130, cy + 50], radius=8, fill="#EFF6FF", outline="#3B82F6", width=2)
        draw.text((x_p3 + 75, cy + 25), q, font=get_font(13, bold=True), fill="#1E40AF", anchor="mm")
        
        draw_arrow(draw, (x_p3 + 130, cy + 25), (x_p3 + 200, cy + 25), color="#16A34A", width=2)
        draw.rounded_rectangle([x_p3 + 200, cy + 5, x_p3 + 420, cy + 45], radius=6, fill="#DCFCE7", outline="#16A34A", width=1)
        draw.text((x_p3 + 310, cy + 25), ans_vrai, font=get_font(12, bold=True), fill="#14532D", anchor="mm")
        
        draw.text((x_p3 + 435, cy + 25), ans_faux, font=get_font(11, bold=False), fill="#64748B", anchor="lm")
        cy += 65

    # Parentheses note
    draw.rounded_rectangle([x_p3 + 20, y_bot + h_bot - 65, x_p3 + w_p3 - 20, y_bot + h_bot - 18], radius=8, fill="#FEF3C7", outline="#F59E0B", width=1)
    draw.text((x_p3 + 30, y_bot + h_bot - 54), "[ASTUCE CONCOURS] : Nombre de parenthèses fermantes à la fin", font=get_font(11, bold=True), fill="#92400E")
    draw.text((x_p3 + 30, y_bot + h_bot - 34), "est STRICTEMENT égal au nombre de SI() ouverts ! (ex: 3 SI ouverts = ))) à la fin)", font=get_font(11, bold=False), fill="#78350F")

    save_image(im, "excel_logic_if.png")

# ==============================================================================
# IMAGE 3: Recherche Avancée (excel_index_equiv.png)
# ==============================================================================
def create_index_equiv_infographic():
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    draw_header(draw, "RECHERCHE AVANCÉE DANS EXCEL : RECHERCHEV VS INDEX + EQUIV",
                "Pourquoi le Couple INDEX + EQUIV est Supérieur et Plus Puissant que RECHERCHEV")

    y_p = 105
    h_p = 790
    w_p = (W - 80) // 2

    # LEFT PANEL: RECHERCHEV
    p1_x = 30
    draw.rounded_rectangle([p1_x, y_p, p1_x + w_p, y_p + h_p], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([p1_x, y_p, p1_x + w_p, y_p + 44], fill="#FEE2E2")
    draw.text((p1_x + 20, y_p + 14), "1. LES LIMITATIONS MAJEURES DE RECHERCHEV", font=get_font(16, bold=True), fill="#991B1B")

    draw.rounded_rectangle([p1_x + 20, y_p + 60, p1_x + w_p - 20, y_p + 125], radius=8, fill="#FEF2F2", outline="#FECACA", width=1)
    draw.text((p1_x + 35, y_p + 72), "Syntaxe RECHERCHEV :", font=get_font(12, bold=True), fill="#7F1D1D")
    draw.text((p1_x + 35, y_p + 95), "=RECHERCHEV(valeur_cherchée ; table ; no_colonne ; FAUX)", font=get_font(13, bold=True, mono=True), fill="#DC2626")

    # Clean Grid Table
    g_x, g_y = p1_x + 25, y_p + 145
    cols_v = ['A (Code)', 'B (Nom)', 'C (Prix)', 'D (Stock)']
    rows_v = [1, 2, 3, 4, 5]
    draw_grid(draw, g_x, g_y, cols_v, rows_v, col_w=165, row_h=38, corner_w=40, corner_h=30)
    
    samples = [
        ("P101", "Clavier", "100 DH", "15"),
        ("P102", "Souris",  "50 DH",  "40"),
        ("P103", "Écran",   "1200 DH","8"),
        ("P104", "Casque",  "150 DH", "25"),
    ]
    for row_idx, data in enumerate(samples):
        ry = g_y + 30 + (row_idx + 1) * 38
        for col_idx, val in enumerate(data):
            cx = g_x + 40 + col_idx * 165
            draw.text((cx + 82, ry + 19), val, font=get_font(12, bold=False), fill="#1E293B", anchor="mm")

    # Directions card under table
    dir_y = g_y + 30 + 5 * 38 + 20
    draw.rounded_rectangle([p1_x + 20, dir_y, p1_x + w_p - 20, dir_y + 110], radius=8, fill="#F8FAFC", outline="#E2E8F0", width=1)
    draw.text((p1_x + 35, dir_y + 14), "[SENS DE RECHERCHE AUTORISÉ] :", font=get_font(12, bold=True), fill="#0F172A")
    draw.text((p1_x + 35, dir_y + 38), "[OUI] Gauche vers Droite : De la Col A vers Col C (ex: Trouver Prix depuis Code)", font=get_font(11, bold=True), fill="#15803D")
    draw.text((p1_x + 35, dir_y + 60), "[NON] Droite vers Gauche : De la Col B vers Col A (ex: Trouver Code depuis Nom)  ==>  IMPOSSIBLE !", font=get_font(11, bold=True), fill="#DC2626")
    draw.text((p1_x + 35, dir_y + 82), "La colonne de recherche DOIT OBLIGATOIREMENT être la première colonne de la plage.", font=get_font(11, bold=False), fill="#64748B")

    # Bullet list of pitfalls
    lim_y = dir_y + 125
    draw.rounded_rectangle([p1_x + 20, lim_y, p1_x + w_p - 20, y_p + h_p - 20], radius=10, fill="#FEF2F2", outline="#FECACA", width=1)
    draw.text((p1_x + 35, lim_y + 15), "Pourquoi RECHERCHEV est fragile en entreprise et aux examens :", font=get_font(13, bold=True), fill="#991B1B")
    lims = [
        ("[-] Contrainte de la 1ère colonne :", "La clé cherchée doit impérativement se situer dans la colonne la plus à gauche."),
        ("[-] Cassure lors de l'insertion de colonnes :", "Si vous insérez une colonne dans la table, le numéro d'index devient faux (#REF!)."),
        ("[-] Pas de recherche bidirectionnelle :", "Ne peut pas extraire d'informations situées avant la colonne de recherche."),
    ]
    ly = lim_y + 45
    for t, d in lims:
        draw.text((p1_x + 35, ly), t, font=get_font(12, bold=True), fill="#B91C1C")
        draw.text((p1_x + 35, ly + 20), d, font=get_font(11, bold=False), fill="#475569")
        ly += 55

    # RIGHT PANEL: INDEX + EQUIV
    p2_x = 30 + w_p + 20
    draw.rounded_rectangle([p2_x, y_p, p2_x + w_p, y_p + h_p], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([p2_x, y_p, p2_x + w_p, y_p + 44], fill="#ECFDF5")
    draw.text((p2_x + 20, y_p + 14), "2. LA PUISSANCE DU COUPLE INDEX + EQUIV", font=get_font(16, bold=True), fill="#047857")

    draw.rounded_rectangle([p2_x + 20, y_p + 60, p2_x + w_p - 20, y_p + 125], radius=8, fill="#F0FDF4", outline="#A7F3D0", width=1)
    draw.text((p2_x + 35, y_p + 72), "La Formule Ultime Multidirectionnelle :", font=get_font(12, bold=True), fill="#065F46")
    draw.text((p2_x + 35, y_p + 95), "=INDEX(Plage_Résultat ; EQUIV(Clé ; Plage_Recherche ; 0))", font=get_font(13, bold=True, mono=True), fill="#047857")

    # Step 1: EQUIV
    r_y = y_p + 145
    draw.rounded_rectangle([p2_x + 20, r_y, p2_x + w_p - 20, r_y + 130], radius=8, fill="#EFF6FF", outline="#BFDBFE", width=1)
    draw.text((p2_x + 35, r_y + 12), "Étape 1 : EQUIV trouve la POSITION EXACTE (Numéro de ligne)", font=get_font(13, bold=True), fill="#1E40AF")
    draw.text((p2_x + 35, r_y + 38), "=EQUIV(\"Écran\" ; B2:B10 ; 0)   ==>   Renvoie 3 (position dans la plage)", font=get_font(13, bold=True, mono=True), fill="#1D4ED8")
    draw.text((p2_x + 35, r_y + 68), "• Le paramètre '0' exige une correspondance exacte (comme FAUX dans RECHERCHEV).", font=get_font(12, bold=False), fill="#374151")
    draw.text((p2_x + 35, r_y + 92), "• EQUIV agit comme un GPS : il localise où se trouve l'élément.", font=get_font(12, bold=False), fill="#374151")

    # Step 2: INDEX
    r_y2 = r_y + 145
    draw.rounded_rectangle([p2_x + 20, r_y2, p2_x + w_p - 20, r_y2 + 130], radius=8, fill="#FAF5FF", outline="#E9D5FF", width=1)
    draw.text((p2_x + 35, r_y2 + 12), "Étape 2 : INDEX extrait la VALEUR à cette position", font=get_font(13, bold=True), fill="#6B21A8")
    draw.text((p2_x + 35, r_y2 + 38), "=INDEX(A2:A10 ; 3)   ==>   Renvoie la valeur à la ligne 3 (\"P103\")", font=get_font(13, bold=True, mono=True), fill="#7E22CE")
    draw.text((p2_x + 35, r_y2 + 68), "• Fonctionne dans N'IMPORTE QUELLE COLONNE (vers la gauche ou vers la droite !).", font=get_font(12, bold=False), fill="#374151")
    draw.text((p2_x + 35, r_y2 + 92), "• Totalement insensible à l'insertion ou suppression de colonnes.", font=get_font(12, bold=False), fill="#374151")

    # Bottom summary comparison
    sum_y = r_y2 + 145
    draw.rounded_rectangle([p2_x + 20, sum_y, p2_x + w_p - 20, y_p + h_p - 20], radius=10, fill="#F0FDF4", outline="#BBF7D0", width=1)
    draw.text((p2_x + 35, sum_y + 15), "Pourquoi INDEX+EQUIV est recommandé dans tous les Concours :", font=get_font(13, bold=True), fill="#065F46")
    pts = [
        ("[+] Recherche Multidirectionnelle :", "Permet de chercher vers la gauche sans réorganiser les colonnes du tableau."),
        ("[+] Robustesse aux modifications :", "Si vous insérez ou déplacez des colonnes, la formule continue de fonctionner."),
        ("[+] Performance supérieure :", "Beaucoup plus rapide sur de très gros volumes de données qu'un RECHERCHEV lourd."),
    ]
    py = sum_y + 45
    for t, d in pts:
        draw.text((p2_x + 35, py), t, font=get_font(12, bold=True), fill="#15803D")
        draw.text((p2_x + 35, py + 20), d, font=get_font(11, bold=False), fill="#374151")
        py += 55

    save_image(im, "excel_index_equiv.png")

# ==============================================================================
# IMAGE 4: Tableaux Croisés Dynamiques (excel_tcd_pivot.png)
# ==============================================================================
def create_tcd_infographic():
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)
    draw_header(draw, "LES TABLEAUX CROISÉS DYNAMIQUES (TCD) DANS EXCEL",
                "Transformer des Données Brutes en Tableau d'Analyse 2D en 3 Clics sans Aucune Formule")

    y_p = 105
    h_p = 790

    w_col1 = 430
    w_col2 = 450
    w_col3 = W - 30 - 30 - w_col1 - w_col2 - 40

    # 1. Source Data
    x1 = 30
    draw.rounded_rectangle([x1, y_p, x1 + w_col1, y_p + h_p], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([x1, y_p, x1 + w_col1, y_p + 44], fill="#EFF6FF")
    draw.text((x1 + 20, y_p + 14), "1. DONNÉES BRUTES (SOURCE)", font=get_font(15, bold=True), fill="#1E40AF")
    draw.text((x1 + 20, y_p + 55), "Tableau plat classique (Lignes répétitives)", font=get_font(12, bold=False), fill="#64748B")

    cols_s = ['Région', 'Produit', 'Ventes']
    rows_s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    g_x, g_y = x1 + 20, y_p + 85
    draw_grid(draw, g_x, g_y, cols_s, rows_s, col_w=115, row_h=35, corner_w=35, corner_h=28)

    sample_sales = [
        ("Nord", "PC", "2 500 DH"),
        ("Sud", "Écran", "1 200 DH"),
        ("Nord", "Souris", "300 DH"),
        ("Est", "PC", "2 500 DH"),
        ("Ouest", "Clavier", "400 DH"),
        ("Sud", "PC", "2 500 DH"),
        ("Nord", "Écran", "1 200 DH"),
        ("Est", "Souris", "300 DH"),
        ("Ouest", "PC", "2 500 DH"),
        ("Sud", "Clavier", "400 DH"),
    ]
    for idx, (reg, prod, val) in enumerate(sample_sales):
        ry = g_y + 28 + (idx + 1) * 35
        draw.text((g_x + 35 + 57, ry + 17), reg, font=get_font(12, bold=False), fill="#1E293B", anchor="mm")
        draw.text((g_x + 35 + 115 + 57, ry + 17), prod, font=get_font(12, bold=False), fill="#1E293B", anchor="mm")
        draw.text((g_x + 35 + 230 + 57, ry + 17), val, font=get_font(12, bold=True, mono=True), fill="#059669", anchor="mm")

    draw.rounded_rectangle([x1 + 15, y_p + h_p - 170, x1 + w_col1 - 15, y_p + h_p - 18], radius=8, fill="#F8FAFC", outline="#E2E8F0", width=1)
    draw.text((x1 + 25, y_p + h_p - 155), "[INFO] Conditions requises pour créer un TCD :", font=get_font(12, bold=True), fill="#0F172A")
    draw.text((x1 + 25, y_p + h_p - 130), "• Chaque colonne doit avoir un en-tête unique.", font=get_font(11, bold=False), fill="#475569")
    draw.text((x1 + 25, y_p + h_p - 105), "• Pas de lignes ou colonnes totalement vides.", font=get_font(11, bold=False), fill="#475569")
    draw.text((x1 + 25, y_p + h_p - 80), "• Pas de cellules fusionnées dans la source.", font=get_font(11, bold=False), fill="#475569")
    draw.text((x1 + 25, y_p + h_p - 50), "Menu Excel : Insertion  ->  Tableau Croisé Dynamique", font=get_font(12, bold=True), fill="#2563EB")

    # 2. Middle: The 4 Drop Zones
    x2 = x1 + w_col1 + 20
    draw.rounded_rectangle([x2, y_p, x2 + w_col2, y_p + h_p], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([x2, y_p, x2 + w_col2, y_p + 44], fill="#FEF3C7")
    draw.text((x2 + 20, y_p + 14), "2. LES 4 ZONES DE DÉPÔT DU TCD", font=get_font(15, bold=True), fill="#92400E")
    draw.text((x2 + 20, y_p + 55), "Glisser-déposer les champs dans les 4 quadrants :", font=get_font(12, bold=False), fill="#64748B")

    quad_w = (w_col2 - 45) // 2
    quad_h = 240
    
    # Zone 1: Filtres
    draw.rounded_rectangle([x2 + 15, y_p + 85, x2 + 15 + quad_w, y_p + 85 + quad_h], radius=10, fill="#F8FAFC", outline="#CBD5E1", width=1)
    draw.rectangle([x2 + 15, y_p + 85, x2 + 15 + quad_w, y_p + 120], fill="#EDF2F7")
    draw.text((x2 + 25, y_p + 102), "[FILTRES]", font=get_font(12, bold=True), fill="#334155", anchor="lm")
    draw.text((x2 + 25, y_p + 135), "Filtre global du rapport.", font=get_font(11, bold=False), fill="#64748B")
    draw.rounded_rectangle([x2 + 25, y_p + 160, x2 + quad_w + 5, y_p + 200], radius=6, fill="#FFFFFF", outline="#94A3B8", width=1)
    draw.text((x2 + 35, y_p + 180), "Année (optionnel)", font=get_font(12, bold=True), fill="#1E293B", anchor="lm")

    # Zone 2: Colonnes
    draw.rounded_rectangle([x2 + 25 + quad_w, y_p + 85, x2 + w_col2 - 15, y_p + 85 + quad_h], radius=10, fill="#F0FDF4", outline="#86EFAC", width=1)
    draw.rectangle([x2 + 25 + quad_w, y_p + 85, x2 + w_col2 - 15, y_p + 120], fill="#DCFCE7")
    draw.text((x2 + 35 + quad_w, y_p + 102), "[COLONNES]", font=get_font(12, bold=True), fill="#166534", anchor="lm")
    draw.text((x2 + 35 + quad_w, y_p + 135), "En-têtes horizontales.", font=get_font(11, bold=False), fill="#166534")
    draw.rounded_rectangle([x2 + 35 + quad_w, y_p + 160, x2 + w_col2 - 25, y_p + 200], radius=6, fill="#FFFFFF", outline="#22C55E", width=2)
    draw.text((x2 + 45 + quad_w, y_p + 180), "Région", font=get_font(13, bold=True), fill="#15803D", anchor="lm")

    # Zone 3: Lignes
    draw.rounded_rectangle([x2 + 15, y_p + 345, x2 + 15 + quad_w, y_p + 345 + quad_h], radius=10, fill="#EFF6FF", outline="#93C5FD", width=1)
    draw.rectangle([x2 + 15, y_p + 345, x2 + 15 + quad_w, y_p + 380], fill="#DBEAFE")
    draw.text((x2 + 25, y_p + 362), "[LIGNES]", font=get_font(12, bold=True), fill="#1E40AF", anchor="lm")
    draw.text((x2 + 25, y_p + 395), "En-têtes verticales.", font=get_font(11, bold=False), fill="#1E40AF")
    draw.rounded_rectangle([x2 + 25, y_p + 420, x2 + quad_w + 5, y_p + 460], radius=6, fill="#FFFFFF", outline="#3B82F6", width=2)
    draw.text((x2 + 35, y_p + 440), "Produit", font=get_font(13, bold=True), fill="#1D4ED8", anchor="lm")

    # Zone 4: Valeurs
    draw.rounded_rectangle([x2 + 25 + quad_w, y_p + 345, x2 + w_col2 - 15, y_p + 345 + quad_h], radius=10, fill="#FAF5FF", outline="#D8B4FE", width=1)
    draw.rectangle([x2 + 25 + quad_w, y_p + 345, x2 + w_col2 - 15, y_p + 380], fill="#F3E8FF")
    draw.text((x2 + 35 + quad_w, y_p + 362), "[VALEURS]", font=get_font(12, bold=True), fill="#6B21A8", anchor="lm")
    draw.text((x2 + 35 + quad_w, y_p + 395), "Calculs agrégés.", font=get_font(11, bold=False), fill="#6B21A8")
    draw.rounded_rectangle([x2 + 35 + quad_w, y_p + 420, x2 + w_col2 - 25, y_p + 460], radius=6, fill="#FFFFFF", outline="#A855F7", width=2)
    draw.text((x2 + 45 + quad_w, y_p + 440), "Somme de Ventes", font=get_font(13, bold=True), fill="#7E22CE", anchor="lm")

    draw.rounded_rectangle([x2 + 15, y_p + h_p - 170, x2 + w_col2 - 15, y_p + h_p - 18], radius=8, fill="#F8FAFC", outline="#E2E8F0", width=1)
    draw.text((x2 + 25, y_p + h_p - 155), "[CALCULS] Disponibles dans 'Valeurs' :", font=get_font(12, bold=True), fill="#0F172A")
    draw.text((x2 + 25, y_p + h_p - 125), "• Somme (par défaut pour les données numériques)", font=get_font(11, bold=False), fill="#475569")
    draw.text((x2 + 25, y_p + h_p - 100), "• Nombre / NB (par défaut pour les textes)", font=get_font(11, bold=False), fill="#475569")
    draw.text((x2 + 25, y_p + h_p - 75), "• Moyenne, Max, Min, Écart-type...", font=get_font(11, bold=False), fill="#475569")
    draw.text((x2 + 25, y_p + h_p - 50), "• Pourcentage du total général ou de ligne", font=get_font(11, bold=True), fill="#7C3AED")

    # 3. Right: Result TCD
    x3 = x2 + w_col2 + 20
    draw.rounded_rectangle([x3, y_p, x3 + w_col3, y_p + h_p], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([x3, y_p, x3 + w_col3, y_p + 44], fill="#ECFDF5")
    draw.text((x3 + 20, y_p + 14), "3. RÉSULTAT DU TCD GÉNÉRÉ (2D)", font=get_font(15, bold=True), fill="#047857")
    draw.text((x3 + 20, y_p + 55), "Tableau de synthèse croisée instantanée :", font=get_font(12, bold=False), fill="#64748B")

    cols_tcd = ['Produit', 'Est', 'Nord', 'Ouest', 'Sud', 'Total']
    gt_x, gt_y = x3 + 20, y_p + 95
    tcd_col_w = 95
    tcd_row_h = 42

    draw.rectangle([gt_x, gt_y, gt_x + len(cols_tcd) * tcd_col_w, gt_y + 32], fill="#0F5132")
    for i, c in enumerate(cols_tcd):
        cx = gt_x + i * tcd_col_w
        draw.text((cx + tcd_col_w / 2, gt_y + 16), c, font=get_font(12, bold=True), fill="#FFFFFF", anchor="mm")

    tcd_data = [
        ["PC", "2 500", "2 500", "2 500", "2 500", "10 000 DH"],
        ["Écran", "-", "1 200", "-", "1 200", "2 400 DH"],
        ["Souris", "300", "300", "-", "-", "600 DH"],
        ["Clavier", "-", "-", "400", "400", "800 DH"],
        ["Total Général", "2 800", "4 000", "2 900", "4 100", "13 800 DH"],
    ]
    for j, row in enumerate(tcd_data):
        ry = gt_y + 32 + j * tcd_row_h
        bg_col = "#F1F5F9" if j == len(tcd_data) - 1 else ("#FFFFFF" if j % 2 == 0 else "#F8FAFC")
        for i, val in enumerate(row):
            cx = gt_x + i * tcd_col_w
            draw.rectangle([cx, ry, cx + tcd_col_w, ry + tcd_row_h], fill=bg_col, outline="#E2E8F0", width=1)
            is_bold = (i == 0 or i == len(row) - 1 or j == len(tcd_data) - 1)
            color = "#047857" if (i == len(row) - 1 or j == len(tcd_data) - 1) else "#1E293B"
            draw.text((cx + tcd_col_w / 2, ry + tcd_row_h / 2), val, font=get_font(12, bold=is_bold), fill=color, anchor="mm")

    draw.rounded_rectangle([x3 + 15, y_p + h_p - 170, x3 + w_col3 - 15, y_p + h_p - 18], radius=8, fill="#F0FDF4", outline="#BBF7D0", width=1)
    draw.text((x3 + 25, y_p + h_p - 155), "[AVANTAGES CLES DU TCD] :", font=get_font(12, bold=True), fill="#065F46")
    draw.text((x3 + 25, y_p + h_p - 125), "• Aucun calcul ni formule complexe à écrire à la main.", font=get_font(11, bold=False), fill="#14532D")
    draw.text((x3 + 25, y_p + h_p - 100), "• Réorganisation instantanée par simple glisser-déposer des champs.", font=get_font(11, bold=False), fill="#14532D")
    draw.text((x3 + 25, y_p + h_p - 75), "• Actualisation en 1 clic : Clic Droit  ->  Actualiser.", font=get_font(11, bold=True), fill="#047857")
    draw.text((x3 + 25, y_p + h_p - 50), "• Génération de Graphiques Croisés Dynamiques (GCD) en direct.", font=get_font(11, bold=False), fill="#14532D")

    save_image(im, "excel_tcd_pivot.png")

if __name__ == '__main__':
    create_excel_infographic()
    create_logic_if_infographic()
    create_index_equiv_infographic()
    create_tcd_infographic()
    print("ALL 4 EXCEL INFOGRAPHICS POLISHED SUCCESSFULLY!")
