"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Search,
  Scale,
  Home,
  Filter,
  Eye,
  Star,
  Clock,
  User,
  Building,
  Heart,
  Briefcase,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const documentCategories = [
    { id: "all", name: "All Documents", icon: FileText, count: 45 },
    { id: "criminal", name: "Criminal Law", icon: Scale, count: 8 },
    { id: "civil", name: "Civil Law", icon: User, count: 12 },
    { id: "property", name: "Property Law", icon: Building, count: 10 },
    { id: "family", name: "Family Law", icon: Heart, count: 7 },
    { id: "corporate", name: "Corporate Law", icon: Briefcase, count: 5 },
    { id: "consumer", name: "Consumer Protection", icon: ShoppingCart, count: 3 },
  ]

  const documents = [
    {
      id: 1,
      title: "FIR Registration Application",
      description: "Template for filing First Information Report with police",
      category: "criminal",
      type: "Application",
      downloads: 1250,
      rating: 4.8,
      language: "English/Hindi",
      pages: 2,
      lastUpdated: "2024-01-15",
      trending: true,
    },
    {
      id: 2,
      title: "Property Sale Deed",
      description: "Comprehensive property sale agreement template",
      category: "property",
      type: "Agreement",
      downloads: 2100,
      rating: 4.9,
      language: "English/Hindi",
      pages: 8,
      lastUpdated: "2024-01-10",
      trending: true,
    },
    {
      id: 3,
      title: "Consumer Complaint Format",
      description: "Standard format for consumer court complaints",
      category: "consumer",
      type: "Complaint",
      downloads: 890,
      rating: 4.7,
      language: "English/Hindi",
      pages: 3,
      lastUpdated: "2024-01-12",
      trending: false,
    },
    {
      id: 4,
      title: "Divorce Petition (Mutual Consent)",
      description: "Mutual consent divorce petition template",
      category: "family",
      type: "Petition",
      downloads: 1560,
      rating: 4.6,
      language: "English/Hindi",
      pages: 5,
      lastUpdated: "2024-01-08",
      trending: false,
    },
    {
      id: 5,
      title: "Rent Agreement",
      description: "Standard residential rent agreement format",
      category: "property",
      type: "Agreement",
      downloads: 3200,
      rating: 4.9,
      language: "English/Hindi",
      pages: 6,
      lastUpdated: "2024-01-14",
      trending: true,
    },
    {
      id: 6,
      title: "Power of Attorney",
      description: "General power of attorney document template",
      category: "civil",
      type: "Authorization",
      downloads: 1800,
      rating: 4.8,
      language: "English/Hindi",
      pages: 4,
      lastUpdated: "2024-01-11",
      trending: false,
    },
    {
      id: 7,
      title: "Employment Contract",
      description: "Standard employment agreement template",
      category: "corporate",
      type: "Contract",
      downloads: 950,
      rating: 4.7,
      language: "English",
      pages: 7,
      lastUpdated: "2024-01-09",
      trending: false,
    },
    {
      id: 8,
      title: "Bail Application",
      description: "Template for bail application in criminal cases",
      category: "criminal",
      type: "Application",
      downloads: 720,
      rating: 4.5,
      language: "English/Hindi",
      pages: 3,
      lastUpdated: "2024-01-13",
      trending: true,
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (categoryId: string) => {
    const category = documentCategories.find((cat) => cat.id === categoryId)
    return category ? category.icon : FileText
  }

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      criminal: "bg-red-100 text-red-800",
      civil: "bg-blue-100 text-blue-800",
      property: "bg-green-100 text-green-800",
      family: "bg-pink-100 text-pink-800",
      corporate: "bg-purple-100 text-purple-800",
      consumer: "bg-orange-100 text-orange-800",
    }
    return colors[categoryId as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
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
              <FileText className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              <div>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  Legal Documents
                </h1>
                <p className="text-xs text-gray-600">Templates & Forms</p>
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
            <span>Professional Legal Templates</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">Legal Document Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp animation-delay-500">
            Access professionally crafted legal document templates and forms. Download, customize, and use them for your
            legal needs.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 animate-fadeInUp animation-delay-1000">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:scale-105 focus:shadow-lg bg-white/80 backdrop-blur-sm"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filter</span>
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-6 bg-white/80 backdrop-blur-sm">
              {documentCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center space-x-1 text-xs hover:scale-105 transition-all duration-300"
                  >
                    <IconComponent className="h-3 w-3" />
                    <span className="hidden sm:inline">{category.name}</span>
                    <Badge variant="secondary" className="ml-1 text-xs animate-pulse">
                      {category.count}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => {
            const IconComponent = getCategoryIcon(doc.category)
            return (
              <Card
                key={doc.id}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-fadeInUp hover:rotate-1 hover:scale-105 bg-white/90 backdrop-blur-sm relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Trending Badge */}
                {doc.trending && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                )}

                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(doc.category)} group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
                          {doc.title}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current animate-pulse" />
                      <span className="text-sm font-medium">{doc.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {doc.description}
                  </CardDescription>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4 animate-bounce-gentle" />
                        <span>{doc.downloads.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{doc.pages} pages</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Language: {doc.language}</span>
                      <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                    </div>

                    {/* Download Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min((doc.downloads / 3500) * 100, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 hover:scale-105 transition-all duration-300 group/btn animate-pulse-glow"
                      >
                        <Download className="h-4 w-4 mr-2 group-hover/btn:animate-bounce" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="hover:scale-105 transition-all duration-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500 rounded-lg pointer-events-none"></div>
              </Card>
            )
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-bounce-gentle" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or category filter</p>
            <Button asChild className="hover:scale-105 transition-all duration-300">
              <Link href="/chat">Ask AI for Help</Link>
            </Button>
          </div>
        )}

        {/* Popular Documents Section */}
        <div className="mt-16 animate-fadeInUp animation-delay-2000">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600 animate-bounce-gentle" />
            Most Popular Documents
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documents
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 4)
              .map((doc, index) => (
                <Card
                  key={`popular-${doc.id}`}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(doc.category)} hover:scale-110 transition-transform duration-300`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate hover:text-blue-600 transition-colors duration-300">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span>{doc.downloads.toLocaleString()} downloads</span>
                          <Zap className="h-3 w-3 text-yellow-500 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 animate-fadeInUp animation-delay-2500">
          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2 animate-bounce-gentle">{documents.length}</div>
              <p className="text-gray-600">Document Templates</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2 animate-bounce-gentle">
                {documents.reduce((sum, doc) => sum + doc.downloads, 0).toLocaleString()}
              </div>
              <p className="text-gray-600">Total Downloads</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2 animate-bounce-gentle">
                {(documents.reduce((sum, doc) => sum + doc.rating, 0) / documents.length).toFixed(1)}
              </div>
              <p className="text-gray-600">Average Rating</p>
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
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-2500 { animation-delay: 2500ms; }
      `}</style>
    </div>
  )
}
