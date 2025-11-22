'use client'

import { useState, useEffect } from 'react'
import { Search, Download, History, Clock, Globe, FileText, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModeToggle } from '@/components/mode-toggle'

interface SubtitleResult {
  id: string
  title: string
  year?: number
  language: string
  downloadUrl: string
  fileName: string
}

interface HistoryItem extends SubtitleResult {
  createdAt: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SubtitleResult[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('search')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/subtitles/history')
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/subtitles/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (subtitle: SubtitleResult) => {
    try {
      const response = await fetch(`/api/subtitles/download?url=${encodeURIComponent(subtitle.downloadUrl)}&fileName=${encodeURIComponent(subtitle.fileName)}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = subtitle.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Add to history
      await fetch('/api/subtitles/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtitle)
      })
      
      fetchHistory()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl md:text-6xl font-bold mb-2">
              <span className="text-gradient">Beamlak</span>
              <span className="brown-gold"> SRTs</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Search and download subtitles for movies and TV shows
            </p>
          </div>
          <div className="ml-4">
            <ModeToggle />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search" className="button-hover flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="history" className="button-hover flex items-center gap-2">
              <History className="w-4 h-4" />
              History
              {history.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-2 py-0 text-xs">
                  {history.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card className="card-hover border-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold brown-gold">
                  Search Subtitles
                </CardTitle>
                <CardDescription className="text-base">
                  Enter a movie or TV show title to find subtitles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter movie or show title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 text-base h-12 border-2 focus:border-primary"
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className="button-hover px-6 h-12 text-base font-semibold"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {searchResults.length > 0 && (
              <Card className="card-hover border-2 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gradient">
                    Search Results
                  </CardTitle>
                  <CardDescription>
                    Found <span className="gold-accent font-semibold">{searchResults.length}</span> subtitle(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id} 
                        className="flex items-center justify-between p-4 border-2 rounded-lg card-hover bg-card/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 brown-gold">
                            {result.title}
                          </h3>
                          {result.year && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.year}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              className="flex items-center gap-1 px-3 py-1 button-hover"
                            >
                              <Globe className="w-3 h-3" />
                              {result.language}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="flex items-center gap-1 px-3 py-1 button-hover"
                            >
                              <FileText className="w-3 h-3" />
                              {result.fileName}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(result)}
                          size="lg"
                          className="button-hover ml-4 px-6"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-hover border-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gradient">
                  Download History
                </CardTitle>
                <CardDescription className="text-base">
                  Your previously downloaded subtitles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No download history yet</p>
                    <p className="text-sm">
                      Start searching and downloading subtitles to see them here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 border-2 rounded-lg card-hover bg-card/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 brown-gold">
                            {item.title}
                          </h3>
                          {item.year && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.year}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              className="flex items-center gap-1 px-3 py-1 button-hover"
                            >
                              <Globe className="w-3 h-3" />
                              {item.language}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="flex items-center gap-1 px-3 py-1 button-hover"
                            >
                              <Clock className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(item)}
                          size="lg"
                          variant="outline"
                          className="button-hover ml-4 px-6"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Again
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}