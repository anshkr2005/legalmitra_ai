"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Bot,
  User,
  Scale,
  Languages,
  FileText,
  Clock,
  AlertTriangle,
  Sparkles,
  Home,
  MessageSquare,
  Loader2,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useChat } from "ai/react"
import { useSearchParams } from "next/navigation"

export default function ChatPage() {
  const [language, setLanguage] = useState<"english" | "hindi">("english")
  const [isTyping, setIsTyping] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic")

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          language === "english"
            ? topic
              ? `नमस्ते! I'm LegalMitra, your AI legal assistant. I see you're interested in ${topic}. I can provide detailed guidance on this area of Indian law. How can I help you specifically with ${topic}?`
              : "नमस्ते! I'm LegalMitra, your AI legal assistant. I can help you with Indian laws including IPC, CrPC, CPC, Property Law, Consumer Protection, and more. How can I assist you today?"
            : topic
              ? `नमस्ते! मैं LegalMitra हूं, आपका AI कानूनी सहायक। मैं देख रहा हूं कि आप ${topic} में रुचि रखते हैं। मैं भारतीय कानून के इस क्षेत्र पर विस्तृत मार्गदर्शन प्रदान कर सकता हूं। ${topic} के साथ मैं आपकी विशेष रूप से कैसे मदद कर सकता हूं?`
              : "नमस्ते! मैं LegalMitra हूं, आपका AI कानूनी सहायक। मैं आपकी भारतीय कानूनों में मदद कर सकता हूं जैसे IPC, CrPC, CPC, संपत्ति कानून, उपभोक्ता संरक्षण, और अन्य। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      },
    ],
    body: {
      language,
      topic,
    },
    onFinish: () => {
      setMessageCount((prev) => prev + 1)
    },
  })

  // Auto-populate input if topic is provided
  useEffect(() => {
    if (topic && !input) {
      const topicQuestion =
        language === "english" ? `Tell me about ${topic} in Indian law` : `भारतीय कानून में ${topic} के बारे में बताएं`
      setInput(topicQuestion)
    }
  }, [topic, language, input, setInput])

  const quickQuestions = [
    {
      en: "What are my rights as a consumer?",
      hi: "उपभोक्ता के रूप में मेरे क्या अधिकार हैं?",
      category: "Consumer Protection",
      icon: "🛡️",
    },
    {
      en: "How to file an FIR?",
      hi: "FIR कैसे दर्ज करें?",
      category: "Criminal Law",
      icon: "📋",
    },
    {
      en: "Property registration process",
      hi: "संपत्ति पंजीकरण प्रक्रिया",
      category: "Property Law",
      icon: "🏠",
    },
    {
      en: "Divorce procedure in India",
      hi: "भारत में तलाक की प्रक्रिया",
      category: "Family Law",
      icon: "💔",
    },
    {
      en: "Labour law violations",
      hi: "श्रम कानून उल्लंघन",
      category: "Labour Law",
      icon: "⚖️",
    },
    {
      en: "Constitutional rights",
      hi: "संवैधानिक अधिकार",
      category: "Constitutional Law",
      icon: "📜",
    },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleQuickQuestion = (question: string) => {
    handleInputChange({ target: { value: question } } as any)
  }

  const formatLegalResponse = (content: string) => {
    const sections = content.split("\n\n")
    return sections.map((section, index) => {
      if (section.startsWith("**Applicable Sections:**")) {
        return (
          <div key={index} className="mt-4 animate-slideInLeft">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Scale className="h-4 w-4 mr-2 animate-bounce-gentle" />
              Applicable Sections
            </h4>
            <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition-colors duration-300">
              {section.replace("**Applicable Sections:**", "").trim()}
            </div>
          </div>
        )
      } else if (section.startsWith("**Required Documents:**")) {
        return (
          <div key={index} className="mt-4 animate-slideInLeft animation-delay-200">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2 animate-bounce-gentle" />
              Required Documents
            </h4>
            <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-400 hover:bg-green-100 transition-colors duration-300">
              {section.replace("**Required Documents:**", "").trim()}
            </div>
          </div>
        )
      } else if (section.startsWith("**Timeline:**")) {
        return (
          <div key={index} className="mt-4 animate-slideInLeft animation-delay-400">
            <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2 animate-bounce-gentle" />
              Timeline
            </h4>
            <div className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400 hover:bg-orange-100 transition-colors duration-300">
              {section.replace("**Timeline:**", "").trim()}
            </div>
          </div>
        )
      } else if (section.startsWith("**Disclaimer:**")) {
        return (
          <div key={index} className="mt-4 animate-slideInLeft animation-delay-600">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
              Important Disclaimer
            </h4>
            <div className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg border-l-4 border-red-400 hover:bg-red-100 transition-colors duration-300">
              {section.replace("**Disclaimer:**", "").trim()}
            </div>
          </div>
        )
      } else {
        return (
          <div key={index} className="text-gray-800 leading-relaxed animate-fadeIn">
            {section}
          </div>
        )
      }
    })
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
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Scale className="h-6 w-6 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  LegalMitra Chat
                </h1>
                <p className="text-xs text-gray-600">AI Legal Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={language === "english" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("english")}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300"
            >
              <Languages className="h-4 w-4" />
              <span>English</span>
            </Button>
            <Button
              variant={language === "hindi" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("hindi")}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-300"
            >
              <Languages className="h-4 w-4" />
              <span>हिंदी</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-slideInLeft bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 animate-bounce-gentle" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((q, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 text-wrap hover:scale-105 hover:bg-blue-50 transition-all duration-300 animate-fadeInUp group"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleQuickQuestion(language === "english" ? q.en : q.hi)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg group-hover:animate-bounce">{q.icon}</span>
                      <span className="group-hover:text-blue-600 transition-colors duration-300">
                        {language === "english" ? q.en : q.hi}
                      </span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)] flex flex-col animate-slideInRight bg-white/90 backdrop-blur-sm shadow-2xl">
              <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
                    <span>Legal Assistant Chat</span>
                    {messageCount > 0 && (
                      <Badge variant="secondary" className="animate-bounce">
                        {messageCount} responses
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center space-x-1 animate-pulse-glow">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Groq AI</span>
                    <Zap className="h-3 w-3 text-yellow-500 animate-bounce" />
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
                <div className="space-y-4 pb-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 animate-fadeInUp ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                            : "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg animate-pulse-glow"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 animate-bounce-gentle" />
                        )}
                      </div>
                      <div className={`flex-1 max-w-3xl ${message.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block p-4 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm hover:from-blue-700 hover:to-blue-800"
                              : "bg-white border shadow-sm rounded-bl-sm hover:shadow-md hover:bg-gray-50"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <div className="space-y-2">{formatLegalResponse(message.content)}</div>
                          ) : (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-2">{new Date().toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-3 animate-fadeIn">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white flex items-center justify-center animate-pulse">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block p-4 rounded-2xl bg-white border shadow-sm rounded-bl-sm">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600">Groq AI is processing</span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
                              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={language === "english" ? "Ask your legal question..." : "अपना कानूनी प्रश्न पूछें..."}
                    className="flex-1 transition-all duration-300 focus:scale-105 focus:shadow-lg bg-white/80 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="hover:scale-110 transition-all duration-300 hover:shadow-lg animate-pulse-glow"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 hover:translate-x-1 transition-transform duration-300" />
                    )}
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center animate-fadeIn">
                  {language === "english"
                    ? "LegalMitra provides general legal information. Consult a lawyer for specific advice."
                    : "LegalMitra सामान्य कानूनी जानकारी प्रदान करता है। विशिष्ट सलाह के लिए वकील से सलाह लें।"}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  )
}
