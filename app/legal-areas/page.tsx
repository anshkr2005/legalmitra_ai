"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Scale,
  Home,
  Gavel,
  Building,
  Heart,
  ShoppingCart,
  Briefcase,
  Users,
  FileText,
  Shield,
  BookOpen,
  MessageCircle,
  Search,
  TrendingUp,
  Star,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function LegalAreasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const legalAreas = [
    {
      title: "Indian Penal Code (IPC)",
      description: "Criminal offenses, punishments, and procedures under Indian criminal law",
      icon: Gavel,
      color: "bg-red-100 text-red-800",
      topics: ["Murder", "Theft", "Fraud", "Assault", "Defamation"],
      cases: "10,000+ cases",
      popularity: 95,
      trending: true,
    },
    {
      title: "Criminal Procedure Code (CrPC)",
      description: "Procedures for investigation, inquiry, trial of criminal offenses",
      icon: Scale,
      color: "bg-blue-100 text-blue-800",
      topics: ["FIR", "Arrest", "Bail", "Trial", "Appeal"],
      cases: "8,500+ cases",
      popularity: 88,
      trending: false,
    },
    {
      title: "Civil Procedure Code (CPC)",
      description: "Procedures for civil suits and court proceedings",
      icon: FileText,
      color: "bg-green-100 text-green-800",
      topics: ["Civil Suits", "Injunctions", "Appeals", "Execution"],
      cases: "12,000+ cases",
      popularity: 82,
      trending: true,
    },
    {
      title: "Property Law",
      description: "Real estate transactions, property rights, and disputes",
      icon: Building,
      color: "bg-purple-100 text-purple-800",
      topics: ["Sale Deed", "Registration", "Disputes", "Inheritance"],
      cases: "15,000+ cases",
      popularity: 92,
      trending: true,
    },
    {
      title: "Consumer Protection Act",
      description: "Consumer rights, complaints, and redressal mechanisms",
      icon: ShoppingCart,
      color: "bg-orange-100 text-orange-800",
      topics: ["Defective Products", "Service Deficiency", "Unfair Practices"],
      cases: "6,000+ cases",
      popularity: 75,
      trending: false,
    },
    {
      title: "Family Law",
      description: "Marriage, divorce, custody, maintenance, and inheritance",
      icon: Heart,
      color: "bg-pink-100 text-pink-800",
      topics: ["Divorce", "Custody", "Maintenance", "Adoption"],
      cases: "9,000+ cases",
      popularity: 78,
      trending: false,
    },
    {
      title: "Labour Law",
      description: "Employment rights, workplace safety, and industrial relations",
      icon: Users,
      color: "bg-indigo-100 text-indigo-800",
      topics: ["Employment", "Wages", "Safety", "Termination"],
      cases: "7,500+ cases",
      popularity: 70,
      trending: true,
    },
    {
      title: "Corporate Law",
      description: "Company formation, compliance, mergers, and corporate governance",
      icon: Briefcase,
      color: "bg-teal-100 text-teal-800",
      topics: ["Company Formation", "Compliance", "Mergers", "Governance"],
      cases: "4,000+ cases",
      popularity: 65,
      trending: false,
    },
    {
      title: "Constitutional Law",
      description: "Fundamental rights, constitutional provisions, and public law",
      icon: Shield,
      color: "bg-yellow-100 text-yellow-800",
      topics: ["Fundamental Rights", "Directive Principles", "Amendments"],
      cases: "3,500+ cases",
      popularity: 68,
      trending: false,
    },
    {
      title: "Tax Law",
      description: "Income tax, GST, customs, and other taxation matters",
      icon: BookOpen,
      color: "bg-gray-100 text-gray-800",
      topics: ["Income Tax", "GST", "Customs", "Appeals"],
      cases: "5,500+ cases",
      popularity: 72,
      trending: true,
    },
  ]

  const filteredAreas = legalAreas.filter((area) => {
    const matchesSearch =
      area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "trending" && area.trending) ||
      (selectedFilter === "popular" && area.popularity > 80)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 animate-slideDown">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild className="hover:scale-105 transition-transform duration-300">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-3 group">
              <Scale className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              <div>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  Legal Areas
                </h1>
                <p className="text-xs text-gray-600">Comprehensive Law Coverage</p>
              </div>
            </div>
          </div>
          <Button asChild className="hover:scale-105 transition-transform duration-300 animate-pulse-glow">
            <Link href="/chat">Ask AI Assistant</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-gentle">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span>Expert Legal Guidance</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">Legal Areas We Cover</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp animation-delay-500">
            Get expert AI guidance across all major areas of Indian law. Click on any area to start a conversation with
            our legal assistant.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 animate-fadeInUp animation-delay-1000">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search legal areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:scale-105 focus:shadow-lg bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
                className="hover:scale-105 transition-all duration-300"
              >
                All Areas
              </Button>
              <Button
                variant={selectedFilter === "trending" ? "default" : "outline"}
                onClick={() => setSelectedFilter("trending")}
                className="hover:scale-105 transition-all duration-300 flex items-center space-x-1"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </Button>
              <Button
                variant={selectedFilter === "popular" ? "default" : "outline"}
                onClick={() => setSelectedFilter("popular")}
                className="hover:scale-105 transition-all duration-300 flex items-center space-x-1"
              >
                <Star className="h-4 w-4" />
                <span>Popular</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area, index) => {
            const IconComponent = area.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer animate-fadeInUp hover:rotate-1 hover:scale-105 bg-white/90 backdrop-blur-sm relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Trending Badge */}
                {area.trending && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}

                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`p-3 rounded-lg ${area.color} group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
                        {area.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {area.cases}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{area.popularity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <CardDescription className="mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {area.description}
                  </CardDescription>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {area.topics.map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="secondary"
                          className="text-xs hover:bg-blue-100 hover:text-blue-800 transition-colors duration-300 cursor-pointer"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Popularity Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Popularity</span>
                      <span>{area.popularity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${area.popularity}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button asChild className="flex-1 hover:scale-105 transition-all duration-300 group/btn">
                      <Link
                        href={`/chat?topic=${encodeURIComponent(area.title)}`}
                        className="flex items-center space-x-2"
                      >
                        <MessageCircle className="h-4 w-4 group-hover/btn:animate-bounce" />
                        <span>Ask Questions</span>
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="hover:scale-105 transition-all duration-300">
                      <Link href={`/documents?category=${area.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        <FileText className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500 rounded-lg pointer-events-none"></div>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredAreas.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-bounce-gentle" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No legal areas found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedFilter("all")
              }}
              className="hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 animate-fadeInUp animation-delay-2000">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-float animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-4000"></div>
            </div>
            <CardContent className="p-8 relative z-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 animate-fadeInUp">Need Help with Multiple Legal Areas?</h2>
                <p className="text-lg mb-6 opacity-90 animate-fadeInUp animation-delay-500">
                  Our AI assistant can help you navigate complex legal situations involving multiple areas of law.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="hover:scale-110 transition-all duration-300 hover:shadow-2xl animate-pulse-glow animate-fadeInUp animation-delay-1000"
                >
                  <Link href="/chat" className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 animate-bounce-gentle" />
                    <span>Start Comprehensive Consultation</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 animate-fadeInUp animation-delay-2500">
          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2 animate-bounce-gentle">{legalAreas.length}</div>
              <p className="text-gray-600">Legal Areas Covered</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2 animate-bounce-gentle">
                {legalAreas
                  .reduce((sum, area) => sum + Number.parseInt(area.cases.replace(/[^\d]/g, "")), 0)
                  .toLocaleString()}
                +
              </div>
              <p className="text-gray-600">Total Cases Handled</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2 animate-bounce-gentle">
                {Math.round(legalAreas.reduce((sum, area) => sum + area.popularity, 0) / legalAreas.length)}%
              </div>
              <p className="text-gray-600">Average Success Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>

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
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-2500 { animation-delay: 2500ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
      `}</style>
    </div>
  )
}
