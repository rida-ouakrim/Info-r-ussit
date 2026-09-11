"""
Management command : add_reseau_videos
Définit 1 seule vidéo globale de révision pour le cours de Réseau (Google Drive)
et préserve les 3 fiches de cours académiques théoriques.
"""
from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course

GLOBAL_RESEAU_VIDEO_URL = "/media/videos/reseau_global_darija.mp4"

SINGLE_RESEAU_VIDEO_CONTENT = """# Réseau Informatique : Cours complet de révision (Darija)

---

## 📌 Contenu Général de la Vidéo de Révision

Cette vidéo complète couvre l'ensemble du programme de Réseaux Informatiques pour la préparation aux concours :

1. **Introduction aux réseaux informatiques & Topologies** (LAN, WAN, MAN, Étoile, Bus, Mesh).
2. **Modèles de référence OSI & TCP/IP** (Les 7 couches OSI, 4 couches TCP/IP, l'encapsulation de données).
3. **Adressage IPv4 & Sous-réseaux (Subnetting / CIDR / VLSM)**.
4. **Protocoles de routage statique & dynamique** (RIP, OSPF, BGP).
5. **Services & Sécurité réseau** (DHCP, DNS, NAT/PAT, Firewall, ACL, VPN, SSH/HTTPS).

---

### 🎥 Visionner le cours vidéo complet

Regardez la vidéo dans l'onglet **Leçon Vidéo** ci-dessus pour suivre la révision globale pas-à-pas.
"""

class Command(BaseCommand):
    help = "Consolide les vidéos réseaux en 1 seule vidéo globale de révision et restaure les fiches théoriques textuelles"

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code="SYS_NET").first()
        if not subdomain:
            self.stderr.write("Sous-domaine SYS_NET introuvable !")
            return

        # 1. Restore academic text fiches (video_url = None)
        academic_titles = [
            "Architecture réseau : Couches et protocoles du modèle OSI et TCP/IP",
            "Adressage IPv4, classes, CIDR et calcul de sous-réseaux (VLSM)",
            "Protocoles de routage (RIP, OSPF) et fondamentaux de l'IPv6"
        ]

        for title in academic_titles:
            c = Course.objects.filter(subdomain=subdomain, title__icontains=title.split(':')[0]).first()
            if c:
                c.video_url = None
                c.save()
                self.stdout.write(f"  [RESTORE FICHE] {c.title} (video_url = None)")

        # Also reset any other academic courses in SYS_NET that were not intended to be videos
        for c in Course.objects.filter(subdomain=subdomain):
            if not c.title.startswith("Reseau ") and not c.title.startswith("Réseau "):
                c.video_url = None
                c.save()

        # 2. Delete all fragmented video cards (Reseau 01..05, Réseau 01..05)
        deleted_count, _ = Course.objects.filter(subdomain=subdomain).filter(
            title__startswith="Reseau "
        ).delete()
        
        deleted_count2, _ = Course.objects.filter(subdomain=subdomain).filter(
            title__startswith="Réseau 0"
        ).delete()

        self.stdout.write(f"  [CLEANUP] Supprimé {deleted_count + deleted_count2} cartes vidéos fragmentées")

        # 3. Create or update the SINGLE global video course card
        single_video_course, created = Course.objects.update_or_create(
            subdomain=subdomain,
            title="Réseau Informatique : Cours complet de révision (Darija)",
            defaults={
                "content": SINGLE_RESEAU_VIDEO_CONTENT.strip(),
                "video_url": GLOBAL_RESEAU_VIDEO_URL,
            }
        )

        status = "Créée" if created else "Mise à jour"
        self.stdout.write(f"  [SINGLE VIDEO] {status}: {single_video_course.title}")
        self.stdout.write(self.style.SUCCESS("\n[OK] Restauration terminée avec succès ! 3 fiches théoriques + 1 vidéo globale de révision."))
