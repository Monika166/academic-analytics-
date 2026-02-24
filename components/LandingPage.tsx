import React from "react";
import {
  BarChart3,
  Target,
  ShieldCheck,
  ClipboardCheck,
  LineChart,
  UserRound,
  FileDown,
  Database,
  Link,
  Search,
  MessageSquare,
  Lightbulb,
  Clock,
  GraduationCap,
  TrendingUp,
  Users,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
              Smarter Academic Insights <br className="hidden md:block" />
              for Better Teaching
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Empower your classroom with outcome-based performance management.
              Turn student data into actionable pedagogical strategies without
              the administrative overhead.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              {/* Primary Action */}
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-5 rounded-md shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-1 flex-1 sm:flex-none min-w-[200px]"
              >
                Register as Faculty
              </button>

              {/* HOD Specific Login (Blue) */}
              <button
                onClick={() => navigate("/hod-login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-5 rounded-md shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 flex-1 sm:flex-none min-w-[160px]"
              >
                HOD Login
              </button>

              {/* Faculty Login (Secondary) */}
              <button
                onClick={() => navigate("/login")}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-8 py-5 rounded-md transition-all flex-1 sm:flex-none min-w-[160px]"
              >
                Faculty Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefit Cards Section - Fixed Structure */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="text-blue-600" />,
                title: "Seamless Tracking",
                desc: "Monitor student progress across every curriculum outcome effortlessly.",
              },
              {
                icon: <Target className="text-emerald-600" />,
                title: "Identify Weak Areas",
                desc: "Pinpoint conceptual gaps at a glance for targeted remedial support.",
              },
              {
                icon: <ShieldCheck className="text-indigo-600" />,
                title: "Secure Interface",
                desc: "Encrypted data management compliant with institutional standards.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-xl border border-transparent hover:border-slate-100 transition-all hover:bg-slate-50/50"
              >
                <div className="mt-1">{card.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Academic Tools */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Comprehensive Academic Tools
          </h2>
          <div className="w-12 h-1 bg-emerald-500 mx-auto mb-16 rounded-full"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ClipboardCheck />,
                title: "Outcome-Based Marks Entry",
                color: "bg-blue-100 text-blue-600",
                desc: "Map every mark to specific learning outcomes for granular performance data collection.",
              },
              {
                icon: <LineChart />,
                title: "Performance Analytics Dashboard",
                color: "bg-emerald-100 text-emerald-600",
                desc: "Visual trends and comparative analysis of class-wide performance metrics in real-time.",
              },
              {
                icon: <UserRound />,
                title: "Outcome-Wise Student Insights",
                color: "bg-indigo-100 text-indigo-600",
                desc: "Deep dive into individual student strengths and weaknesses across all course modules.",
              },
              {
                icon: <FileDown />,
                title: "Downloadable Academic Reports",
                color: "bg-orange-100 text-orange-600",
                desc: "Generate one-click PDF/Excel reports for accreditation, faculty reviews, and parent meetings.",
              },
            ].map((tool, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-6`}
                >
                  {React.cloneElement(
                    tool.icon as React.ReactElement<{ className?: string }>,
                    { className: "w-6 h-6" },
                  )}
                </div>
                <h3 className="font-bold text-slate-900 mb-4 text-lg leading-snug">
                  {tool.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Workflow */}
      <section
        id="process"
        className="py-24 bg-white border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            5-Step Academic Workflow
          </h2>
          <p className="text-slate-500 mb-16">
            A structured path from raw data to pedagogical excellence.
          </p>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block -z-10"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
              {[
                {
                  icon: <Database />,
                  title: "Input Data",
                  color: "bg-blue-700",
                  desc: "Import assessment marks",
                },
                {
                  icon: <Link />,
                  title: "Map Outcomes",
                  color: "bg-emerald-600",
                  desc: "Link marks to objectives",
                },
                {
                  icon: <Search />,
                  title: "Analyze Trends",
                  color: "bg-indigo-600",
                  desc: "Identify class progress",
                },
                {
                  icon: <MessageSquare />,
                  title: "Review Gaps",
                  color: "bg-orange-500",
                  desc: "Focus on weak areas",
                },
                {
                  icon: <Lightbulb />,
                  title: "Enhance Learning",
                  color: "bg-emerald-500",
                  desc: "Implement interventions",
                },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white mb-6 shadow-lg ring-8 ring-white`}
                  >
                    {React.cloneElement(
                      step.icon as React.ReactElement<{ className?: string }>,
                      { className: "w-7 h-7" },
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Precision Tools Section */}
      <section id="benefits" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
                Empowering Faculty with Precision Tools
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Specifically designed to reduce administrative overhead and
                maximize teaching impact.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10">
              {[
                {
                  icon: <Clock className="text-blue-700" />,
                  title: "Time-Saving Automation",
                  desc: "Eliminate manual calculations.",
                },
                {
                  icon: <ShieldCheck className="text-emerald-500" />,
                  title: "Accreditation Ready",
                  desc: "Automated gathering for NBA/NAAC.",
                },
                {
                  icon: <Users className="text-indigo-600" />,
                  title: "Personalized Mentoring",
                  desc: "Know exactly who needs help.",
                },
                {
                  icon: <TrendingUp className="text-emerald-600" />,
                  title: "Evidence-Based Teaching",
                  desc: "Validate strategies with data.",
                },
                {
                  icon: <TrendingUp className="text-orange-500" />,
                  title: "Continuous Growth",
                  desc: "Track teaching efficacy.",
                },
                {
                  icon: <Users className="text-slate-800" />,
                  title: "Collaborative Insights",
                  desc: "Share analytics across departments.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      {React.cloneElement(
                        item.icon as React.ReactElement<{ className?: string }>,
                        { className: "w-5 h-5" },
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-10 opacity-10">
            <Quote size={80} className="text-slate-400 fill-slate-400" />
          </div>
          <h3 className="text-3xl md:text-4xl italic font-medium text-slate-800 leading-tight mb-8">
            "When teaching decisions are supported by data, learning becomes
            more effective and inclusive"
          </h3>
          <div className="flex flex-col items-center">
            <div className="w-12 h-px bg-slate-200 mb-4"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Academic Vision
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
              <GraduationCap className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">Academic Analytics</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-blue-700">
              Platform
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-700">
              Security
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-700">
              Support
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-700">
              Privacy
            </a>
          </div>
          <div className="text-sm text-slate-400">
            © 2024 Academic Analytics System.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
