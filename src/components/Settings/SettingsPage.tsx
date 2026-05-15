import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Moon, Sun, Download, Upload, Trash2, Shield, Bell, Cpu, Palette, User, Camera, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadEbook, exportData } from '../../services/exportService';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, goals, activities } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [profileName, setProfileName] = useState(settings.profile?.name || '');

  const handleExport = () => {
    exportData({ goals, activities, settings }, 'json');
  };

  const handleEbookExport = () => {
    downloadEbook(goals, settings);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.goals && data.activities && data.settings) {
          alert('Data import is a premium feature. Your file is valid though!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (error) {
        alert('Failed to parse the backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear ALL your data? This action cannot be undone.')) {
      indexedDB.deleteDatabase('goalflow-db');
      window.location.reload();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateSettings({
        profile: {
          ...settings.profile,
          name: profileName || 'Achiever',
          avatar: base64,
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const saveProfileName = () => {
    updateSettings({
      profile: {
        ...settings.profile,
        name: profileName || 'Achiever',
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 pb-20"
    >
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-dark)]">Settings</h1>
        <p className="text-[var(--color-text-light)]">Manage your preferences and data.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Card className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-[var(--color-border-soft)] pb-4">
              <div className="rounded-xl bg-orange-100 p-2">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-text-dark)]">Profile Setup</h3>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-primary)] shadow-md">
                {settings.profile?.avatar ? (
                  <img src={settings.profile.avatar} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    {settings.profile?.name ? settings.profile.name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                  </span>
                )}
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 left-0 right-0 flex h-1/3 items-center justify-center bg-black/50 text-white transition-opacity hover:bg-black/70"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Your Name"
                    />
                  </div>
                  <Button onClick={saveProfileName} className="h-12">Save</Button>
                </div>
                <p className="text-xs text-[var(--color-text-light)]">
                  Your profile is stored locally and never sent to any server.
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-[var(--color-border-soft)] pb-4">
              <div className="rounded-xl bg-[var(--color-primary)]/30 p-2">
                <Palette className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-text-dark)]">Appearance</h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-[var(--color-text-dark)]">Theme</span>
                <span className="text-sm text-[var(--color-text-light)]">Choose light or dark mode</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-soft)] bg-gray-50 p-1">
                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    settings.theme === 'light' ? 'bg-white text-[var(--color-text-dark)] shadow-sm' : 'text-gray-500 hover:text-[var(--color-text-dark)]'
                  }`}
                >
                  <Sun className="h-4 w-4" /> Light
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    settings.theme === 'dark' ? 'bg-white text-[var(--color-text-dark)] shadow-sm' : 'text-gray-500 hover:text-[var(--color-text-dark)]'
                  }`}
                >
                  <Moon className="h-4 w-4" /> Dark
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <Card className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-[var(--color-border-soft)] pb-4">
              <div className="rounded-xl bg-purple-100 p-2">
                <Cpu className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-text-dark)]">AI Features</h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-[var(--color-text-dark)]">Enable Offline AI</span>
                <span className="text-sm text-[var(--color-text-light)]">Get smart suggestions and insights</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={settings.aiEnabled}
                  onChange={(e) => updateSettings({ aiEnabled: e.target.checked })}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--color-success)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300"></div>
              </label>
            </div>
          </Card>

          <Card className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-[var(--color-border-soft)] pb-4">
              <div className="rounded-xl bg-blue-100 p-2">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-text-dark)]">Data & Privacy</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-[var(--color-text-dark)]">Export Data</span>
                  <span className="text-sm text-[var(--color-text-light)]">Download a copy of your data</span>
                </div>
                <Button variant="secondary" size="sm" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-[var(--color-text-dark)]">Export E-Book</span>
                  <span className="text-sm text-[var(--color-text-light)]">Download a polished goal story</span>
                </div>
                <Button variant="secondary" size="sm" onClick={handleEbookExport} className="gap-2">
                  <BookOpen className="h-4 w-4" /> E-Book
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-[var(--color-text-dark)]">Import Data</span>
                  <span className="text-sm text-[var(--color-text-light)]">Restore from a backup file</span>
                </div>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImport}
                />
                <Button variant="secondary" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Import
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border-soft)] pt-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-[var(--color-error)]">Danger Zone</span>
                  <span className="text-sm text-[var(--color-text-light)]">Permanently delete all data</span>
                </div>
                <Button variant="danger" size="sm" onClick={handleClearData} className="gap-2">
                  <Trash2 className="h-4 w-4" /> Clear Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
