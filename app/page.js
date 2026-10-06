'use client'
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  BookOpen,
  Shield,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Star,
  Calendar,
  TrendingUp,
  Zap,
  Award,
  Globe,
  Video,
  IndianRupee 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SchoolERPLanding() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Student Management",
      description: "Complete student profiles, attendance tracking, academic records, and progress monitoring",
      gradient: "from-blue-500 to-blue-800",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-800"
    },
    {
      icon: <IndianRupee  className="w-6 h-6" />,
      title: "Financial Management",
      description: "Fee collection, payment tracking, financial reporting, and automated billing systems",
      gradient: "from-blue-500 to-blue-800",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-800"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Reports",
      description: "Comprehensive dashboards, performance analytics, and automated report generation",
      gradient: "from-blue-500 to-blue-800",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-800"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Communication Hub",
      description: "Parent-teacher messaging, announcements, notifications, and event management",
      gradient: "from-blue-500 to-blue-800",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-800"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Academic Planning",
      description: "Curriculum management, lesson planning, examination scheduling, and grade books",
      gradient: "from-blue-500 to-blue-800",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-800"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security & Compliance",
      description: "Data encryption, role-based access control, audit trails, and compliance management",
      gradient: "from-blue-500 to-blue-800",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-800"
    }
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Automate administrative tasks and focus on education",
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-blue-800"
    },
    {
      title: "Reduce Costs",
      description: "Eliminate paperwork, reduce errors, streamline operations",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-blue-500 to-blue-800"
    },
    {
      title: "Improve Satisfaction",
      description: "Real-time updates, transparent communication, easy access",
      icon: <Award className="w-6 h-6" />,
      color: "from-blue-500 to-blue-800"
    }
  ];

  const stats = [
    { number: "500+", label: "Schools Trust Us", icon: <GraduationCap className="w-10 h-10" />, gradient: "from-blue-500 to-blue-800" },
    { number: "1M+", label: "Students Managed", icon: <Users className="w-10 h-10" />, gradient: "from-blue-500 to-blue-800" },
    { number: "99.9%", label: "Uptime Guarantee", icon: <TrendingUp className="w-10 h-10" />, gradient: "from-blue-500 to-blue-800" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-xl' : 'bg-white/80 backdrop-blur-xl'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                infoEIGHT
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['Features', 'Benefits', 'Pricing', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-800 hover:bg-clip-text font-bold transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="cursor-pointer hidden md:block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-800 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Login
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-800 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-gradient-to-br from-blue-100 to-blue-200 border-t-4 border-blue-800 rounded-b-3xl py-4 shadow-xl">
              {['Features', 'Benefits', 'Pricing', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-800 font-bold text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-blue-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 leading-tight text-white drop-shadow-2xl">
            Transform Your
            <span className="block bg-gradient-to-r from-blue-400 to-blue-900 bg-clip-text text-transparent animate-pulse">
              School Experience
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-lg">
            The most powerful and intuitive school management system.
            Join the education revolution today!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="group px-10 py-5 bg-white text-blue-800 font-black rounded-2xl shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transform hover:scale-110 transition-all duration-300 flex items-center justify-center space-x-3 text-lg">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              <span>Start Free Trial</span>
            </button>
            <button className="px-10 py-5 bg-black/20 backdrop-blur-xl text-white font-black rounded-2xl border-4 border-white/30 hover:bg-black/30 hover:border-white hover:shadow-2xl transition-all duration-300 text-lg">
              Watch Demo Video
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-bold">
              One platform to rule them all.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 border-4 border-transparent hover:border-blue-800"
              >
                <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                <div className={`mt-6 h-1 bg-gradient-to-r ${feature.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-gradient-to-br from-blue-500 to-blue-800 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              Why Schools Love Us
            </h2>
            <p className="text-2xl font-semibold opacity-90">
              Real results. Real impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border-4 border-white/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                  {benefit.icon}
                </div>
                <h3 className="font-black text-2xl mb-4">{benefit.title}</h3>
                <p className="text-white/90 text-lg font-medium leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">

            {/* Logo & About */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-blue-900 bg-clip-text text-transparent">
                  infoEIGHT
                </h1>
              </div>
              <p className="text-gray-400 leading-relaxed font-medium">
                Making education management simple, colorful, and powerful.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-black text-xl mb-6 text-white">Product</h4>
              <div className="space-y-3">
                <a href="#features" className="block text-gray-400 hover:text-white font-medium transition-colors">Features</a>
                <a href="#pricing" className="block text-gray-400 hover:text-white font-medium transition-colors">Pricing</a>
                <a href="#security" className="block text-gray-400 hover:text-white font-medium transition-colors">Security</a>
                <a href="#integrations" className="block text-gray-400 hover:text-white font-medium transition-colors">Integrations</a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-black text-xl mb-6 text-white">Company</h4>
              <div className="space-y-3">
                <a href="#about" className="block text-gray-400 hover:text-white font-medium transition-colors">About Us</a>
                <a href="#careers" className="block text-gray-400 hover:text-white font-medium transition-colors">Careers</a>
                <a href="#blog" className="block text-gray-400 hover:text-white font-medium transition-colors">Blog</a>
                <a href="#contact" className="block text-gray-400 hover:text-white font-medium transition-colors">Contact</a>
              </div>
            </div>

            {/* Support Links & Social */}
            <div>
              <h4 className="font-black text-xl mb-6 text-white">Support</h4>
              <div className="space-y-3 mb-6">
                <a href="#help" className="block text-gray-400 hover:text-white font-medium transition-colors">Help Center</a>
                <a href="#docs" className="block text-gray-400 hover:text-white font-medium transition-colors">Documentation</a>
                <a href="#api" className="block text-gray-400 hover:text-white font-medium transition-colors">API Reference</a>
                <a href="#status" className="block text-gray-400 hover:text-white font-medium transition-colors">System Status</a>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Video className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 font-medium text-lg">
            <p>© 2025 infoEIGHT. Made with 💙 for education</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
