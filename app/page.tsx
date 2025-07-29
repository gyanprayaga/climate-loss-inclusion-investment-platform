"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import {
  MapPin,
  Satellite,
  Users,
  Home,
  TreePine,
  AlertTriangle,
  Calendar,
  Download,
  Share2,
  Layers,
  DollarSign,
  Leaf,
  TrendingUp,
  Shield,
  Target,
  Globe,
  Building,
  Heart,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"

// Dynamic import to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import("@/components/wildfire-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-green-900 flex items-center justify-center">
      <div className="text-white">Loading map...</div>
    </div>
  ),
})

const forestLossData = [
  { month: "Jan", hectares: 1200, cumulative: 1200 },
  { month: "Feb", hectares: 2800, cumulative: 4000 },
  { month: "Mar", hectares: 4500, cumulative: 8500 },
  { month: "Apr", hectares: 6200, cumulative: 14700 },
  { month: "May", hectares: 8900, cumulative: 23600 },
  { month: "Jun", hectares: 12400, cumulative: 36000 },
  { month: "Jul", hectares: 15600, cumulative: 51600 },
  { month: "Aug", hectares: 18200, cumulative: 69800 },
]

const impactData = [
  { name: "Primary Forest", value: 45, color: "#22c55e" },
  { name: "Secondary Forest", value: 30, color: "#84cc16" },
  { name: "Agricultural Land", value: 15, color: "#eab308" },
  { name: "Settlements", value: 10, color: "#ef4444" },
]

const economicLossData = [
  { category: "Timber", loss: 245, color: "#22c55e" },
  { category: "Agriculture", loss: 89, color: "#eab308" },
  { category: "Infrastructure", loss: 156, color: "#ef4444" },
  { category: "Tourism", loss: 67, color: "#3b82f6" },
  { category: "Carbon Credits", loss: 34, color: "#8b5cf6" },
]

const biodiversityData = [
  { species: "Jaguar", before: 45, after: 28, status: "Critical" },
  { species: "Giant Otter", before: 120, after: 85, status: "Vulnerable" },
  { species: "Hyacinth Macaw", before: 230, after: 180, status: "Declining" },
  { species: "Marsh Deer", before: 340, after: 290, status: "Stable" },
]

// Investment & Inclusion Data
const communityProjects = [
  {
    name: "Pantanal Indigenous Restoration Co-op",
    community: "Chiquitano Territory",
    type: "Indigenous Community",
    funding: 2.8,
    carbonCredits: 45000,
    jobs: 120,
    status: "Active",
    impactScore: 92,
    landRights: "Secured",
  },
  {
    name: "Cerrado Agroforestry Initiative",
    community: "Small Farmers Collective",
    type: "Vulnerable Group",
    funding: 1.5,
    carbonCredits: 28000,
    jobs: 85,
    status: "Planning",
    impactScore: 87,
    landRights: "In Process",
  },
  {
    name: "Amazon Border Fire Prevention",
    community: "Mixed Communities",
    type: "Multi-Stakeholder",
    funding: 3.2,
    carbonCredits: 52000,
    jobs: 200,
    status: "Active",
    impactScore: 89,
    landRights: "Secured",
  },
]

const institutionalDeals = [
  {
    institution: "New Development Bank",
    dealSize: 45,
    creditVolume: 850000,
    type: "Development Finance",
    status: "Negotiating",
    esgCompliance: "EU Taxonomy",
  },
  {
    institution: "International Finance Corporation",
    dealSize: 32,
    creditVolume: 620000,
    type: "Blended Finance",
    status: "Due Diligence",
    esgCompliance: "TCFD Aligned",
  },
  {
    institution: "European Investment Bank",
    dealSize: 28,
    creditVolume: 480000,
    type: "Green Bond",
    status: "Active",
    esgCompliance: "EU Taxonomy",
  },
]

const impactMetrics = [
  { category: "Community Jobs Created", value: 405, target: 500, unit: "jobs" },
  { category: "Indigenous Participation", value: 68, target: 75, unit: "%" },
  { category: "Carbon Credits Generated", value: 125000, target: 200000, unit: "tCO₂" },
  { category: "Land Rights Secured", value: 15600, target: 25000, unit: "ha" },
  { category: "Women's Participation", value: 42, target: 50, unit: "%" },
  { category: "Cultural Sites Protected", value: 8, target: 12, unit: "sites" },
]

const subRegions = [
  {
    name: "Pantanal Norte",
    forestLoss: 18500,
    communities: 12,
    structures: 340,
    population: 8500,
    foodSecurity: "Critical",
    indigenous: true,
    economicLoss: 89.5,
    carbonLoss: 245000,
  },
  {
    name: "Chiquitania",
    forestLoss: 24200,
    communities: 8,
    structures: 180,
    population: 5200,
    foodSecurity: "Severe",
    indigenous: true,
    economicLoss: 156.2,
    carbonLoss: 320000,
  },
  {
    name: "Cerrado Sul",
    forestLoss: 15800,
    communities: 15,
    structures: 420,
    population: 12300,
    foodSecurity: "Moderate",
    indigenous: false,
    economicLoss: 67.8,
    carbonLoss: 189000,
  },
  {
    name: "Amazon Border",
    forestLoss: 11300,
    communities: 6,
    structures: 95,
    population: 3800,
    foodSecurity: "Critical",
    indigenous: true,
    economicLoss: 78.3,
    carbonLoss: 156000,
  },
]

const mapLayers = [
  { id: "satellite", name: "Satellite", icon: Satellite, active: true },
  { id: "vegetation", name: "Vegetation Index", icon: TreePine, active: false },
  { id: "fires", name: "Burned Areas", icon: AlertTriangle, active: true },
  { id: "boundaries", name: "Administrative", icon: MapPin, active: false },
  { id: "indigenous", name: "Indigenous Lands", icon: Users, active: true },
  { id: "settlements", name: "Settlements", icon: Home, active: false },
  { id: "projects", name: "Investment Projects", icon: TrendingUp, active: false },
  { id: "institutional", name: "Institutional Zones", icon: Building, active: false },
]

export default function WildfireLossAnalysis() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [timeRange, setTimeRange] = useState("2024")
  const [activeMapType, setActiveMapType] = useState("satellite")
  const [layers, setLayers] = useState(mapLayers)
  const [showLayerPanel, setShowLayerPanel] = useState(true)
  const [activeTab, setActiveTab] = useState("loss-analysis")

  const toggleLayer = (layerId: string) => {
    setLayers(layers.map((layer) => (layer.id === layerId ? { ...layer, active: !layer.active } : layer)))
  }

  const totalEconomicLoss = subRegions.reduce((sum, region) => sum + region.economicLoss, 0)
  const totalCarbonLoss = subRegions.reduce((sum, region) => sum + region.carbonLoss, 0)
  const totalPopulation = subRegions.reduce((sum, region) => sum + region.population, 0)
  const totalArea = subRegions.reduce((sum, region) => sum + region.forestLoss, 0)

  const totalInvestment = communityProjects.reduce((sum, project) => sum + project.funding, 0)
  const totalJobs = communityProjects.reduce((sum, project) => sum + project.jobs, 0)
  const totalCredits = communityProjects.reduce((sum, project) => sum + project.carbonCredits, 0)

  // Update layers when switching tabs
  useEffect(() => {
    if (activeTab === "investment-inclusion") {
      // Enable investment layers, disable fire layers
      setLayers(
        layers.map((layer) => ({
          ...layer,
          active:
            layer.id === "satellite" ||
            layer.id === "indigenous" ||
            layer.id === "projects" ||
            layer.id === "institutional",
        })),
      )
    } else {
      // Enable fire analysis layers
      setLayers(
        layers.map((layer) => ({
          ...layer,
          active: layer.id === "satellite" || layer.id === "fires" || layer.id === "indigenous",
        })),
      )
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Brazil-Bolivia Wildfires</h1>
                  <p className="text-sm text-gray-500">Loss Analysis & Recovery Investment Platform</p>
                </div>
              </div>
              <Badge variant="destructive" className="ml-4">
                Active Crisis
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white border-b">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100">
              <TabsTrigger value="loss-analysis" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Loss Analysis
              </TabsTrigger>
              <TabsTrigger value="investment-inclusion" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Investment & Inclusion
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="loss-analysis" className="mt-0">
          {/* Key Metrics Bar */}
          <div className="bg-white border-b">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">${totalEconomicLoss.toFixed(1)}M</div>
                    <div className="text-xs text-gray-500">Economic Loss</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{totalArea.toLocaleString()} ha</div>
                    <div className="text-xs text-gray-500">Area Burned</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{totalPopulation.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">People Affected</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{(totalCarbonLoss / 1000).toFixed(0)}k tCO₂</div>
                    <div className="text-xs text-gray-500">Carbon Released</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-[calc(100vh-200px)]">
            {/* Left Sidebar */}
            <div className="w-80 bg-white border-r flex flex-col">
              {/* Map Controls */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Map Controls</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowLayerPanel(!showLayerPanel)}>
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Base Map</label>
                    <Select value={activeMapType} onValueChange={setActiveMapType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="satellite">Satellite Imagery</SelectItem>
                        <SelectItem value="vegetation">Vegetation Index (NDVI)</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="osm">OpenStreetMap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Time Range</label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Layer Controls */}
              {showLayerPanel && (
                <div className="p-4 border-b">
                  <h4 className="font-medium text-gray-900 mb-3">Data Layers</h4>
                  <div className="space-y-3">
                    {layers.map((layer) => {
                      const IconComponent = layer.icon
                      return (
                        <div key={layer.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{layer.name}</span>
                          </div>
                          <Switch checked={layer.active} onCheckedChange={() => toggleLayer(layer.id)} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="p-4 border-b">
                <h4 className="font-medium text-gray-900 mb-3">Impact Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Primary Forest</span>
                    <span className="font-medium text-red-600">45%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Secondary Forest</span>
                    <span className="font-medium text-orange-600">30%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Agricultural Land</span>
                    <span className="font-medium text-yellow-600">15%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Settlements</span>
                    <span className="font-medium text-purple-600">10%</span>
                  </div>
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="p-4 flex-1 overflow-y-auto">
                <h4 className="font-medium text-red-600 mb-3">Critical Alerts</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-red-800">Indigenous Territory at Risk</div>
                        <div className="text-xs text-red-600 mt-1">
                          Chiquitania indigenous lands facing severe food security crisis
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-orange-800">Dry Season Peak</div>
                        <div className="text-xs text-orange-600 mt-1">
                          Fire risk remains extremely high through September
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Map Area */}
            <div className="flex-1 relative">
              <DynamicMap
                activeMapType={activeMapType}
                layers={layers}
                timeRange={timeRange}
                activeTab={activeTab}
                className="w-full h-full"
              />
            </div>

            {/* Right Sidebar - Loss Analysis */}
            <div className="w-96 bg-white border-l flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Impact Assessment</h3>
                <p className="text-sm text-gray-500">Financial and ecological analysis</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Financial Impact Summary */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Financial Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Total Economic Loss</div>
                          <div className="text-lg font-bold text-red-600">${totalEconomicLoss.toFixed(1)}M USD</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Insurance Claims</div>
                          <div className="text-lg font-bold text-orange-600">
                            ${(totalEconomicLoss * 0.65).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Recovery Cost Est.</span>
                          <span className="font-medium">${(totalEconomicLoss * 1.8).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>GDP Impact</span>
                          <span className="font-medium text-red-600">-0.3%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Economic Loss Breakdown */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Economic Loss by Sector</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          loss: { label: "Loss (Million USD)", color: "hsl(var(--chart-1))" },
                        }}
                        className="h-48"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={economicLossData} layout="horizontal">
                            <XAxis type="number" hide />
                            <YAxis dataKey="category" type="category" width={80} fontSize={12} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="loss" fill="#ef4444" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Ecological Damage */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Ecological Damage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Carbon Released</div>
                          <div className="text-lg font-bold text-green-600">
                            {(totalCarbonLoss / 1000).toFixed(0)}k tCO₂
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Ecosystem Value</div>
                          <div className="text-lg font-bold text-blue-600">
                            ${(totalEconomicLoss * 2.3).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Biodiversity Loss</span>
                          <span className="font-medium text-red-600">-28%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Soil Degradation</span>
                          <span className="font-medium text-orange-600">45,200 ha</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Water Quality Impact</span>
                          <span className="font-medium text-yellow-600">Moderate</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Biodiversity Impact */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Species Population Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biodiversityData.map((species, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{species.species}</span>
                              <Badge
                                variant={
                                  species.status === "Critical"
                                    ? "destructive"
                                    : species.status === "Vulnerable"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {species.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Before: {species.before}</span>
                              <span>After: {species.after}</span>
                              <span className="text-red-600">
                                -{Math.round(((species.before - species.after) / species.before) * 100)}%
                              </span>
                            </div>
                            <Progress value={(species.after / species.before) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Regional Breakdown */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Regional Impact Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {subRegions.map((region, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-sm">{region.name}</div>
                              {region.indigenous && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  Indigenous
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Area Burned:</span>
                                  <span className="font-medium text-red-600">
                                    {region.forestLoss.toLocaleString()} ha
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Population:</span>
                                  <span className="font-medium">{region.population.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Economic Loss:</span>
                                  <span className="font-medium text-red-600">${region.economicLoss}M</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Structures:</span>
                                  <span className="font-medium">{region.structures}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Carbon Loss:</span>
                                  <span className="font-medium text-green-600">
                                    {(region.carbonLoss / 1000).toFixed(0)}k tCO₂
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Food Security:</span>
                                  <Badge
                                    variant={
                                      region.foodSecurity === "Critical"
                                        ? "destructive"
                                        : region.foodSecurity === "Severe"
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className="text-xs h-4"
                                  >
                                    {region.foodSecurity}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="investment-inclusion" className="mt-0">
          {/* Investment Metrics Bar */}
          <div className="bg-white border-b">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">${totalInvestment.toFixed(1)}M</div>
                    <div className="text-xs text-gray-500">Community Investment</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{totalJobs}</div>
                    <div className="text-xs text-gray-500">Jobs Created</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{(totalCredits / 1000).toFixed(0)}k</div>
                    <div className="text-xs text-gray-500">Carbon Credits</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">68%</div>
                    <div className="text-xs text-gray-500">Indigenous Participation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-[calc(100vh-200px)]">
            {/* Left Sidebar - Investment Controls */}
            <div className="w-80 bg-white border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Investment Controls</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowLayerPanel(!showLayerPanel)}>
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Base Map</label>
                    <Select value={activeMapType} onValueChange={setActiveMapType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="satellite">Satellite Imagery</SelectItem>
                        <SelectItem value="vegetation">Vegetation Index (NDVI)</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="osm">OpenStreetMap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Community Type</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Communities</SelectItem>
                        <SelectItem value="indigenous">Indigenous</SelectItem>
                        <SelectItem value="vulnerable">Vulnerable Groups</SelectItem>
                        <SelectItem value="mixed">Multi-Stakeholder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Layer Controls */}
              {showLayerPanel && (
                <div className="p-4 border-b">
                  <h4 className="font-medium text-gray-900 mb-3">Investment Layers</h4>
                  <div className="space-y-3">
                    {layers.map((layer) => {
                      const IconComponent = layer.icon
                      return (
                        <div key={layer.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{layer.name}</span>
                          </div>
                          <Switch checked={layer.active} onCheckedChange={() => toggleLayer(layer.id)} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Priority Criteria */}
              <div className="p-4 border-b">
                <h4 className="font-medium text-gray-900 mb-3">Priority Criteria</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Land Rights Secured</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Indigenous Priority</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700">Vulnerable Groups</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">High Impact Score</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Investment Opportunities */}
              <div className="p-4 flex-1 overflow-y-auto">
                <h4 className="font-medium text-green-600 mb-3">Investment Opportunities</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-green-800">New Co-op Formation</div>
                        <div className="text-xs text-green-600 mt-1">
                          3 indigenous communities ready for restoration investment
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">Institutional Interest</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Development banks seeking blended finance opportunities
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Map Area */}
            <div className="flex-1 relative">
              <DynamicMap
                activeMapType={activeMapType}
                layers={layers}
                timeRange={timeRange}
                activeTab={activeTab}
                className="w-full h-full"
              />
            </div>

            {/* Right Sidebar - Investment & Inclusion Content */}
            <div className="w-96 bg-white border-l flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Investment & Inclusion</h3>
                <p className="text-sm text-gray-500">Community-centered finance & impact tracking</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Community Projects */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Community Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {communityProjects.map((project, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-sm">{project.name}</div>
                              <Badge
                                variant={project.type === "Indigenous Community" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {project.type}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Funding:</span>
                                  <span className="font-medium text-green-600">${project.funding}M</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Jobs:</span>
                                  <span className="font-medium">{project.jobs}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Impact Score:</span>
                                  <span className="font-medium text-blue-600">{project.impactScore}/100</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Carbon:</span>
                                  <span className="font-medium text-purple-600">
                                    {(project.carbonCredits / 1000).toFixed(0)}k tCO₂
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Status:</span>
                                  <Badge
                                    variant={project.status === "Active" ? "default" : "outline"}
                                    className="text-xs h-4"
                                  >
                                    {project.status}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Land Rights:</span>
                                  <span
                                    className={`text-xs font-medium ${
                                      project.landRights === "Secured" ? "text-green-600" : "text-orange-600"
                                    }`}
                                  >
                                    {project.landRights}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Institutional Deals */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Institutional Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {institutionalDeals.map((deal, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-sm">{deal.institution}</div>
                              <Badge variant="outline" className="text-xs">
                                {deal.esgCompliance}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Deal Size:</span>
                                  <span className="font-medium text-green-600">${deal.dealSize}M</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Type:</span>
                                  <span className="font-medium">{deal.type}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Credits:</span>
                                  <span className="font-medium text-purple-600">
                                    {(deal.creditVolume / 1000).toFixed(0)}k tCO₂
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Status:</span>
                                  <Badge
                                    variant={deal.status === "Active" ? "default" : "secondary"}
                                    className="text-xs h-4"
                                  >
                                    {deal.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Impact Metrics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Impact Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {impactMetrics.map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{metric.category}</span>
                              <span className="text-xs text-gray-500">
                                {metric.value.toLocaleString()}/{metric.target.toLocaleString()} {metric.unit}
                              </span>
                            </div>
                            <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Blended Finance Structure */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Blended Finance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Philanthropic Capital</span>
                          <span className="font-medium text-green-600">25%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Development Finance</span>
                          <span className="font-medium text-blue-600">45%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Commercial Capital</span>
                          <span className="font-medium text-purple-600">30%</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Capital Mobilized</span>
                          <span className="text-green-600">$105M</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vulnerable Group Participation */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Inclusion Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Indigenous Communities</span>
                          <span className="font-medium text-blue-600">68%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Women's Participation</span>
                          <span className="font-medium text-purple-600">42%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Youth Involvement</span>
                          <span className="font-medium text-green-600">35%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Small Farmers</span>
                          <span className="font-medium text-orange-600">58%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
