import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AnalysisView } from '@/components/AnalysisView';
import { AnalysisType } from '@/services/geminiService';
import { Clock } from '@/components/Clock';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AnalysisType>('prescription');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1579684385136-4f8995f52a00?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center bg-fixed bg-no-repeat">
      {/* Dark Overlay for background readability */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0" />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 p-4 flex items-center justify-between glass-panel border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <span className="text-emerald-400 font-bold">M</span>
          </div>
          <span className="text-white font-bold">Medical Lens</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex w-full h-screen pt-16 lg:pt-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 scroll-smooth">
          {/* Clock Header */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <Clock />
          </div>

          <AnalysisView type={activeTab} />
        </main>
      </div>
    </div>
  );
}
