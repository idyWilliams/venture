"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from "./button";
import RoleSwitcher from "./role-switcher";
import {
  LayoutDashboard,
  Handshake,
  BarChart2,
  MessageSquare,
  Briefcase,
  FileText,
  CreditCard,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useUserRole } from "@/src/contexts/UserRoleContext";

export default function NavigationBar() {
  const pathname = usePathname();
  const { role, isAuthenticated, setIsAuthenticated } = useUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const isFounder = role === "founder";

  const founderNavItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      href: "/deal-rooms",
      label: "Deal Rooms",
      icon: <Handshake className="h-4 w-4 mr-2" />,
    },
    {
      href: "/analytics/dashboard",
      label: "Analytics",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      href: "/subscription",
      label: "Subscription",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
  ];

  const investorNavItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      href: "/deal-rooms",
      label: "Deal Rooms",
      icon: <Handshake className="h-4 w-4 mr-2" />,
    },
    {
      href: "/investor/portfolio",
      label: "Portfolio",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
    },
    {
      href: "/analytics/dashboard",
      label: "Analytics",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      href: "/investor/insights",
      label: "Insights",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      href: "/subscription",
      label: "Subscription",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
  ];

  const navItems = isFounder ? founderNavItems : investorNavItems;

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex flex-1 items-center">
            <Link
              href="/dashboard"
              className="flex items-center text-blue-600 font-bold text-lg"
            >
              <div className="mr-2 h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white">
                VH
              </div>
              VentureHive
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center ml-auto">
            {/* Search button */}
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative ml-2">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Role Switcher */}
            <div className="ml-4">
              <RoleSwitcher  />
              {/* <RoleSwitcher variant="subtle" /> */}
            </div>

            {/* User menu */}
            <div className="ml-4 relative">
              <button className="flex items-center space-x-1 text-sm">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {isFounder ? "F" : "I"}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="ml-4 md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-4 flex items-center justify-center"
              onClick={() => setIsAuthenticated(false)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
