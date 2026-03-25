import { useState } from 'react';
import {
  Globe, Bell, Shield, Database, ScanLine, Save,
  ChevronRight, Moon, Smartphone, Clock, Lock,
  Server, RefreshCw, CheckCircle2,
} from 'lucide-react';
import { StatusBar } from '../layout/StatusBar';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-blue-600' : 'bg-slate-300'}`}
  >
    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export function SystemSettingsScreen() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    language: 'Français',
    darkMode: false,
    notifications: true,
    emailAlerts: true,
    securityAlerts: true,
    twoFactor: true,
    sessionTimeout: true,
    autoBackup: true,
    autoArchive: false,
    ocrEnabled: true,
    autoClassify: true,
    ocrLanguage: 'Arabe + Français',
    confidenceThreshold: '80%',
    backupFreq: 'Quotidienne',
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Section = ({ title, icon: Icon, color, children }: {
    title: string; icon: typeof Globe; color: string; children: React.ReactNode;
  }) => (
    <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={`flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 ${color}`}>
        <Icon size={14} className="shrink-0" />
        <p className="text-xs font-bold uppercase tracking-wider">{title}</p>
      </div>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  );

  const Row = ({
    label, desc, type = 'toggle', value, onToggle, chipValue, chevron = false,
  }: {
    label: string; desc?: string; type?: 'toggle' | 'chip' | 'nav';
    value?: boolean; onToggle?: () => void; chipValue?: string; chevron?: boolean;
  }) => (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 font-medium">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      {type === 'toggle' && value !== undefined && onToggle && (
        <Toggle value={value} onChange={onToggle} />
      )}
      {type === 'chip' && chipValue && (
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{chipValue}</span>
          {chevron && <ChevronRight size={13} className="text-slate-400" />}
        </div>
      )}
      {type === 'nav' && <ChevronRight size={15} className="text-slate-300" />}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <TopBar title="Paramètres Système" showBack showMore />

      <div className="flex-1 overflow-y-auto bg-slate-50 pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* General */}
        <Section title="Général" icon={Globe} color="text-slate-700 bg-slate-50">
          <Row label="Langue" type="chip" chipValue={settings.language} chevron />
          <Row label="Mode sombre" type="toggle" value={settings.darkMode} onToggle={() => toggle('darkMode')} />
          <Row label="Version application" type="chip" chipValue="v2.4.1" />
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell} color="text-blue-700 bg-blue-50">
          <Row
            label="Notifications activées"
            desc="Recevoir les alertes en temps réel"
            type="toggle"
            value={settings.notifications}
            onToggle={() => toggle('notifications')}
          />
          <Row
            label="Alertes par email"
            desc="Envoi d'un résumé quotidien"
            type="toggle"
            value={settings.emailAlerts}
            onToggle={() => toggle('emailAlerts')}
          />
          <Row
            label="Alertes de sécurité"
            desc="Connexions suspectes, accès non autorisés"
            type="toggle"
            value={settings.securityAlerts}
            onToggle={() => toggle('securityAlerts')}
          />
        </Section>

        {/* Security */}
        <Section title="Sécurité" icon={Shield} color="text-red-600 bg-red-50">
          <Row
            label="Authentification à deux facteurs"
            desc="Ajoute une couche de sécurité"
            type="toggle"
            value={settings.twoFactor}
            onToggle={() => toggle('twoFactor')}
          />
          <Row
            label="Expiration de session"
            desc="Déconnexion automatique après 30 min"
            type="toggle"
            value={settings.sessionTimeout}
            onToggle={() => toggle('sessionTimeout')}
          />
          <Row label="Durée de session" type="chip" chipValue="30 min" chevron />
          <Row label="Journal d'audit" type="nav" />
          <Row label="Réinitialiser tous les mots de passe" type="nav" />
        </Section>

        {/* OCR & Classification */}
        <Section title="OCR & Classification IA" icon={ScanLine} color="text-violet-700 bg-violet-50">
          <Row
            label="OCR activé"
            desc="Extraction automatique du texte"
            type="toggle"
            value={settings.ocrEnabled}
            onToggle={() => toggle('ocrEnabled')}
          />
          <Row
            label="Classification automatique"
            desc="Suggestions basées sur l'IA"
            type="toggle"
            value={settings.autoClassify}
            onToggle={() => toggle('autoClassify')}
          />
          <Row label="Langue OCR" type="chip" chipValue={settings.ocrLanguage} chevron />
          <Row label="Seuil de confiance" type="chip" chipValue={settings.confidenceThreshold} chevron />
        </Section>

        {/* Backup & Archive */}
        <Section title="Sauvegarde & Archivage" icon={Database} color="text-green-700 bg-green-50">
          <Row
            label="Sauvegarde automatique"
            desc="Sauvegarde chiffrée sur le serveur"
            type="toggle"
            value={settings.autoBackup}
            onToggle={() => toggle('autoBackup')}
          />
          <Row label="Fréquence de sauvegarde" type="chip" chipValue={settings.backupFreq} chevron />
          <Row
            label="Archivage automatique"
            desc="Archiver les courriers traités après 90 jours"
            type="toggle"
            value={settings.autoArchive}
            onToggle={() => toggle('autoArchive')}
          />
          <Row label="Lancer la sauvegarde maintenant" type="nav" />
        </Section>

        {/* System info */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Informations Système</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Serveur', value: 'Ubuntu 22.04', icon: Server },
              { label: 'BD', value: 'PostgreSQL 15', icon: Database },
              { label: 'Dernier backup', value: 'Hier 02:00', icon: Clock },
              { label: 'Mise à jour', value: 'À jour', icon: RefreshCw },
            ].map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="bg-slate-50 rounded-xl p-2.5 flex items-start gap-2">
                  <Icon size={13} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">{info.label}</p>
                    <p className="text-xs font-semibold text-slate-700">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="mx-4 mt-4 mb-2">
          <button
            onClick={handleSave}
            className={`w-full rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${saved ? 'bg-green-500 shadow-green-200' : 'bg-blue-600 shadow-blue-200'} text-white active:scale-95`}
          >
            {saved ? (
              <><CheckCircle2 size={16} /> Paramètres enregistrés</>
            ) : (
              <><Save size={16} /> Enregistrer les paramètres</>
            )}
          </button>
        </div>
      </div>

      <BottomNav active="settings" />
    </div>
  );
}
