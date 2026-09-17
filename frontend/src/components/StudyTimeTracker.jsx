import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const IDLE_TIMEOUT_MS = 90 * 1000; // 90 secondes d'inactivité -> pause du compteur
const HEARTBEAT_INTERVAL_SEC = 30; // Envoie du battement de cœur toutes les 30s actives

const StudyTimeTracker = () => {
  const { user } = useAuth();
  const [isIdle, setIsIdle] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(document.hidden);
  
  const activeSecondsRef = useRef(0);
  const lastActivityTimeRef = useRef(Date.now());
  const heartbeatTimerRef = useRef(null);
  const idleCheckIntervalRef = useRef(null);

  // 1. Écoute de l'activité utilisateur (souris, clavier, tactile, scroll)
  useEffect(() => {
    if (!user) return;

    const handleUserActivity = () => {
      lastActivityTimeRef.current = Date.now();
      if (isIdle) {
        setIsIdle(false);
      }
    };

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    // Détection du changement de visibilité de l'onglet (minimisé ou en arrière-plan)
    const handleVisibilityChange = () => {
      const hidden = document.hidden;
      setIsTabHidden(hidden);
      if (!hidden) {
        lastActivityTimeRef.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Vérification régulière d'inactivité (toutes les 5s)
    idleCheckIntervalRef.current = setInterval(() => {
      if (Date.now() - lastActivityTimeRef.current > IDLE_TIMEOUT_MS) {
        setIsIdle(true);
      }
    }, 5000);

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (idleCheckIntervalRef.current) clearInterval(idleCheckIntervalRef.current);
    };
  }, [user, isIdle]);

  // 2. Compteur de secondes actives et envoi des Heartbeats API
  useEffect(() => {
    if (!user) return;

    const sendHeartbeat = async (secondsToSend) => {
      if (secondsToSend <= 0) return;
      try {
        await API.post('auth/track-time/', { seconds: secondsToSend });
      } catch (err) {
        // En cas d'erreur réseau temporaire, ré-accumuler pour le prochain essai
        activeSecondsRef.current += secondsToSend;
      }
    };

    heartbeatTimerRef.current = setInterval(() => {
      // Seulement si l'utilisateur est actif et l'onglet est visible
      if (!isIdle && !isTabHidden) {
        activeSecondsRef.current += 1;

        if (activeSecondsRef.current >= HEARTBEAT_INTERVAL_SEC) {
          const secondsToFlush = activeSecondsRef.current;
          activeSecondsRef.current = 0;
          sendHeartbeat(secondsToFlush);
        }
      }
    }, 1000);

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      // Flusher les secondes restantes à la fermeture/démontage
      if (activeSecondsRef.current >= 5) {
        sendHeartbeat(activeSecondsRef.current);
        activeSecondsRef.current = 0;
      }
    };
  }, [user, isIdle, isTabHidden]);

  return null; // Composant d'arrière-plan totalement invisible
};

export default StudyTimeTracker;
