"use client";

import { useState } from "react";
import {
  BellIcon,
  CogIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    proofsVisible: true,
    activityVisible: false,
  });
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handlePrivacyChange = (key: string) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const tabs = [
    { id: "account", label: "Account", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "security", label: "Security", icon: ShieldCheckIcon },
    { id: "privacy", label: "Privacy", icon: GlobeAltIcon },
    { id: "appearance", label: "Appearance", icon: PaintBrushIcon },
    { id: "general", label: "General", icon: CogIcon },
  ];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-base-100 rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "text-base-content hover:bg-base-200"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="glass-card  rounded-lg shadow-sm">
            {activeTab === "account" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">First Name</span>
                      </label>
                      <input type="text" defaultValue="John" className="input input-bordered w-full" />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Last Name</span>
                      </label>
                      <input type="text" defaultValue="Doe" className="input input-bordered w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Email Address</span>
                    </label>
                    <input type="email" defaultValue="john.doe@example.com" className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Phone Number</span>
                    </label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-base-content">Notification Types</h3>
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-medium text-base-content capitalize">
                            {key === "sms" ? "SMS" : key} Notifications
                          </span>
                          <p className="text-sm text-base-content/70">
                            {key === "email" && "Receive notifications via email"}
                            {key === "push" && "Receive push notifications in browser"}
                            {key === "sms" && "Receive SMS notifications"}
                            {key === "marketing" && "Receive marketing updates and offers"}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={value}
                          onChange={() => handleNotificationChange(key)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-base-200">
                    <h3 className="font-medium text-base-content mb-4">Notification Frequency</h3>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>Immediately</option>
                      <option>Daily digest</option>
                      <option>Weekly digest</option>
                      <option>Never</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Save Preferences</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-base-content">Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text">Current Password</span>
                        </label>
                        <input type="password" className="input input-bordered w-full" />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text">New Password</span>
                        </label>
                        <input type="password" className="input input-bordered w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Confirm New Password</span>
                      </label>
                      <input type="password" className="input input-bordered w-full max-w-md" />
                    </div>
                    <button className="btn btn-primary">Update Password</button>
                  </div>

                  <div className="pt-6 border-t border-base-200 space-y-4">
                    <h3 className="font-medium text-base-content">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                      <div>
                        <p className="font-medium text-base-content">2FA Status</p>
                        <p className="text-sm text-base-content/70">Two-factor authentication is currently disabled</p>
                      </div>
                      <button className="btn btn-primary">Enable 2FA</button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-base-200 space-y-4">
                    <h3 className="font-medium text-base-content">Wallet Connection</h3>
                    <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                      <div>
                        <p className="font-medium text-base-content">Connected Wallet</p>
                        <p className="text-sm text-base-content/70 font-mono">0x1234...5678</p>
                      </div>
                      <button className="btn btn-outline">Disconnect</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-base-content">Profile Visibility</h3>
                    {Object.entries(privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-medium text-base-content">
                            {key === "profileVisible" && "Public Profile"}
                            {key === "proofsVisible" && "Public Proofs"}
                            {key === "activityVisible" && "Activity History"}
                          </span>
                          <p className="text-sm text-base-content/70">
                            {key === "profileVisible" && "Make your profile visible to other users"}
                            {key === "proofsVisible" && "Allow others to see your verified proofs"}
                            {key === "activityVisible" && "Show your recent activity to others"}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={value}
                          onChange={() => handlePrivacyChange(key)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-base-200">
                    <h3 className="font-medium text-base-content mb-4">Data Export</h3>
                    <p className="text-sm text-base-content/70 mb-4">
                      Download a copy of all your data including proofs, activity history, and account information.
                    </p>
                    <button className="btn btn-outline">Export My Data</button>
                  </div>
                  <div className="pt-6 border-t border-base-200">
                    <h3 className="font-medium text-base-content mb-4">Account Deletion</h3>
                    <p className="text-sm text-base-content/70 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button className="btn btn-error">Delete Account</button>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Save Privacy Settings</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-base-content mb-4">Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          theme === "light" ? "border-primary" : "border-base-200"
                        }`}
                        onClick={() => setTheme("light")}
                      >
                        <div className="glass-card  rounded p-2 shadow-sm">
                          <div className="space-y-1">
                            <div className="h-2 bg-base-200 rounded"></div>
                            <div className="h-2 bg-base-100 rounded"></div>
                          </div>
                        </div>
                        <p className="text-center mt-2 font-medium">Light Mode</p>
                      </div>
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          theme === "dark" ? "border-primary" : "border-base-200"
                        }`}
                        onClick={() => setTheme("dark")}
                      >
                        <div className="bg-base-800 rounded p-2">
                          <div className="space-y-1">
                            <div className="h-2 bg-base-600 rounded"></div>
                            <div className="h-2 bg-base-700 rounded"></div>
                          </div>
                        </div>
                        <p className="text-center mt-2 font-medium">Dark Mode</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-base-content mb-4">Font Size</h3>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>Small</option>
                      <option>Medium (Default)</option>
                      <option>Large</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-base-content mb-4">Compact Mode</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-base-content">Use compact interface layout</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Apply Changes</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">General Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-base-content mb-4">Language</h3>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-base-content mb-4">Time Zone</h3>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                      <option>UTC+8 (China Standard Time)</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-base-content mb-4">Currency</h3>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>ETH (Ξ)</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium text-base-content mb-4">Default Network</h3>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>Ethereum Mainnet</option>
                      <option>Polygon</option>
                      <option>Sepolia Testnet</option>
                      <option>Hardhat Local</option>
                    </select>
                  </div>
                  <div className="pt-6 border-t border-base-200">
                    <h3 className="font-medium text-base-content mb-4">Session Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base-content">Auto-logout after inactivity</span>
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text">Session timeout (minutes)</span>
                        </label>
                        <input
                          type="number"
                          defaultValue="30"
                          className="input input-bordered w-24"
                          min="5"
                          max="480"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-primary">Save Settings</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
