import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  FileText, 
  Scan, 
  Activity, 
  Menu, 
  X, 
  ChevronRight,
  Pill,
  TestTube
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisType } from '@/services/geminiService';

interface SidebarProps {
  activeTab: AnalysisType;
  setActiveTab: (tab: AnalysisType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'prescription', label: 'تحليل الروشتة', icon: Pill, description: 'قراءة الأدوية والجرعات' },
    { id: 'scan', label: 'تحليل الأشعة', icon: Scan, description: 'تفسير صور الأشعة والسونار' },
    { id: 'lab-report', label: 'التحاليل الطبية', icon: TestTube, description: 'قراءة نتائج المعامل' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 right-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:transform-none",
          "glass-panel border-l border-white/10 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Medical Lens</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as AnalysisType);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group text-right",
                  isActive 
                    ? "bg-emerald-500/20 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                    : "hover:bg-white/5 border border-transparent hover:border-white/10"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/50 group-hover:text-emerald-300"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-medium transition-colors",
                    isActive ? "text-white" : "text-white/70 group-hover:text-white"
                  )}>
                    {item.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{item.description}</p>
                </div>
                {isActive && (
                  <motion.div layoutId="active-indicator" className="w-1 h-8 bg-emerald-400 rounded-full absolute left-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="glass-panel p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5">
            <p className="text-xs text-white/60 leading-relaxed text-center">
              هذا النظام مساعد ذكي ولا يغني عن استشارة الطبيب المختص.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
