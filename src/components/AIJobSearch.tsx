import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

export function AIJobSearch() {
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!keywords) {
      toast({
        title: "Please enter keywords",
        description: "Keywords are required to search for jobs",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        "https://moljurgujqtckraxfwby.supabase.co/functions/v1/fetch-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ keywords, location }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }

      toast({
        title: "Jobs fetched successfully",
        description: "Check your dashboard for the new job listings",
      })
    } catch (error) {
      toast({
        title: "Error fetching jobs",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Job Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Enter job keywords (e.g., React Developer, Product Manager)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Find Jobs with AI"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}