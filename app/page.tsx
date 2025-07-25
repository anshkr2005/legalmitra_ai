"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Scale,
  MessageCircle,
  FileText,
  Clock,
  Shield,
  Users,
  ChevronRight,
  Sparkles,
  BookOpen,
  Gavel,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [statsCount, setStatsCount] = useState({ users: 0, cases: 0, success: 0 })

  useEffect(() => {
    setIsVisible(true)

    // Animate stats counter
    const animateStats = () => {
      const targets = { users: 50000, cases: 25000, success: 98 }
      const duration = 2000
      const steps = 60
      const stepTime = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)

        setStatsCount({
          users: Math.floor(targets.users * easeOut),
          cases: Math.floor(targets.cases * easeOut),
          success: Math.floor(targets.success * easeOut),
        })

        if (currentStep >= steps) {
          clearInterval(timer)
          setStatsCount(targets)
        }
      }, stepTime)
    }

    const timer = setTimeout(animateStats, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: MessageCircle,
      title: "Bilingual Chat Support",
      description: "Get legal guidance in both English and Hindi with AI-powered responses",
      color: "bg-blue-500",
      delay: "0ms",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Law Coverage",
      description: "Expert knowledge on IPC, CrPC, CPC, Property Law, Consumer Protection & more",
      color: "bg-green-500",
      delay: "200ms",
    },
    {
      icon: FileText,
      title: "Document Templates",
      description: "Access ready-to-use legal document templates and forms",
      color: "bg-purple-500",
      delay: "400ms",
    },
    {
      icon: Clock,
      title: "Lightning-Fast Responses",
      description: "Get instant legal assistance with Groq's ultra-fast AI processing",
      color: "bg-orange-500",
      delay: "600ms",
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Your legal queries are handled with complete privacy and security",
      color: "bg-red-500",
      delay: "800ms",
    },
    {
      icon: Users,
      title: "Case Tracking",
      description: "Track your legal cases and get timely updates and reminders",
      color: "bg-indigo-500",
      delay: "1000ms",
    },
  ]

  const legalAreas = [
    "Indian Penal Code (IPC)",
    "Criminal Procedure Code (CrPC)",
    "Civil Procedure Code (CPC)",
    "Property Law",
    "Consumer Protection Act",
    "Family Law",
    "Labour Law",
    "Corporate Law",
    "Tax Law",
    "Constitutional Law",
  ]

  const getFeatureLink = (title: string) => {
    switch (title) {
      case "Bilingual Chat Support":
        return "/chat?lang=bilingual"
      case "Comprehensive Law Coverage":
        return "/legal-areas"
      case "Document Templates":
        return "/documents"
      case "Lightning-Fast Responses":
        return "/chat"
      case "Secure & Confidential":
        return "/privacy"
      case "Case Tracking":
        return "/cases"
      default:
        return "/chat"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Mouse Follower */}
      <div
        className="fixed w-6 h-6 bg-blue-400 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: "scale(1)",
        }}
      />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 animate-slideDown">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Scale className="h-8 w-8 text-blue-600 transition-transform duration-300 group-hover:rotate-12" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                LegalMitra
              </h1>
              <p className="text-sm text-gray-600">AI Legal Assistant</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/chat"
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group"
            >
              Chat
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/documents"
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group"
            >
              Documents
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/cases"
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group"
            >
              Cases
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Button
              asChild
              className="animate-pulse-glow hover:animate-none transition-all duration-300 hover:scale-105"
            >
              <Link href="/chat">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-gentle">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span>Powered by Groq's Lightning-Fast AI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="inline-block animate-fadeInUp">Your Smart</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x inline-block animate-fadeInUp animation-delay-500">
                Legal
              </span>
              <br />
              <span className="inline-block animate-fadeInUp animation-delay-1000">Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-1500">
              Get instant, accurate legal guidance on Indian laws with our AI-powered assistant. Available in English
              and Hindi, providing context-aware responses with applicable sections, required documents, and timelines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-2000">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-glow"
              >
                <Link href="/chat" className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 animate-bounce-gentle" />
                  <span>Start Legal Chat</span>
                  <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                asChild
              >
                <Link href="/documents" className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Browse Documents</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 transition-all duration-300 group-hover:scale-110">
                {statsCount.users.toLocaleString()}+
              </div>
              <p className="text-gray-600 flex items-center justify-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Happy Users</span>
              </p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-600 mb-2 transition-all duration-300 group-hover:scale-110">
                {statsCount.cases.toLocaleString()}+
              </div>
              <p className="text-gray-600 flex items-center justify-center space-x-2">
                <Scale className="h-4 w-4" />
                <span>Cases Resolved</span>
              </p>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 mb-2 transition-all duration-300 group-hover:scale-110">
                {statsCount.success}%
              </div>
              <p className="text-gray-600 flex items-center justify-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Success Rate</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto relative">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LegalMitra?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of legal assistance with our comprehensive AI-powered platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Button
                key={index}
                variant="ghost"
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg animate-fadeInUp hover:rotate-1 hover:scale-105 bg-gradient-to-br from-white to-gray-50 p-0 h-auto w-full"
                style={{ animationDelay: feature.delay }}
                asChild
              >
                <Link href={getFeatureLink(feature.title)}>
                  <Card className="w-full border-0 shadow-none bg-transparent">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300 text-left">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-left">
                        {feature.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                        <span className="text-sm font-medium">Learn More</span>
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500 rounded-lg"></div>
                  </Card>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Areas Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow animation-delay-3000"></div>
        </div>
        <div className="container mx-auto relative">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Legal Areas We Cover</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive coverage of Indian legal system with expert AI guidance. Click on any area to get instant
              help.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {legalAreas.map((area, index) => (
              <Button
                key={index}
                variant="secondary"
                className="p-4 h-auto text-center justify-center hover:bg-blue-100 hover:text-blue-800 hover:scale-110 transition-all duration-500 cursor-pointer text-sm font-medium border hover:border-blue-300 hover:shadow-xl animate-fadeInUp group hover:rotate-2 bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
                asChild
              >
                <Link href={`/chat?topic=${encodeURIComponent(area)}`}>
                  <div className="flex flex-col items-center space-y-2">
                    <Scale className="h-5 w-5 group-hover:animate-bounce" />
                    <span className="text-center leading-tight group-hover:font-semibold transition-all duration-300">
                      {area}
                    </span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
          <div className="text-center mt-8 animate-fadeInUp animation-delay-2000">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="hover:scale-105 transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <Link href="/legal-areas" className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>View All Legal Areas</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-4000"></div>
        </div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-3xl mx-auto">
            <Gavel className="h-16 w-16 mx-auto mb-6 opacity-90 animate-bounce-gentle" />
            <h2 className="text-4xl font-bold mb-6 animate-fadeInUp">Ready to Get Legal Help?</h2>
            <p className="text-xl mb-8 opacity-90 animate-fadeInUp animation-delay-500">
              Join thousands of users who trust LegalMitra for their legal guidance needs. Start your conversation with
              our AI assistant today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 hover:scale-110 transition-all duration-300 hover:shadow-2xl animate-pulse-glow animate-fadeInUp animation-delay-1000"
              asChild
            >
              <Link href="/chat" className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 animate-bounce-gentle" />
                <span>Start Free Consultation</span>
                <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-gray-800"></div>
        <div className="container mx-auto relative">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fadeInUp">
              <div className="flex items-center space-x-3 mb-4 group">
                <Scale className="h-8 w-8 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                <div>
                  <h3 className="text-xl font-bold">LegalMitra</h3>
                  <p className="text-sm text-gray-400">AI Legal Assistant</p>
                </div>
              </div>
              <p className="text-gray-400">Your trusted AI-powered legal assistant for Indian law guidance.</p>
            </div>
            <div className="animate-fadeInUp animation-delay-200">
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/chat"
                    className="hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    Legal Chat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/documents"
                    className="hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    Document Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cases"
                    className="hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    Case Tracking
                  </Link>
                </li>
              </ul>
            </div>
            <div className="animate-fadeInUp animation-delay-400">
              <h4 className="font-semibold mb-4">Legal Areas</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors duration-300">Criminal Law</li>
                <li className="hover:text-white transition-colors duration-300">Civil Law</li>
                <li className="hover:text-white transition-colors duration-300">Property Law</li>
                <li className="hover:text-white transition-colors duration-300">Consumer Protection</li>
              </ul>
            </div>
            <div className="animate-fadeInUp animation-delay-600">
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fadeInUp animation-delay-800">
            <p>&copy; 2024 LegalMitra AI Assistant. All rights reserved.</p>
            <p className="text-sm mt-2">
              <strong>Disclaimer:</strong> This AI assistant provides general legal information only and does not
              constitute legal advice. Please consult with a qualified lawyer for specific legal matters.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; background-size: 200% 200%; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-3000 { animation-delay: 3000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
      `}</style>
    </div>
  )
}
