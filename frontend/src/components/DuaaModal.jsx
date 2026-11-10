import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, BookOpen } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const THIRTY_MINUTES_SEC = 30 * 60; // 1800 secondes = 30 minutes
const IDLE_TIMEOUT_MS = 90 * 1000; // 90 secondes d'inactivité -> pause

export default function DuaaModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const activeCampaignIdRef = useRef(0);
  const lastActivityRef = useRef(Date.now());
  const isIdleRef = useRef(false);

  // Clés de stockage scopées par compte utilisateur (ou invité) pour que chaque compte soit indépendant
  const userSuffix = user?.id ? `_u${user.id}` : '_guest';
  const userCampaignKey = `infor_last_seen_duaa_campaign${userSuffix}`;
  const userTimerKey = `infor_duaa_first_30m_shown${userSuffix}`;
  const userSecondsKey = `infor_active_seconds_total${userSuffix}`;

  useEffect(() => {
    // 1. Écouteur pour ouverture manuelle immédiate (aperçu admin)
    const handleTrigger = () => {
      setIsOpen(true);
    };
    window.addEventListener('show_duaa_modal', handleTrigger);

    // 2. Vérification de relance globale (réservée aux relances pour utilisateurs existants)
    const checkCampaign = async () => {
      try {
        const res = await API.get('auth/duaa-campaign/');
        const campaign = res.data;
        if (campaign && campaign.is_instant && campaign.campaign_id) {
          const stored = localStorage.getItem(userCampaignKey);

          // RÈGLE STRICTE : Un nouveau compte (ou première visite) ne doit JAMAIS avoir la pop-up à l'ouverture.
          // Il doit obligatoirement passer par les 30 premières minutes de révision normale.
          if (!stored) {
            localStorage.setItem(userCampaignKey, campaign.campaign_id.toString());
            return;
          }

          // Si le compte a été créé après le lancement de cette campagne, ne pas lui imposer la pop-up
          if (user?.created_at) {
            const userCreatedSec = Math.floor(new Date(user.created_at).getTime() / 1000);
            if (userCreatedSec >= campaign.campaign_id) {
              localStorage.setItem(userCampaignKey, campaign.campaign_id.toString());
              return;
            }
          }

          const lastSeenCampaign = parseInt(stored, 10);
          if (campaign.campaign_id > lastSeenCampaign) {
            // Relance déclenchée par l'admin pour un utilisateur existant
            activeCampaignIdRef.current = campaign.campaign_id;
            setIsOpen(true);
            return;
          }
        }
      } catch (err) {
        // En cas d'erreur réseau, fonctionnement normal
      }
    };
    checkCampaign();

    // 3. Gestion de l'activité utilisateur (timer normal : premières 30 minutes)
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      isIdleRef.current = false;
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(evt => window.addEventListener(evt, handleActivity, { passive: true }));

    // Pause du timer si inactif pendant plus de 90 secondes
    const idleInterval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS) {
        isIdleRef.current = true;
      }
    }, 5000);

    // Timer des premières 30 minutes pour ce compte
    const timer = setInterval(() => {
      const first30mShown = localStorage.getItem(userTimerKey);
      if (first30mShown === 'true') {
        return; // S'ouvre dans les premières 30 min (une seule fois pour ce compte)
      }

      // Seulement si l'onglet est visible et l'utilisateur est actif
      if (!document.hidden && !isIdleRef.current) {
        const currentSeconds = parseInt(localStorage.getItem(userSecondsKey) || '0', 10) + 1;
        localStorage.setItem(userSecondsKey, currentSeconds.toString());

        if (currentSeconds >= THIRTY_MINUTES_SEC) {
          setIsOpen(true);
          localStorage.setItem(userTimerKey, 'true');
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('show_duaa_modal', handleTrigger);
      events.forEach(evt => window.removeEventListener(evt, handleActivity));
      clearInterval(idleInterval);
      clearInterval(timer);
    };
  }, [user?.id, userCampaignKey, userTimerKey, userSecondsKey]);

  const handleClose = () => {
    setIsOpen(false);
    if (activeCampaignIdRef.current > 0) {
      localStorage.setItem(userCampaignKey, activeCampaignIdRef.current.toString());
    }
    localStorage.setItem(userTimerKey, 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop sombre et flou */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Carte Modale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-900/40 overflow-hidden z-10 text-slate-800 dark:text-slate-100"
          >
            {/* Ligne d'accent supérieure dorée/émeraude */}
            <div className="h-2 w-full bg-gradient-to-r from-[#03594e] via-[#F8C62F] to-[#03594e]" />

            {/* Bouton Fermer (X) */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              {/* En-tête avec badge et icône */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#03594e] to-emerald-600 text-white shadow-lg shadow-emerald-900/20 mx-auto">
                  <Heart className="w-7 h-7 text-[#F8C62F] fill-[#F8C62F]" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-bold text-[#03594e] dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#F8C62F]" />
                  <span>تذكير طيب • دعوة صالحة بالتوفيق</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  تذكير طيب • دعوة صالحة بظهر الغيب
                </h3>
              </div>

              {/* Texte du Douaa en Arabe */}
              <div 
                dir="rtl"
                className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-emerald-50/30 dark:from-slate-800/80 dark:to-slate-800/40 border border-emerald-200/70 dark:border-emerald-700/40 text-right space-y-3"
              >
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                  ما شاء الله تبارك الله، نسأل الله العلي القدير أن يبارك في وقتك وجهدك، وأن يوفقك ويسدد خطاك ويفتح لك أبواب النجاح والتيسير في مسيرتك العلمية والمهنية.
                </p>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-800/40 shadow-xs">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                    فضلاً وليس أمراً، لا تنسَ أخاك صاحب ومطور هذه المنصة من صالح دعائك بظهر الغيب :
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#03594e] dark:text-[#F8C62F] leading-loose">
                    « اللهم بارك له في علمه ورزقه، واغفر له ولوالديه وإخوانه وأحبابه ولجميع المسلمين، واجعل هذا العمل خالصاً لوجهك الكريم وصدقة جارية. »
                  </p>
                </div>
              </div>

              {/* Note en Français discrète */}
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                Qu'Allah bénisse votre temps et vos efforts, et couronne votre préparation de succès. Si cette plateforme vous est utile, gardez son créateur dans vos prières bienveillantes.
              </p>

              {/* Bouton Unique : Continuer les révisions */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-[#03594e]/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  <BookOpen className="w-4 h-4 text-[#F8C62F]" />
                  <span>متابعة المراجعة • Continuer mes révisions</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
