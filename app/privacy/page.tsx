"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Shield, Lock, Eye, FileText, Users, ChevronRight, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const privacyFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All your legal queries are encrypted using industry-standard AES-256 encryption",
      color: "bg-green-500",
    },
    {
      icon: Eye,
      title: "No Data Tracking",
      description: "We don't track, store, or share your personal legal conversations",
      color: "bg-blue-500",
    },
    {
      icon: Shield,
      title: "Secure Infrastructure",
      description: "Hosted on secure cloud infrastructure with regular security audits",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      title: "Confidential Processing",
      description: "Your legal documents are processed securely and deleted after analysis",
      color: "bg-orange-500",
    },
    {
      icon: Users,
      title: "No Third-Party Sharing",
      description: "Your legal information is never shared with third parties or advertisers",
      color: "bg-red-500",
    },
    {
      icon: CheckCircle,
      title: "Compliance Ready",
      description: "Fully compliant with data protection regulations and legal standards",
      color: "bg-indigo-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 animate-slideDown">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Scale className="h-8 w-8 text-blue-600 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                LegalMitra
              </h1>
              <p className="text-sm text-gray-600">Privacy & Security</p>
            </div>
          </div>
          <Button variant="outline" asChild className="hover:scale-105 transition-all duration-300">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
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
            <Shield className="h-16 w-16 mx-auto mb-6 text-blue-600 animate-bounce-gentle" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Privacy & Security
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your legal privacy is our top priority. Learn how we protect your sensitive legal information with
              enterprise-grade security measures.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              asChild
            >
              <Link href="/chat" className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Start Secure Chat</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Privacy Features */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Protect Your Legal Privacy</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade security measures to ensure your legal consultations remain completely confidential
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privacyFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg animate-fadeInUp hover:rotate-1 hover:scale-105 bg-gradient-to-br from-white to-gray-50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Secure Legal Assistance?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience confidential legal guidance with complete privacy protection. Your legal matters stay between you
            and our AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/chat" className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Start Private Consultation</span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300 border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/legal-areas" className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Browse Legal Areas</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
      `}</style>
    </div>
  )
}
