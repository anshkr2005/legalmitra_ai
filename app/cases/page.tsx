"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  Scale,
  Home,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Building,
  Gavel,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  const cases = [
    {
      id: 1,
      title: "Property Dispute - Sector 15",
      caseNumber: "CS/2024/001",
      type: "Civil",
      status: "active",
      priority: "high",
      nextHearing: "2024-02-15",
      court: "District Court, Gurgaon",
      lawyer: "Adv. Rajesh Kumar",
      progress: 65,
      description: "Property ownership dispute regarding inherited land in Sector 15",
      documents: 12,
      lastUpdate: "2024-01-10",
      estimatedDuration: "6-8 months",
    },
    {
      id: 2,
      title: "Consumer Complaint - Defective Product",
      caseNumber: "CC/2024/045",
      type: "Consumer",
      status: "active",
      priority: "medium",
      nextHearing: "2024-02-20",
      court: "Consumer Court, Delhi",
      lawyer: "Adv. Priya Sharma",
      progress: 40,
      description: "Complaint against electronics manufacturer for defective smartphone",
      documents: 8,
      lastUpdate: "2024-01-12",
      estimatedDuration: "3-4 months",
    },
    {
      id: 3,
      title: "Divorce Proceedings",
      caseNumber: "HMA/2023/089",
      type: "Family",
      status: "completed",
      priority: "high",
      nextHearing: null,
      court: "Family Court, Mumbai",
      lawyer: "Adv. Meera Patel",
      progress: 100,
      description: "Mutual consent divorce proceedings completed successfully",
      documents: 15,
      lastUpdate: "2023-12-20",
      estimatedDuration: "Completed",
    },
    {
      id: 4,
      title: "Employment Dispute",
      caseNumber: "LC/2024/012",
      type: "Labour",
      status: "pending",
      priority: "low",
      nextHearing: "2024-03-01",
      court: "Labour Court, Bangalore",
      lawyer: "Adv. Suresh Reddy",
      progress: 20,
      description: "Wrongful termination case against previous employer",
      documents: 6,
      lastUpdate: "2024-01-08",
      estimatedDuration: "4-6 months",
    },
    {
      id: 5,
      title: "Traffic Violation Appeal",
      caseNumber: "MV/2024/234",
      type: "Criminal",
      status: "active",
      priority: "low",
      nextHearing: "2024-02-25",
      court: "Magistrate Court, Pune",
      lawyer: "Self Represented",
      progress: 30,
      description: "Appeal against traffic challan for alleged overspeeding",
      documents: 4,
      lastUpdate: "2024-01-14",
      estimatedDuration: "2-3 months",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Civil":
        return Scale
      case "Criminal":
        return Gavel
      case "Family":
        return User
      case "Consumer":
        return Building
      case "Labour":
        return Building
      default:
        return FileText
    }
  }

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || caseItem.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return Clock
      case "completed":
        return CheckCircle
      case "pending":
        return AlertCircle
      default:
        return Clock
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <Scale className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Case Management</h1>
                <p className="text-xs text-gray-600">Track Your Legal Cases</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/chat">Ask AI Assistant</Link>
            </Button>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Case</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Tabs */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cases by title or case number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Cases Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredCases.map((caseItem) => {
            const TypeIcon = getTypeIcon(caseItem.type)
            const StatusIcon = getStatusIcon(caseItem.status)

            return (
              <Card
                key={caseItem.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{caseItem.title}</CardTitle>
                        <p className="text-sm text-gray-600 font-mono">{caseItem.caseNumber}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(caseItem.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">{caseItem.type}</Badge>
                    <Badge className={getPriorityColor(caseItem.priority)}>
                      {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)} Priority
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="mb-4 leading-relaxed">{caseItem.description}</CardDescription>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Case Progress</span>
                      <span className="font-medium">{caseItem.progress}%</span>
                    </div>
                    <Progress value={caseItem.progress} className="h-2" />
                  </div>

                  {/* Case Details */}
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Court</p>
                        <p className="font-medium">{caseItem.court}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Lawyer</p>
                        <p className="font-medium">{caseItem.lawyer}</p>
                      </div>
                    </div>

                    {caseItem.nextHearing && (
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-blue-800 font-medium">Next Hearing</p>
                          <p className="text-blue-600">{new Date(caseItem.nextHearing).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{caseItem.documents} docs</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{caseItem.estimatedDuration}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or add a new case</p>
            <div className="flex justify-center space-x-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Case
              </Button>
              <Button variant="outline" asChild>
                <Link href="/chat">Ask AI for Help</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {cases.filter((c) => c.status === "active").length}
              </div>
              <p className="text-gray-600">Active Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {cases.filter((c) => c.status === "completed").length}
              </div>
              <p className="text-gray-600">Completed Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {cases.filter((c) => c.status === "pending").length}
              </div>
              <p className="text-gray-600">Pending Cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {Math.round(cases.reduce((acc, c) => acc + c.progress, 0) / cases.length)}%
              </div>
              <p className="text-gray-600">Average Progress</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
