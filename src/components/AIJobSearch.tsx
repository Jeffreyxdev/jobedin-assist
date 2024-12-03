import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import axios from 'axios'

export function AIJobSearch() {

 
 
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const params = {
   
    page: 1,
    keywords,
    location,
};
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
      const responses =`https://api.scrapingdog.com/linkedinjobs`
      axios.get(responses, { params })
      .then(response => {
          // Check if the request was successful (status code 200)
          if (response.status === 200) {
              // Access the response data
              const data = response.data;
              console.log(data);
          } else {
              console.log("Request failed with status code:", response.status);
          }
      })
      .catch(error => {
          console.error("An error occurred:", error);
      });
     
    
      
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