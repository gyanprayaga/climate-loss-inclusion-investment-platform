"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Popup, Polygon, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Burned area polygons with different fire intensity levels
const burnedAreas = [
  {
    id: 1,
    name: "Pantanal Norte Burn Zone",
    intensity: "Critical",
    area: 18500,
    coordinates: [
      [-16.1, -63.4],
      [-16.3, -63.4],
      [-16.4, -63.7],
      [-16.2, -63.8],
      [-16.0, -63.6],
    ],
    structures: 145,
    vegetation: "Primary Forest",
  },
  {
    id: 2,
    name: "Chiquitania Severe Burn",
    intensity: "Severe",
    area: 24200,
    coordinates: [
      [-17.6, -63.0],
      [-17.9, -63.1],
      [-18.0, -63.4],
      [-17.7, -63.5],
      [-17.5, -63.2],
    ],
    structures: 78,
    vegetation: "Mixed Forest",
  },
  {
    id: 3,
    name: "Cerrado Sul Moderate Burn",
    intensity: "Moderate",
    area: 15800,
    coordinates: [
      [-15.3, -62.3],
      [-15.6, -62.4],
      [-15.7, -62.7],
      [-15.4, -62.8],
      [-15.2, -62.5],
    ],
    structures: 23,
    vegetation: "Cerrado Savanna",
  },
  {
    id: 4,
    name: "Amazon Border High Intensity",
    intensity: "High",
    area: 11300,
    coordinates: [
      [-16.6, -64.0],
      [-16.9, -64.1],
      [-17.0, -64.4],
      [-16.7, -64.5],
      [-16.5, -64.2],
    ],
    structures: 12,
    vegetation: "Amazon Rainforest",
  },
  {
    id: 5,
    name: "Eastern Chiquitania Burn",
    intensity: "High",
    area: 8900,
    coordinates: [
      [-17.0, -62.5],
      [-17.2, -62.6],
      [-17.3, -62.9],
      [-17.1, -63.0],
      [-16.9, -62.7],
    ],
    structures: 56,
    vegetation: "Secondary Forest",
  },
  {
    id: 6,
    name: "Pantanal South Moderate",
    intensity: "Moderate",
    area: 6200,
    coordinates: [
      [-16.7, -63.5],
      [-16.9, -63.6],
      [-17.0, -63.9],
      [-16.8, -64.0],
      [-16.6, -63.7],
    ],
    structures: 34,
    vegetation: "Wetland Forest",
  },
]

// Indigenous territory polygons
const indigenousTerritories = [
  {
    name: "Chiquitano Territory",
    coordinates: [
      [-17.5, -62.8],
      [-17.8, -62.8],
      [-17.8, -63.2],
      [-17.5, -63.2],
    ],
  },
  {
    name: "Pantanal Indigenous Area",
    coordinates: [
      [-16.1, -63.3],
      [-16.4, -63.3],
      [-16.4, -63.7],
      [-16.1, -63.7],
    ],
  },
]

// Investment projects with geographic locations
const investmentProjects = [
  {
    id: 1,
    name: "Pantanal Indigenous Restoration Co-op",
    community: "Chiquitano Territory",
    type: "Indigenous Community",
    funding: 2.8,
    carbonCredits: 45000,
    jobs: 120,
    status: "Active",
    impactScore: 92,
    landRights: "Secured",
    coordinates: [-16.2, -63.5],
  },
  {
    id: 2,
    name: "Cerrado Agroforestry Initiative",
    community: "Small Farmers Collective",
    type: "Vulnerable Group",
    funding: 1.5,
    carbonCredits: 28000,
    jobs: 85,
    status: "Planning",
    impactScore: 87,
    landRights: "In Process",
    coordinates: [-15.4, -62.6],
  },
  {
    id: 3,
    name: "Amazon Border Fire Prevention",
    community: "Mixed Communities",
    type: "Multi-Stakeholder",
    funding: 3.2,
    carbonCredits: 52000,
    jobs: 200,
    status: "Active",
    impactScore: 89,
    landRights: "Secured",
    coordinates: [-16.8, -64.2],
  },
]

// Institutional investment areas
const institutionalAreas = [
  {
    name: "New Development Bank Zone",
    dealSize: 45,
    coordinates: [
      [-17.2, -62.8],
      [-17.5, -62.8],
      [-17.5, -63.2],
      [-17.2, -63.2],
    ],
  },
  {
    name: "IFC Blended Finance Area",
    dealSize: 32,
    coordinates: [
      [-15.8, -63.0],
      [-16.1, -63.0],
      [-16.1, -63.4],
      [-15.8, -63.4],
    ],
  },
]

interface WildfireMapProps {
  activeMapType: string
  layers: Array<{ id: string; name: string; active: boolean }>
  timeRange: string
  activeTab: string
  className?: string
}

function MapUpdater({ activeMapType }: { activeMapType: string }) {
  const map = useMap()

  useEffect(() => {
    // You could add logic here to update the map when activeMapType changes
    // For now, we'll just invalidate the size to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [activeMapType, map])

  return null
}

export default function WildfireMap({ activeMapType, layers, timeRange, activeTab, className }: WildfireMapProps) {
  const mapRef = useRef<L.Map>(null)

  // Get tile layer URL based on map type
  const getTileLayerUrl = () => {
    switch (activeMapType) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      case "vegetation":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
      case "terrain":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
      case "osm":
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
  }

  const getTileLayerAttribution = () => {
    switch (activeMapType) {
      case "satellite":
      case "vegetation":
      case "terrain":
        return "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      case "osm":
      default:
        return "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
    }
  }

  // Center on Brazil-Bolivia border region
  const center: [number, number] = [-16.5, -63.2]
  const zoom = 8

  const showFires = layers.find((l) => l.id === "fires")?.active
  const showIndigenous = layers.find((l) => l.id === "indigenous")?.active
  const showSettlements = layers.find((l) => l.id === "settlements")?.active

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
      >
        <MapUpdater activeMapType={activeMapType} />

        <TileLayer url={getTileLayerUrl()} attribution={getTileLayerAttribution()} />

        {/* Burned Area Polygons */}
        {showFires &&
          burnedAreas.map((area) => {
            let fillColor = "#fbbf24" // Default moderate
            let strokeColor = "#f59e0b"

            if (area.intensity === "Critical") {
              fillColor = "#dc2626"
              strokeColor = "#991b1b"
            } else if (area.intensity === "Severe") {
              fillColor = "#ea580c"
              strokeColor = "#c2410c"
            } else if (area.intensity === "High") {
              fillColor = "#f97316"
              strokeColor = "#ea580c"
            }

            return (
              <Polygon
                key={area.id}
                positions={area.coordinates as [number, number][]}
                pathOptions={{
                  color: strokeColor,
                  weight: 2,
                  opacity: 0.8,
                  fillColor: fillColor,
                  fillOpacity: 0.6,
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-2">{area.name}</h3>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <strong>Fire Intensity:</strong>
                        <span
                          className={
                            area.intensity === "Critical"
                              ? "text-red-600 font-medium"
                              : area.intensity === "Severe"
                                ? "text-orange-600 font-medium"
                                : area.intensity === "High"
                                  ? "text-orange-500 font-medium"
                                  : "text-yellow-600 font-medium"
                          }
                        >
                          {area.intensity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Burned Area:</strong>
                        <span>{area.area.toLocaleString()} ha</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Vegetation Type:</strong>
                        <span>{area.vegetation}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Structures Lost:</strong>
                        <span className="text-red-600 font-medium">{area.structures}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            )
          })}

        {/* Indigenous Territories */}
        {showIndigenous &&
          indigenousTerritories.map((territory, index) => (
            <Polygon
              key={index}
              positions={territory.coordinates as [number, number][]}
              pathOptions={{
                color: "#3b82f6",
                weight: 2,
                opacity: 0.8,
                fillColor: "#3b82f6",
                fillOpacity: 0.2,
                dashArray: "5, 5",
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{territory.name}</h3>
                  <div className="text-xs">
                    <div className="text-blue-600 font-medium">Indigenous Protected Area</div>
                    <div className="mt-1">Critical food security risk</div>
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Investment Projects - only show on Investment & Inclusion tab */}
        {activeTab === "investment-inclusion" &&
          layers.find((l) => l.id === "projects")?.active &&
          investmentProjects.map((project) => {
            let markerColor = "#3b82f6" // Default blue
            if (project.type === "Indigenous Community") markerColor = "#22c55e"
            if (project.type === "Vulnerable Group") markerColor = "#f59e0b"
            if (project.status === "Planning") markerColor = "#6b7280"

            return (
              <Marker
                key={project.id}
                position={project.coordinates as [number, number]}
                icon={L.divIcon({
                  className: "custom-investment-marker",
                  html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                })}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <h3 className="font-semibold text-sm mb-2">{project.name}</h3>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <strong>Community:</strong>
                        <span>{project.community}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Type:</strong>
                        <span
                          className={
                            project.type === "Indigenous Community"
                              ? "text-green-600 font-medium"
                              : project.type === "Vulnerable Group"
                                ? "text-orange-600 font-medium"
                                : "text-blue-600 font-medium"
                          }
                        >
                          {project.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Funding:</strong>
                        <span className="text-green-600 font-medium">${project.funding}M</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Jobs Created:</strong>
                        <span className="text-blue-600 font-medium">{project.jobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Carbon Credits:</strong>
                        <span className="text-purple-600 font-medium">
                          {(project.carbonCredits / 1000).toFixed(0)}k tCO₂
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Status:</strong>
                        <span
                          className={
                            project.status === "Active" ? "text-green-600 font-medium" : "text-orange-600 font-medium"
                          }
                        >
                          {project.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Impact Score:</strong>
                        <span className="text-blue-600 font-medium">{project.impactScore}/100</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}

        {/* Institutional Investment Areas - only show on Investment & Inclusion tab */}
        {activeTab === "investment-inclusion" &&
          layers.find((l) => l.id === "institutional")?.active &&
          institutionalAreas.map((area, index) => (
            <Polygon
              key={index}
              positions={area.coordinates as [number, number][]}
              pathOptions={{
                color: "#8b5cf6",
                weight: 2,
                opacity: 0.8,
                fillColor: "#8b5cf6",
                fillOpacity: 0.2,
                dashArray: "10, 5",
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{area.name}</h3>
                  <div className="text-xs">
                    <div className="text-purple-600 font-medium">Deal Size: ${area.dealSize}M</div>
                    <div className="mt-1">Institutional Investment Zone</div>
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Custom Controls */}
        <div className="leaflet-top leaflet-left" style={{ marginTop: "10px", marginLeft: "10px" }}>
          <div className="leaflet-control leaflet-bar bg-white rounded-lg shadow-lg p-3">
            <div className="text-xs font-medium mb-2">
              {activeTab === "investment-inclusion" ? "Investment Legend" : "Fire Intensity Legend"}
            </div>
            {activeTab === "investment-inclusion" && layers.find((l) => l.id === "projects")?.active && (
              <div className="space-y-1 text-xs mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Indigenous Community</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Vulnerable Group</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Multi-Stakeholder</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Planning Stage</span>
                </div>
              </div>
            )}
            {activeTab === "loss-analysis" && showFires && (
              <div className="space-y-1 text-xs mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-sm opacity-60"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-sm opacity-60"></div>
                  <span>Severe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-sm opacity-60"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm opacity-60"></div>
                  <span>Moderate</span>
                </div>
              </div>
            )}
            <div className="text-xs font-medium mb-2">Active Layers</div>
            <div className="space-y-1 text-xs">
              {layers
                .filter((layer) => layer.active)
                .map((layer) => {
                  let color = "bg-gray-400"
                  if (layer.id === "fires") color = "bg-red-500"
                  if (layer.id === "vegetation") color = "bg-green-500"
                  if (layer.id === "indigenous") color = "bg-blue-400"
                  if (layer.id === "settlements") color = "bg-purple-500"

                  return (
                    <div key={layer.id} className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${color} rounded-full`}></div>
                      <span>{layer.name}</span>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Map Info */}
        <div className="leaflet-bottom leaflet-left" style={{ marginBottom: "10px", marginLeft: "10px" }}>
          <div className="leaflet-control bg-white rounded-lg shadow-lg p-3">
            <div className="text-xs text-gray-600 mb-1">
              Current View: {activeMapType.charAt(0).toUpperCase() + activeMapType.slice(1)}
            </div>
            <div className="text-xs text-gray-500">Analysis Period: Jan-Aug 2024</div>
            <div className="text-xs text-gray-500">
              {burnedAreas.length} burned area{burnedAreas.length !== 1 ? "s" : ""} analyzed
            </div>
            <div className="text-xs text-gray-500">
              Total: {burnedAreas.reduce((sum, area) => sum + area.area, 0).toLocaleString()} ha
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="leaflet-top leaflet-right" style={{ marginTop: "10px", marginRight: "10px" }}>
          <div className="leaflet-control leaflet-bar bg-white rounded-lg shadow-lg">
            <button
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg font-bold border-b border-gray-200"
              onClick={() => mapRef.current?.zoomIn()}
            >
              +
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-lg font-bold"
              onClick={() => mapRef.current?.zoomOut()}
            >
              −
            </button>
          </div>
        </div>
      </MapContainer>
    </div>
  )
}
