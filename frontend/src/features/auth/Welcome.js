import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from 'lucide-react'

const Welcome = () => {
  const materials = [
    { id: 1, title: "Basic Phrases", language: "Spanish" },
    { id: 2, title: "Numbers 1-100", language: "French" },
    { id: 3, title: "Common Verbs", language: "German" },
    { id: 4, title: "Food Vocabulary", language: "Italian" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
      <h2 className="text-xl mb-6">What are we learning today?</h2>

      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search materials..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Materials Collection</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <CardTitle>{material.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{material.language}</p>
              <Button asChild className="mt-4">
                <Link to={`/material/${material.id}`}>Start Learning</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Welcome

