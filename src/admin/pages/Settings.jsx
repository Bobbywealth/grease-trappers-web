import React from 'react';
import { Settings as SettingsIcon, Database, Globe, Bell, Mail, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Account and system configuration</p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-gray-400" />
          Your Account
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <div className="text-sm text-gray-900">{user?.name}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <div className="text-sm text-gray-900">{user?.email}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
            <span className="badge badge-pink capitalize">{user?.role}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          To change your name, email, or password, contact another admin.
        </p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-gray-400" />
          Integrations (Coming Soon)
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-xs text-gray-500">Resend integration for invoice delivery</div>
              </div>
            </div>
            <span className="text-xs text-gray-400">Phase 2</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-xs text-gray-500">Twilio for job reminders & confirmations</div>
              </div>
            </div>
            <span className="text-xs text-gray-400">Phase 2</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">Google Maps</div>
                <div className="text-xs text-gray-500">Address autocomplete + route optimization</div>
              </div>
            </div>
            <span className="text-xs text-gray-400">Phase 2</span>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-400" />
          Notifications
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-not-allowed opacity-60">
            <span className="text-sm">Job completion notifications</span>
            <input type="checkbox" disabled className="w-4 h-4" />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-not-allowed opacity-60">
            <span className="text-sm">Daily summary email</span>
            <input type="checkbox" disabled className="w-4 h-4" />
          </label>
        </div>
      </div>
    </div>
  );
}