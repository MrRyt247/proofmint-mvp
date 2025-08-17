"use client";

import { useState } from "react";
import {
  BellIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const Notifications = () => {
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Proof Verified",
      message: "Your University Degree proof has been successfully verified and minted as NFT",
      time: "2 hours ago",
      read: false,
      action: "View Proof",
    },
    {
      id: 2,
      type: "warning",
      title: "Verification Pending",
      message: "Your Professional Certificate is pending verification. Expected completion in 24-48 hours.",
      time: "1 day ago",
      read: false,
      action: "Check Status",
    },
    {
      id: 3,
      type: "info",
      title: "New Feature Available",
      message: "Batch proof creation is now available! Create multiple proofs at once to save time.",
      time: "2 days ago",
      read: true,
      action: "Learn More",
    },
    {
      id: 4,
      type: "success",
      title: "Proof Shared",
      message: "Your Identity Document proof has been successfully shared with TechCorp Inc.",
      time: "3 days ago",
      read: true,
      action: "View Details",
    },
    {
      id: 5,
      type: "warning",
      title: "Verification Request",
      message: "Someone has requested to verify your Professional License. Review the request.",
      time: "1 week ago",
      read: true,
      action: "Review Request",
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: number) => {
    // Handle mark as read logic
    console.log(`Mark notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // Handle mark all as read logic
    console.log("Mark all as read");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-success" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-6 w-6 text-warning" />;
      case "info":
        return <InformationCircleIcon className="h-6 w-6 text-info" />;
      default:
        return <BellIcon className="h-6 w-6 text-base-content/60" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const base = read ? "glass-card" : "bg-info/5";
    return base;
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-base-content">Notifications</h1>
        <button onClick={markAllAsRead} className="text-sm text-primary hover:text-accent font-medium">
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="bg-base-100 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all" ? "bg-primary text-primary-content" : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setFilter("success")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "success"
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "warning"
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilter("info")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "info" ? "bg-primary text-primary-content" : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
          >
            Info
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-base-100 rounded-lg shadow-sm p-8 text-center">
            <BellIcon className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">No notifications</h3>
            <p className="text-base-content/70">
              {filter === "all"
                ? "You're all caught up! No notifications to show."
                : `No ${filter} notifications to show.`}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`${getNotificationBg(notification.type, notification.read)} rounded-lg shadow-sm p-6 border ${
                !notification.read ? "border-primary/20" : "border-base-200"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`text-sm font-medium ${!notification.read ? "text-base-content" : "text-base-content/70"}`}
                      >
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-base-content/70">{notification.message}</p>
                      <p className="mt-2 text-xs text-base-content/50">{notification.time}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <button className="text-primary hover:text-accent text-sm font-medium">
                        {notification.action}
                      </button>
                      <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-sm p-1">
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          {!notification.read && (
                            <li>
                              <button onClick={() => markAsRead(notification.id)}>Mark as read</button>
                            </li>
                          )}
                          <li>
                            <button>Archive</button>
                          </li>
                          <li>
                            <button className="text-error">Delete</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-base-100 rounded-lg shadow-sm p-6 mt-8">
        <h3 className="text-lg font-semibold text-base-content mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-base-content">Proof Verification</p>
              <p className="text-sm text-base-content/70">Get notified when your proofs are verified</p>
            </div>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-base-content">Share Requests</p>
              <p className="text-sm text-base-content/70">Get notified when someone requests to view your proofs</p>
            </div>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-base-content">System Updates</p>
              <p className="text-sm text-base-content/70">Get notified about new features and updates</p>
            </div>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-base-content">Email Notifications</p>
              <p className="text-sm text-base-content/70">Receive important notifications via email</p>
            </div>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
