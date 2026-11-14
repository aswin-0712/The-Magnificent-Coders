import { Bell, Globe, Lock, Save, Shield, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatDateDisplay } from '../utils/crypto';

export default function Settings() {
  const { user, lastSignInAt, preferences, updateProfile, updatePreferences } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [department, setDepartment] = useState(user.department || 'Cyber & Financial Forensics Unit');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email cannot be empty.');
      return;
    }
    updateProfile({ name, email, department });
    setEditingProfile(false);
    toast.success('Profile settings updated.');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please complete the password fields.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password should be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Demo Notice: Password change simulated locally (no live auth backend connected).');
  };

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ${
        checked ? 'bg-[#7656E8]' : 'bg-[#CBD5E1]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-150 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Manage your account and application preferences.
        </p>
      </div>

      {/* 1. Profile Settings */}
      <section className="forensic-card p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F0EBFF] text-[#7656E8] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#172554]">Profile Settings</h2>
              <p className="text-xs text-[#64748B]">Investigator identity displayed across reports and logs</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditingProfile((prev) => !prev)}
            className="px-4 py-2 rounded-xl bg-[#F5F6FC] hover:bg-[#F0EBFF] text-xs font-semibold text-[#7656E8] transition-colors"
          >
            {editingProfile ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7656E8] to-[#367FEA] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
              {user.initials}
            </div>
            <div>
              <div className="text-base font-bold text-[#172554]">{user.name}</div>
              <div className="text-xs text-[#64748B]">{user.role}</div>
              <div className="text-xs text-[#7656E8] mt-0.5">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-semibold text-[#172554] mb-1.5">
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                disabled={!editingProfile}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] disabled:opacity-70 focus:outline-none focus:bg-white focus:border-[#7656E8]"
              />
            </div>

            <div>
              <label htmlFor="prof-email" className="block text-xs font-semibold text-[#172554] mb-1.5">
                Email Address
              </label>
              <input
                id="prof-email"
                type="email"
                disabled={!editingProfile}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] disabled:opacity-70 focus:outline-none focus:bg-white focus:border-[#7656E8]"
              />
            </div>

            <div>
              <label htmlFor="prof-dept" className="block text-xs font-semibold text-[#172554] mb-1.5">
                Unit / Department
              </label>
              <input
                id="prof-dept"
                type="text"
                disabled={!editingProfile}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] disabled:opacity-70 focus:outline-none focus:bg-white focus:border-[#7656E8]"
              />
            </div>
          </div>

          {editingProfile && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7656E8] hover:bg-[#6445d8] text-white text-xs font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          )}
        </form>
      </section>

      {/* 2. Security Settings */}
      <section className="forensic-card p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E7F0]">
          <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] text-[#367FEA] flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#172554]">Security Settings</h2>
            <p className="text-xs text-[#64748B]">Password controls, session summary, and local security preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handlePasswordUpdate} className="lg:col-span-7 space-y-3.5">
            <h3 className="text-xs font-semibold text-[#172554] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#7656E8]" /> Change Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                aria-label="Current password"
                className="h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs text-[#172554] focus:outline-none focus:bg-white focus:border-[#7656E8]"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                aria-label="New password"
                className="h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs text-[#172554] focus:outline-none focus:bg-white focus:border-[#7656E8]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new"
                aria-label="Confirm new password"
                className="h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-xs text-[#172554] focus:outline-none focus:bg-white focus:border-[#7656E8]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#172554] hover:bg-[#1e3170] text-white text-xs font-semibold"
            >
              Update Password
            </button>
          </form>

          <div className="lg:col-span-5 p-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] space-y-2.5 text-xs">
            <div className="font-semibold text-[#172554]">Session Information</div>
            <div className="flex justify-between text-[#64748B]">
              <span>Session Mode:</span>
              <span className="font-medium text-[#172554]">Browser Demo Session</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>Signed In:</span>
              <span className="font-mono text-[#172554] tabular-nums">
                {lastSignInAt
                  ? formatDateDisplay(lastSignInAt, preferences.dateFormat)
                  : 'Current Session'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#E5E7F0]">
              <span className="text-[#172554] font-medium">Require 2FA Prompt (Backend)</span>
              <ToggleSwitch
                checked={preferences.twoFactorReminder}
                onChange={(val) => {
                  updatePreferences({ twoFactorReminder: val });
                  toast.success('Security preference saved.');
                }}
                label="Toggle two-factor prompt preference"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Notification Settings & 4. Application Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="forensic-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E7F0]">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#22B981] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#172554]">Notification Settings</h2>
              <p className="text-xs text-[#64748B]">Configure workspace alert channels</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#172554]">Email Notifications</div>
                <div className="text-xs text-[#64748B]">Receive case activity digests via email</div>
              </div>
              <ToggleSwitch
                checked={preferences.emailNotifications}
                onChange={(val) => {
                  updatePreferences({ emailNotifications: val });
                  toast.success(`Email notifications ${val ? 'enabled' : 'disabled'}.`);
                }}
                label="Email notifications"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#172554]">Analysis Completion Alerts</div>
                <div className="text-xs text-[#64748B]">Notify when AI evidence analysis finishes</div>
              </div>
              <ToggleSwitch
                checked={preferences.analysisNotifications}
                onChange={(val) => {
                  updatePreferences({ analysisNotifications: val });
                  toast.success(`Analysis alerts ${val ? 'enabled' : 'disabled'}.`);
                }}
                label="Analysis completion notifications"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-[#172554]">Report Generation Alerts</div>
                <div className="text-xs text-[#64748B]">Notify when PDF dossiers are compiled</div>
              </div>
              <ToggleSwitch
                checked={preferences.reportNotifications}
                onChange={(val) => {
                  updatePreferences({ reportNotifications: val });
                  toast.success(`Report alerts ${val ? 'enabled' : 'disabled'}.`);
                }}
                label="Report generation notifications"
              />
            </div>
          </div>
        </section>

        <section className="forensic-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E7F0]">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#172554]">Application Preferences</h2>
              <p className="text-xs text-[#64748B]">Regional formatting and default workspace theme</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="pref-lang" className="block text-xs font-semibold text-[#172554] mb-1.5">
                Language
              </label>
              <select
                id="pref-lang"
                value={preferences.language}
                onChange={(e) => {
                  updatePreferences({ language: e.target.value });
                  toast.success(`Language set to ${e.target.value}`);
                }}
                className="w-full h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:border-[#7656E8]"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="English (India)">English (India)</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-date" className="block text-xs font-semibold text-[#172554] mb-1.5">
                Date Format
              </label>
              <select
                id="pref-date"
                value={preferences.dateFormat}
                onChange={(e) => {
                  updatePreferences({ dateFormat: e.target.value });
                  toast.success(`Date format updated to ${e.target.value}`);
                }}
                className="w-full h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:border-[#7656E8]"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Forensics Standard)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-theme" className="block text-xs font-semibold text-[#172554] mb-1.5">
                Theme Preference
              </label>
              <select
                id="pref-theme"
                value={preferences.theme}
                onChange={(e) => {
                  updatePreferences({ theme: e.target.value });
                  toast.success('Light Theme remains active across EVIDENCE AI.');
                }}
                className="w-full h-10 px-3 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] focus:outline-none focus:border-[#7656E8]"
              >
                <option value="Light (Default)">Light Theme (Default)</option>
                <option value="Light — High Contrast">Light — High Contrast</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
