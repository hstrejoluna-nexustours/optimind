import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { AbcdeEntry, MoodCheckIn, PlanTier, VanWestendorpResponse } from './types';
import { INITIAL_ENTRIES } from './data/initialData';
import { Navbar, AppTab } from './components/Navbar';
import { SantuarioTab } from './components/SantuarioTab';
import { WikiTab } from './components/WikiTab';
import { GlossaryTab } from './components/GlossaryTab';
import { AbcdeGymTab } from './components/AbcdeGymTab';
import { MicroSaasLandingTab } from './components/MicroSaasLandingTab';
import { CheckoutModal } from './components/CheckoutModal';
import { ClinicalReportModal } from './components/ClinicalReportModal';
import { ThoughtStopperModal } from './components/ThoughtStopperModal';
import { JsonDataModal } from './components/JsonDataModal';
import { UserProfileModal } from './components/UserProfileModal';
import { UpgradeModal, UpgradeTriggerReason } from './components/UpgradeModal';
import { DevTierSwitcher } from './components/DevTierSwitcher';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  syncUserProfile, 
  subscribeToUserEntries, 
  saveUserEntryToCloud, 
  subscribeToUserMoods, 
  saveUserMoodToCloud, 
  saveBookmarksToCloud, 
  migrateLocalDataToCloud, 
  updateUserSubscriptionPlan,
  UserProfileData 
} from './services/firebase';
import { Cloud, CheckCircle2, ShieldCheck, Sparkles, Award } from 'lucide-react';

const STORAGE_ENTRIES_KEY = 'optimind_entries_v2';
const STORAGE_MOODS_KEY = 'optimind_moods_v2';
const STORAGE_BOOKMARKS_KEY = 'optimind_bookmarks_v2';
const STORAGE_PLAN_KEY = 'optimind_plan_v2';
const STORAGE_USER_TIER_KEY = 'user_tier';
const STORAGE_TRIAL_DAYS_KEY = 'trial_days_left';
const STORAGE_BONUS_CREDITS_KEY = 'optimind_bonus_credits_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('santuario');

  // Firebase Auth & Cloud Profile State
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MicroSaaS Plan Tier State (Default: reverse_trial, 14 days)
  const [currentPlan, setCurrentPlan] = useState<PlanTier>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_USER_TIER_KEY) || localStorage.getItem(STORAGE_PLAN_KEY);
        if (stored === 'reverse_trial' || stored === 'free' || stored === 'pro' || stored === 'executive' || stored === 'clinical') {
          return stored as PlanTier;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return 'reverse_trial';
  });

  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_TRIAL_DAYS_KEY);
        if (stored) return parseInt(stored, 10);
      } catch (e) {}
    }
    return 14;
  });

  const [bonusCredits, setBonusCredits] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_BONUS_CREDITS_KEY);
        if (stored) return parseInt(stored, 10);
      } catch (e) {}
    }
    return 0;
  });

  // Contextual Paywall Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeModalReason, setUpgradeModalReason] = useState<UpgradeTriggerReason>('limit_reached');
  const [hasCompletedVanWestendorp, setHasCompletedVanWestendorp] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return !!localStorage.getItem('optimind_van_westendorp_v1');
      } catch (e) {}
    }
    return false;
  });

  // Modals for MicroSaaS
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<PlanTier>('pro');
  const [isClinicalReportOpen, setIsClinicalReportOpen] = useState(false);

  // ABCDE Entries State (Initialized from localStorage fallback)
  const [entries, setEntries] = useState<AbcdeEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_ENTRIES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Error loading entries from localStorage', e);
      }
    }
    return INITIAL_ENTRIES;
  });

  // Mood Check-in History
  const [moods, setMoods] = useState<MoodCheckIn[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_MOODS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Error loading moods from localStorage', e);
      }
    }
    return [
      {
        id: 'mood-init',
        timestamp: new Date().toISOString(),
        score: 7,
        energy: 'sereno',
        note: 'Comenzando el día con presencia y disposición a aprender.'
      }
    ];
  });

  // Glossary Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Error loading bookmarks from localStorage', e);
      }
    }
    return ['modelo-abcde', 'descatastrofizacion', 'regla-optimismo-flexible'];
  });

  // Active workout entry being worked on
  const [activeGymEntry, setActiveGymEntry] = useState<Partial<AbcdeEntry> | undefined>(undefined);

  // Modals State
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isThoughtStopperOpen, setIsThoughtStopperOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3800);
  };

  // Local storage backup effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save entries to localStorage', e);
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MOODS_KEY, JSON.stringify(moods));
    } catch (e) {
      console.error('Failed to save moods to localStorage', e);
    }
  }, [moods]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLAN_KEY, currentPlan);
      localStorage.setItem(STORAGE_USER_TIER_KEY, currentPlan);
    } catch (e) {
      console.error('Failed to save plan to localStorage', e);
    }
  }, [currentPlan]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRIAL_DAYS_KEY, trialDaysLeft.toString());
    } catch (e) {
      console.error(e);
    }
  }, [trialDaysLeft]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BONUS_CREDITS_KEY, bonusCredits.toString());
    } catch (e) {
      console.error(e);
    }
  }, [bonusCredits]);

  // Firebase Auth Lifecycle & Real-time Firestore Subscriptions
  useEffect(() => {
    let unsubscribeEntries: (() => void) | undefined;
    let unsubscribeMoods: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        const currentStreak = Math.max(3, entries.length + moods.length);
        
        try {
          const profile = await syncUserProfile(currentUser, currentStreak, entries.length, bookmarks);
          setUserProfile(profile);

          if (profile.plan) {
            setCurrentPlan(profile.plan);
          }

          if (profile.bookmarkedTerms && profile.bookmarkedTerms.length > 0) {
            setBookmarks(profile.bookmarkedTerms);
          }

          unsubscribeEntries = subscribeToUserEntries(
            currentUser.uid,
            (cloudEntries) => {
              if (cloudEntries && cloudEntries.length > 0) {
                setEntries(cloudEntries);
              } else if (entries.length > 0) {
                migrateLocalDataToCloud(currentUser.uid, entries, moods, bookmarks);
              }
            },
            (err) => console.warn('Cloud entries subscription error:', err)
          );

          unsubscribeMoods = subscribeToUserMoods(
            currentUser.uid,
            (cloudMoods) => {
              if (cloudMoods && cloudMoods.length > 0) {
                setMoods(cloudMoods);
              }
            },
            (err) => console.warn('Cloud moods subscription error:', err)
          );

          showToast(`🌿 Sesión iniciada: ${currentUser.displayName || 'Bienvenido'}`);
        } catch (error) {
          console.error('Error synchronizing with Firestore:', error);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeEntries) unsubscribeEntries();
      if (unsubscribeMoods) unsubscribeMoods();
    };
  }, []);

  // Handlers for ABCDE, Moods, Bookmarks
  const handleSaveMoodCheckIn = async (newMood: MoodCheckIn) => {
    setMoods(prev => [newMood, ...prev]);

    if (user) {
      try {
        await saveUserMoodToCloud(user.uid, newMood);
        showToast('🌱 Estado anímico guardado en la nube');
      } catch (e) {
        console.error('Failed to save mood to cloud', e);
      }
    }
  };

  const handleToggleBookmark = async (termId: string) => {
    const next = bookmarks.includes(termId) 
      ? bookmarks.filter(id => id !== termId) 
      : [...bookmarks, termId];
    
    setBookmarks(next);

    if (user) {
      try {
        await saveBookmarksToCloud(user.uid, next);
      } catch (e) {
        console.error('Failed to sync bookmarks', e);
      }
    }
  };

  const handleSaveAbcdeEntry = async (newEntry: AbcdeEntry) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === newEntry.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newEntry;
        return updated;
      }
      return [newEntry, ...prev];
    });
    setActiveGymEntry(undefined);

    if (user) {
      try {
        await saveUserEntryToCloud(user.uid, newEntry);
        const nextStreak = Math.max(3, entries.length + moods.length + 1);
        await syncUserProfile(user, nextStreak, entries.length + 1, bookmarks);
        showToast('🧠 Ejercicio ABCDE respaldado en Cloud Firestore');
      } catch (e) {
        console.error('Failed to save entry to cloud', e);
      }
    }
  };

  const handleSelectSavedEntry = (entry: AbcdeEntry) => {
    setActiveGymEntry(entry);
    setCurrentTab('gimnasio');
  };

  const handleImportAllData = async (data: { entries?: AbcdeEntry[]; moods?: MoodCheckIn[]; bookmarks?: string[] }) => {
    if (data.entries && Array.isArray(data.entries)) setEntries(data.entries);
    if (data.moods && Array.isArray(data.moods)) setMoods(data.moods);
    if (data.bookmarks && Array.isArray(data.bookmarks)) setBookmarks(data.bookmarks);

    if (user) {
      showToast('Sincronizando respaldo importado a Firebase...');
      await migrateLocalDataToCloud(
        user.uid, 
        data.entries || entries, 
        data.moods || moods, 
        data.bookmarks || bookmarks
      );
      showToast('✅ Respaldo completo sincronizado con la nube');
    }
  };

  const handleResetToDefault = () => {
    setEntries(INITIAL_ENTRIES);
    setBookmarks(['modelo-abcde', 'descatastrofizacion', 'regla-optimismo-flexible']);
  };

  const handleLogin = async () => {
    try {
      const signedInUser = await loginWithGoogle();
      setIsProfileModalOpen(false);
      showToast(`🌿 Conectado con ${signedInUser.displayName || 'Google'}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserProfile(null);
      setIsProfileModalOpen(false);
      showToast('Sesión cerrada. Continuando en modo local.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncLocalToCloud = async () => {
    if (!user) return;
    await migrateLocalDataToCloud(user.uid, entries, moods, bookmarks);
    await syncUserProfile(user, Math.max(3, entries.length + moods.length), entries.length, bookmarks);
    showToast('☁️ Todos tus datos locales han sido respaldados en Firestore');
  };

  // MicroSaaS Subscription Handler
  const handleOpenCheckout = (plan: PlanTier) => {
    setCheckoutTargetPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleConfirmUpgrade = async (plan: PlanTier) => {
    setCurrentPlan(plan);
    if (user) {
      try {
        await updateUserSubscriptionPlan(user.uid, plan);
        setUserProfile(prev => prev ? { ...prev, plan } : null);
      } catch (e) {
        console.error('Failed to update subscription in Firestore:', e);
      }
    }
    showToast(`💎 ¡Plan ${plan === 'pro' ? 'Pro Resilience Pass' : plan === 'executive' ? 'Executive Coach' : 'Free'} activado!`);
  };

  // Contextual Paywall Upgrade Trigger Handler
  const handleTriggerUpgradeModal = (reason: UpgradeTriggerReason) => {
    setUpgradeModalReason(reason);
    setIsUpgradeModalOpen(true);
  };

  const handleStartProTrial = () => {
    setCurrentPlan('pro');
    setIsUpgradeModalOpen(false);
    showToast('💎 ¡Pase de Resiliencia Pro activado!');
  };

  // Van Westendorp Survey Handler
  const handleSurveyCompleted = (survey: VanWestendorpResponse) => {
    setHasCompletedVanWestendorp(true);
    setBonusCredits(prev => prev + 1);
    showToast('✨ Encuesta completada: +1 ejercicio mensual adicional desbloqueado');
  };

  // Dev Tier Switcher Handlers
  const handleSetTier = (tier: PlanTier) => {
    setCurrentPlan(tier);
    showToast(`⚙️ Modo QA: Nivel cambiado a ${tier}`);
  };

  const handleSetTrialDays = (days: number) => {
    setTrialDaysLeft(days);
  };

  const handleResetUsage = () => {
    showToast('⚙️ Modo QA: Contador de uso reiniciado');
  };

  // Exercises used this month (calculated)
  const exercisesUsedThisMonth = Math.max(1, entries.length);

  // Resilience streak calculation
  const streak = userProfile?.streak 
    ? Math.max(userProfile.streak, entries.length + moods.length) 
    : Math.max(3, entries.length + moods.length);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#333E38] selection:bg-[#2E5A44]/15 selection:text-[#2E5A44] transition-colors relative">
      {/* Top Persistent Header & Navigation (5 Tabs) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        streak={streak}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        user={user}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        currentPlan={currentPlan}
        trialDaysLeft={trialDaysLeft}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Floating Calm Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-[#2E5A44] text-[#FBF9F5] px-4 py-3 rounded-2xl shadow-tonal-xl border border-[#244836] flex items-center gap-2.5 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-[#FBF9F5]/90 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 pb-8">
        {currentTab === 'santuario' && (
          <SantuarioTab
            onGoToGym={() => {
              setActiveGymEntry(undefined);
              setCurrentTab('gimnasio');
            }}
            onGoToWiki={() => setCurrentTab('wiki')}
            onSaveMoodCheckIn={handleSaveMoodCheckIn}
            recentMoods={moods}
            currentTier={currentPlan}
            trialDaysLeft={trialDaysLeft}
            exercisesUsedThisMonth={exercisesUsedThisMonth}
            monthlyLimit={3}
            bonusCredits={bonusCredits}
            onOpenCheckout={handleOpenCheckout}
          />
        )}

        {currentTab === 'wiki' && (
          <WikiTab
            onGoToGymWithExample={() => {
              setActiveGymEntry(undefined);
              setCurrentTab('gimnasio');
            }}
          />
        )}

        {currentTab === 'glosario' && (
          <GlossaryTab
            bookmarkedIds={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            currentPlan={currentPlan}
            onOpenCheckout={handleOpenCheckout}
          />
        )}

        {currentTab === 'gimnasio' && (
          <AbcdeGymTab
            initialData={activeGymEntry}
            onSaveEntry={handleSaveAbcdeEntry}
            onOpenThoughtStopper={() => setIsThoughtStopperOpen(true)}
            savedEntries={entries}
            onSelectSavedEntry={handleSelectSavedEntry}
            currentTier={currentPlan}
            exercisesUsedThisMonth={exercisesUsedThisMonth}
            monthlyLimit={3}
            bonusCredits={bonusCredits}
            onTriggerUpgradeModal={handleTriggerUpgradeModal}
            onOpenClinicalReport={() => setIsClinicalReportOpen(true)}
          />
        )}

        {currentTab === 'microsaas' && (
          <MicroSaasLandingTab
            currentPlan={currentPlan}
            onSelectPlanToUpgrade={handleOpenCheckout}
            onGoToGym={() => {
              setActiveGymEntry(undefined);
              setCurrentTab('gimnasio');
            }}
            onOpenClinicalReport={() => setIsClinicalReportOpen(true)}
            onSurveyCompleted={handleSurveyCompleted}
            hasCompletedSurvey={hasCompletedVanWestendorp}
            bonusCreditsEarned={bonusCredits}
          />
        )}
      </main>

      {/* User Profile & Firebase Sync Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        userProfile={userProfile}
        currentPlan={currentPlan}
        onLogin={handleLogin}
        onLogout={handleLogout}
        entries={entries}
        moods={moods}
        streak={streak}
        onSyncLocalToCloud={handleSyncLocalToCloud}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenCheckout={handleOpenCheckout}
        onOpenClinicalReport={() => setIsClinicalReportOpen(true)}
      />

      {/* MicroSaaS Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        targetPlan={checkoutTargetPlan}
        onConfirmUpgrade={handleConfirmUpgrade}
        userEmail={user?.email || undefined}
      />

      {/* Contextual Paywall Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onStartProTrial={handleStartProTrial}
        reason={upgradeModalReason}
        trialDaysLeft={trialDaysLeft}
      />

      {/* Dev / QA Tier Switcher for Testing */}
      <DevTierSwitcher
        currentTier={currentPlan}
        trialDaysLeft={trialDaysLeft}
        bonusCredits={bonusCredits}
        onSetTier={handleSetTier}
        onSetTrialDays={handleSetTrialDays}
        onResetUsage={handleResetUsage}
      />

      {/* Clinical Report Printable Modal */}
      <ClinicalReportModal
        isOpen={isClinicalReportOpen}
        onClose={() => setIsClinicalReportOpen(false)}
        userProfile={userProfile}
        entries={entries}
        moods={moods}
        streak={streak}
      />

      {/* Thought Stopper Modal */}
      <ThoughtStopperModal
        isOpen={isThoughtStopperOpen}
        onClose={() => setIsThoughtStopperOpen(false)}
      />

      {/* JSON Backup & Restore Modal */}
      <JsonDataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        entries={entries}
        moods={moods}
        bookmarks={bookmarks}
        onImportAllData={handleImportAllData}
        onResetToDefault={handleResetToDefault}
      />

      {/* Horizontal Visual Banding (Wainscoting-style layout container in lower third) */}
      <footer className="wainscoting-band py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2E5A44] flex items-center justify-center text-[#FBF9F5] shadow-tonal-sm">
                <span className="text-sm">🌿</span>
              </div>
              <div>
                <span className="font-serif text-lg text-[#333E38] block leading-none">
                  OptiMind MicroSaaS
                </span>
                <span className="text-[11px] text-[#647069]">
                  Santuario & Gimnasio de Optimismo Aprendido
                </span>
              </div>
            </div>

            {/* Quick 5-tab anchor links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs text-[#55635C]">
              <button 
                onClick={() => setCurrentTab('santuario')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                🌿 Santuario
              </button>
              <button 
                onClick={() => setCurrentTab('wiki')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                📖 Wiki del Optimismo
              </button>
              <button 
                onClick={() => setCurrentTab('glosario')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                📚 Glosario
              </button>
              <button 
                onClick={() => setCurrentTab('gimnasio')} 
                className="hover:text-[#2E5A44] transition-colors"
              >
                🧠 Gimnasio ABCDE
              </button>
              <button 
                onClick={() => setCurrentTab('microsaas')} 
                className="text-[#C86D51] font-semibold hover:text-[#b1583d] transition-colors"
              >
                💎 Planes & Precios
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[#647069]">
            <p className="leading-relaxed max-w-xl">
              Plataforma MicroSaaS fundamentada en el marco cognitivo del Dr. Martin Seligman (UPenn). 
              Diseñado con principios de <em>Calm Technology</em>, Diseño Emocional y persistencia Zero-Trust en Google Cloud Firestore.
            </p>
            <div className="flex items-center gap-2 font-medium text-[#2E5A44]">
              <Cloud className="w-3.5 h-3.5" />
              <span>
                {user ? 'Sincronizado con Firebase Firestore' : 'Modo local seguro • Inicia sesión para sincronizar'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
