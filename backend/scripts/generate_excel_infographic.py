import os
from PIL import Image, ImageDraw, ImageFont

def create_excel_infographic():
    W, H = 1600, 920
    im = Image.new("RGB", (W, H), "#F8FAFC")
    draw = ImageDraw.Draw(im)

    # Load Windows fonts
    def get_font(name, size, bold=False):
        font_file = "segoeuib.ttf" if bold else "segoeui.ttf"
        path = os.path.join(r"C:\Windows\Fonts", font_file)
        if not os.path.exists(path):
            font_file = "arialbd.ttf" if bold else "arial.ttf"
            path = os.path.join(r"C:\Windows\Fonts", font_file)
        return ImageFont.truetype(path, size)

    font_title = get_font("segoeui", 26, bold=True)
    font_subtitle = get_font("segoeui", 14, bold=False)
    font_panel_h = get_font("segoeui", 17, bold=True)
    font_panel_sub = get_font("segoeui", 12, bold=False)
    font_grid_hdr = get_font("segoeui", 13, bold=True)
    font_cell = get_font("segoeui", 13, bold=False)
    font_formula = get_font("consola", 14, bold=True)
    font_formula_lg = get_font("consola", 18, bold=True)
    font_lbl = get_font("segoeui", 11, bold=True)
    font_step_h = get_font("segoeui", 14, bold=True)
    font_step_txt = get_font("segoeui", 12, bold=False)

    # 1. Header Banner
    draw.rounded_rectangle([30, 20, W - 30, 90], radius=14, fill="#0F5132")
    draw.text((W / 2, 42), "LES RÉFÉRENCES DE CELLULES DANS MICROSOFT EXCEL", font=font_title, fill="#FFFFFF", anchor="mm")
    draw.text((W / 2, 70), "Comportement des Formules lors de la Recopie : Relatives, Absolues ($) et Mixtes", font=font_subtitle, fill="#D1E7DD", anchor="mm")

    # Helper: draw spreadsheet grid
    def draw_grid(x0, y0, cols, rows, col_w=82, row_h=36):
        total_w = 40 + len(cols) * col_w
        total_h = 30 + len(rows) * row_h
        
        # Grid corner
        draw.rectangle([x0, y0, x0 + 40, y0 + 30], fill="#E2E8F0", outline="#CBD5E1", width=1)
        
        # Column headers
        for i, c in enumerate(cols):
            cx = x0 + 40 + i * col_w
            draw.rectangle([cx, y0, cx + col_w, y0 + 30], fill="#EDF2F7", outline="#CBD5E1", width=1)
            draw.text((cx + col_w / 2, y0 + 15), c, font=font_grid_hdr, fill="#475569", anchor="mm")
            
        # Rows and row headers
        for j, r in enumerate(rows):
            ry = y0 + 30 + j * row_h
            draw.rectangle([x0, ry, x0 + 40, ry + row_h], fill="#EDF2F7", outline="#CBD5E1", width=1)
            draw.text((x0 + 20, ry + row_h / 2), str(r), font=font_grid_hdr, fill="#475569", anchor="mm")
            
            for i in range(len(cols)):
                cx = x0 + 40 + i * col_w
                draw.rectangle([cx, ry, cx + col_w, ry + row_h], fill="#FFFFFF", outline="#E2E8F0", width=1)
                
        return total_w, total_h

    # Helper: draw formula badge in a specific cell
    def draw_cell_badge(x0, y0, col_idx, row_idx, text, bg_color, border_color, text_color, col_w=82, row_h=36):
        cx = x0 + 40 + col_idx * col_w
        cy = y0 + 30 + row_idx * row_h
        pad = 3
        draw.rounded_rectangle([cx + pad, cy + pad, cx + col_w - pad, cy + row_h - pad], radius=6, fill=bg_color, outline=border_color, width=2)
        draw.text((cx + col_w / 2, cy + row_h / 2), text, font=font_formula, fill=text_color, anchor="mm")

    # Helper: draw clean arrow with arrowhead
    def draw_arrow(start, end, color="#2563EB", width=2, text=""):
        sx, sy = start
        ex, ey = end
        draw.line([sx, sy, ex, ey], fill=color, width=width)
        
        # Arrowhead
        import math
        angle = math.atan2(ey - sy, ex - sx)
        arrow_len = 9
        arrow_angle = math.pi / 6
        x1 = ex - arrow_len * math.cos(angle - arrow_angle)
        y1 = ey - arrow_len * math.sin(angle - arrow_angle)
        x2 = ex - arrow_len * math.cos(angle + arrow_angle)
        y2 = ey - arrow_len * math.sin(angle + arrow_angle)
        draw.polygon([(ex, ey), (x1, y1), (x2, y2)], fill=color)

    # -------------------------------------------------------------
    # ROW 1: 3 Panels
    # -------------------------------------------------------------
    panel_y = 105
    panel_h = 360
    
    # === PANEL 1: Référence Relative ===
    p1_x = 30
    p1_w = 485
    draw.rounded_rectangle([p1_x, panel_y, p1_x + p1_w, panel_y + panel_h], radius=12, fill="#FFFFFF", outline="#E2E8F0", width=1)
    draw.rectangle([p1_x, panel_y, p1_x + p1_w, panel_y + 44], fill="#F0FDF4")
    draw.text((p1_x + 16, panel_y + 14), "1. Référence Relative : A1", font=font_panel_h, fill="#166534")
    draw.text((p1_x + 16, panel_y + 54), "La référence s'adapte à la position lors de la recopie (aucun $)", font=font_panel_sub, fill="#4B5563")

    g1_x, g1_y = p1_x + 18, panel_y + 80
    cols1 = ['A', 'B', 'C', 'D']
    rows1 = [1, 2, 3, 4]
    draw_grid(g1_x, g1_y, cols1, rows1, col_w=105, row_h=42)

    # Source: B2 -> =A1
    draw_cell_badge(g1_x, g1_y, col_idx=1, row_idx=1, text="=A1", bg_color="#DCFCE7", border_color="#16A34A", text_color="#14532D", col_w=105, row_h=42)
    # Right: C2 -> =B1
    draw_cell_badge(g1_x, g1_y, col_idx=2, row_idx=1, text="=B1", bg_color="#EFF6FF", border_color="#3B82F6", text_color="#1E3A8A", col_w=105, row_h=42)
    # Down: B3 -> =A2
    draw_cell_badge(g1_x, g1_y, col_idx=1, row_idx=2, text="=A2", bg_color="#EFF6FF", border_color="#3B82F6", text_color="#1E3A8A", col_w=105, row_h=42)

    # Arrows with labels
    b2_right = (g1_x + 40 + 1 * 105 + 105 - 2, g1_y + 30 + 1 * 42 + 21)
    c2_left = (g1_x + 40 + 2 * 105 + 2, g1_y + 30 + 1 * 42 + 21)
    draw_arrow(b2_right, c2_left, color="#2563EB", width=2)
    
    b2_bottom = (g1_x + 40 + 1 * 105 + 52, g1_y + 30 + 1 * 42 + 42 - 2)
    b3_top = (g1_x + 40 + 1 * 105 + 52, g1_y + 30 + 2 * 42 + 2)
    draw_arrow(b2_bottom, b3_top, color="#2563EB", width=2)

    # Explanation badge at bottom of panel 1
    draw.rounded_rectangle([p1_x + 18, panel_y + 288, p1_x + p1_w - 18, panel_y + 346], radius=8, fill="#F8FAFC", outline="#E2E8F0", width=1)
    draw.text((p1_x + 28, panel_y + 296), "• Recopie droite (B2 vers C2) : colonne +1   ==>   A1 devient B1", font=font_step_txt, fill="#1E293B")
    draw.text((p1_x + 28, panel_y + 320), "• Recopie bas (B2 vers B3)    : ligne +1     ==>   A1 devient A2", font=font_step_txt, fill="#1E293B")

    # === PANEL 2: Référence Absolue ===
    p2_x = 530
    p2_w = 485
    draw.rounded_rectangle([p2_x, panel_y, p2_x + p2_w, panel_y + panel_h], radius=12, fill="#FFFFFF", outline="#E2E8F0", width=1)
    draw.rectangle([p2_x, panel_y, p2_x + p2_w, panel_y + 44], fill="#FEF3C7")
    draw.text((p2_x + 16, panel_y + 14), "2. Référence Absolue : $A$1", font=font_panel_h, fill="#92400E")
    draw.text((p2_x + 16, panel_y + 54), "Le symbole $ verrouille la colonne ET la ligne (aucun changement)", font=font_panel_sub, fill="#4B5563")

    g2_x, g2_y = p2_x + 18, panel_y + 80
    draw_grid(g2_x, g2_y, cols1, rows1, col_w=105, row_h=42)

    # Source: B2 -> =$A$1
    draw_cell_badge(g2_x, g2_y, col_idx=1, row_idx=1, text="=$A$1", bg_color="#FEF3C7", border_color="#D97706", text_color="#78350F", col_w=105, row_h=42)
    # Right: C2 -> =$A$1
    draw_cell_badge(g2_x, g2_y, col_idx=2, row_idx=1, text="=$A$1", bg_color="#FEF3C7", border_color="#D97706", text_color="#78350F", col_w=105, row_h=42)
    # Down: B3 -> =$A$1
    draw_cell_badge(g2_x, g2_y, col_idx=1, row_idx=2, text="=$A$1", bg_color="#FEF3C7", border_color="#D97706", text_color="#78350F", col_w=105, row_h=42)

    # Arrows
    b2_right2 = (g2_x + 40 + 1 * 105 + 105 - 2, g2_y + 30 + 1 * 42 + 21)
    c2_left2 = (g2_x + 40 + 2 * 105 + 2, g2_y + 30 + 1 * 42 + 21)
    draw_arrow(b2_right2, c2_left2, color="#D97706", width=2)
    
    b2_bottom2 = (g2_x + 40 + 1 * 105 + 52, g2_y + 30 + 1 * 42 + 42 - 2)
    b3_top2 = (g2_x + 40 + 1 * 105 + 52, g2_y + 30 + 2 * 42 + 2)
    draw_arrow(b2_bottom2, b3_top2, color="#D97706", width=2)

    # Explanation badge
    draw.rounded_rectangle([p2_x + 18, panel_y + 288, p2_x + p2_w - 18, panel_y + 346], radius=8, fill="#F8FAFC", outline="#E2E8F0", width=1)
    draw.text((p2_x + 28, panel_y + 296), "• $A verrouille la colonne A  |  $1 verrouille la ligne 1", font=font_step_txt, fill="#1E293B")
    draw.text((p2_x + 28, panel_y + 320), "• Partout où vous recopiez, l'adresse reste STRICTEMENT =$A$1", font=font_step_txt, fill="#92400E")

    # === PANEL 3: Références Mixtes ===
    p3_x = 1030
    p3_w = 540
    draw.rounded_rectangle([p3_x, panel_y, p3_x + p3_w, panel_y + panel_h], radius=12, fill="#FFFFFF", outline="#E2E8F0", width=1)
    draw.rectangle([p3_x, panel_y, p3_x + p3_w, panel_y + 44], fill="#F3E8FF")
    draw.text((p3_x + 16, panel_y + 14), "3. Références Mixtes : A$1 et $A1", font=font_panel_h, fill="#6B21A8")
    draw.text((p3_x + 16, panel_y + 54), "Un seul élément porte le symbole $ (cadenas partiel)", font=font_panel_sub, fill="#4B5563")

    # Subcard A: A$1
    card_a_y = panel_y + 80
    draw.rounded_rectangle([p3_x + 16, card_a_y, p3_x + p3_w - 16, card_a_y + 105], radius=8, fill="#FAF5FF", outline="#D8B4FE", width=1)
    draw.text((p3_x + 28, card_a_y + 12), "Type 1 : A$1  (Ligne 1 FIGÉE par le $)", font=font_step_h, fill="#581C87")
    draw.text((p3_x + 28, card_a_y + 38), "• La ligne 1 ne changera jamais lors d'une recopie vers le bas.", font=font_step_txt, fill="#374151")
    draw.text((p3_x + 28, card_a_y + 60), "• Recopie droite : A$1  ->  B$1  ->  C$1  (la colonne varie librement)", font=font_formula, fill="#6B21A8")
    draw.text((p3_x + 28, card_a_y + 82), "• Recopie bas    : reste A$1  (la ligne est bloquée)", font=font_formula, fill="#6B21A8")

    # Subcard B: $A1
    card_b_y = card_a_y + 115
    draw.rounded_rectangle([p3_x + 16, card_b_y, p3_x + p3_w - 16, card_b_y + 105], radius=8, fill="#F0FDFA", outline="#99F6E4", width=1)
    draw.text((p3_x + 28, card_b_y + 12), "Type 2 : $A1  (Colonne A FIGÉE par le $)", font=font_step_h, fill="#0F766E")
    draw.text((p3_x + 28, card_b_y + 38), "• La colonne A ne changera jamais lors d'une recopie vers la droite.", font=font_step_txt, fill="#374151")
    draw.text((p3_x + 28, card_b_y + 60), "• Recopie bas    : $A1  ->  $A2  ->  $A3  (la ligne s'incrémente)", font=font_formula, fill="#0F766E")
    draw.text((p3_x + 28, card_b_y + 82), "• Recopie droite : reste $A1  (la colonne est bloquée)", font=font_formula, fill="#0F766E")

    # Shortcut F4 box
    f4_y = card_b_y + 115
    draw.rounded_rectangle([p3_x + 16, f4_y, p3_x + p3_w - 16, panel_y + panel_h - 14], radius=8, fill="#F1F5F9", outline="#CBD5E1", width=1)
    draw.text((p3_x + 28, f4_y + 10), "[F4] Touche Raccourci F4 : Permute en boucle dans Excel :", font=font_step_h, fill="#1E293B")
    draw.text((p3_x + 28, f4_y + 32), "A1   ->   $A$1   ->   A$1   ->   $A1   ->   A1", font=font_formula, fill="#2563EB")

    # -------------------------------------------------------------
    # ROW 2: Grande Démonstration Pas à Pas (Type Concours)
    # -------------------------------------------------------------
    row2_y = 480
    row2_h = 415
    draw.rounded_rectangle([30, row2_y, W - 30, row2_y + row2_h], radius=14, fill="#FFFFFF", outline="#CBD5E1", width=1)
    draw.rectangle([30, row2_y, W - 30, row2_y + 46], fill="#F1F5F9")
    draw.text((50, row2_y + 15), "DÉMONSTRATION TYPE CONCOURS : RECOPIE DE LA FORMULE =2*B$4 DE A4 VERS C5", font=font_panel_h, fill="#0F172A")

    # Left: Grid
    gdemo_x, gdemo_y = 55, row2_y + 65
    cols_demo = ['A', 'B', 'C', 'D', 'E']
    rows_demo = [1, 2, 3, 4, 5]
    draw_grid(gdemo_x, gdemo_y, cols_demo, rows_demo, col_w=108, row_h=52)

    # Put source cell in A4
    draw_cell_badge(gdemo_x, gdemo_y, col_idx=0, row_idx=3, text="=2*B$4", bg_color="#EFF6FF", border_color="#2563EB", text_color="#1E40AF", col_w=108, row_h=52)
    # Put destination cell in C5
    draw_cell_badge(gdemo_x, gdemo_y, col_idx=2, row_idx=4, text="=2*D$4", bg_color="#ECFDF5", border_color="#059669", text_color="#065F46", col_w=108, row_h=52)

    # Step arrow from A4 to C5
    a4_center = (gdemo_x + 40 + 0 * 108 + 108, gdemo_y + 30 + 3 * 52 + 26)
    c5_center = (gdemo_x + 40 + 2 * 108, gdemo_y + 30 + 4 * 52 + 26)
    
    # Path with intermediate corner
    mid_x = gdemo_x + 40 + 2 * 108 - 25
    draw.line([a4_center[0], a4_center[1], mid_x, a4_center[1]], fill="#DC2626", width=3)
    draw.line([mid_x, a4_center[1], mid_x, c5_center[1]], fill="#DC2626", width=3)
    draw_arrow((mid_x, c5_center[1]), (c5_center[0] - 4, c5_center[1]), color="#DC2626", width=3)

    # Right: Step-by-step resolution box
    box_r_x = 660
    box_r_y = row2_y + 60
    box_r_w = W - 30 - box_r_x - 20
    box_r_h = row2_h - 75

    draw.rounded_rectangle([box_r_x, box_r_y, box_r_x + box_r_w, box_r_y + box_r_h], radius=10, fill="#F8FAFC", outline="#E2E8F0", width=1)

    steps = [
        ("Étape 1 : Analyser le Déplacement Spatial (de la cellule A4 vers C5)", [
            "• Colonnes : de la colonne A à la colonne C   ==>  Décalage horizontal de +2 colonnes vers la droite.",
            "• Lignes   : de la ligne 4 à la ligne 5       ==>  Décalage vertical de +1 ligne vers le bas."
        ]),
        ("Étape 2 : Appliquer le Décalage à Chaque Morceau de la Formule", [
            "• Le facteur constant '2*'           ==>  Reste inchangé (constante numérique).",
            "• La lettre 'B' (colonne relative)   ==>  B + 2 colonnes = D.",
            "• Le nombre '$4' (ligne absolue)     ==>  Verrouillé par le $, il RESTE STRICTEMENT $4 !"
        ]),
        ("Étape 3 : Synthèse et Résultat Final Obtenu en C5", [
            "• Formule de départ en A4 :  =2*B$4",
            "• Formule finale en C5   :  =2*D$4"
        ])
    ]

    sy = box_r_y + 15
    for title, items in steps:
        draw.text((box_r_x + 20, sy), title, font=font_step_h, fill="#0F172A")
        sy += 24
        for item in items:
            if "Formule finale" in item:
                draw.text((box_r_x + 28, sy), item, font=font_formula_lg, fill="#047857")
                sy += 28
            elif "Formule de départ" in item:
                draw.text((box_r_x + 28, sy), item, font=font_formula, fill="#1E40AF")
                sy += 24
            else:
                draw.text((box_r_x + 28, sy), item, font=font_step_txt, fill="#334155")
                sy += 22
        sy += 10

    # Save to public and dist
    os.makedirs("frontend/public/images", exist_ok=True)
    os.makedirs("frontend/dist/images", exist_ok=True)
    target1 = "frontend/public/images/excel_cell_references.png"
    target2 = "frontend/dist/images/excel_cell_references.png"
    im.save(target1, format="PNG", quality=95)
    im.save(target2, format="PNG", quality=95)
    print(f"Infographic generated successfully: {target1} ({W}x{H})")

if __name__ == "__main__":
    create_excel_infographic()
