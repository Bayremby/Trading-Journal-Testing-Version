import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Shield, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Moon,
  Sun,
  Zap,
  BookOpen,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onToggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export const LandingPage: React.FC<LandingPageProps> = ({ onToggleTheme, currentTheme }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Psychology Insights',
      description: 'Get intelligent analysis of your trading psychology, emotional patterns, and behavioral tendencies.',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Award,
      title: 'Trade Grading System',
      description: 'Grade your trades (A+, A, B, C) for qualitative assessment beyond just profit and loss.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Shield,
      title: 'Rule Adherence Tracking',
      description: 'Track your discipline with comprehensive rule following metrics and violation analysis.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Structured Reflection',
      description: 'Deep reflection tools for HTF narrative, liquidity analysis, and lesson extraction.',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: Calendar,
      title: 'Calendar & Table Views',
      description: 'Visualize your trading journey with beautiful calendar and detailed table views.',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track equity curves, win rates, and R-multiple performance over time.',
      gradient: 'from-violet-500 to-purple-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Log Your Trade',
      description: 'Enter trade details including instrument, sessions, risk, and outcome.'
    },
    {
      number: '02',
      title: 'Reflect & Grade',
      description: 'Add screenshots, check rules followed, and write your reflection.'
    },
    {
      number: '03',
      title: 'Get AI Insights',
      description: 'Receive personalized psychology insights and improvement recommendations.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#050505] transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold text-black dark:text-white tracking-tight">Trading Journal</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                {currentTheme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 text-sm font-bold bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">AI-Powered Trading Journal</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tight leading-tight mb-6">
              Master Your
              <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent"> Trading Psychology</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              The intelligent trading journal that combines structured reflection with AI-powered insights to help you become a more disciplined and profitable trader.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="group flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20 dark:shadow-white/10"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-3 px-8 py-4 bg-gray-100 dark:bg-white/5 text-black dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
              >
                I Have an Account
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] dark:from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/50 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#0a0a0a] p-6 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Preview */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
                  <div className="text-sm font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">Total Equity</div>
                  <div className="text-4xl font-black text-emerald-500">+24.5R</div>
                  <div className="mt-4 h-16 flex items-end gap-1">
                    {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                
                {/* Win Rate Preview */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
                  <div className="text-sm font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">Win Rate</div>
                  <div className="text-4xl font-black text-blue-500">68%</div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[68%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-emerald-500 font-bold">34 Wins</span>
                    <span className="text-rose-500 font-bold">16 Losses</span>
                  </div>
                </div>
                
                {/* AI Score Preview */}
                <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <div className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">AI Psychology Score</div>
                  <div className="text-4xl font-black text-purple-500">82</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Rule Adherence</span>
                      <span className="text-emerald-500 font-bold">92%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discipline</span>
                      <span className="text-blue-500 font-bold">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent"> Improve</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you understand your trading psychology and build better habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mb-4">
              Simple
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"> 3-Step </span>
              Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start improving your trading psychology in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent -translate-x-1/2" />
                )}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 border border-gray-100 dark:border-white/5 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-black text-gray-400 dark:text-gray-600">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join traders who are using AI-powered insights to master their psychology and improve their results.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-lg font-bold text-black dark:text-white">Trading Journal</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-600">
              © 2026 Trading Journal with AI Mentor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
