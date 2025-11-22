import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

interface OpenSubtitlesResult {
  id: string
  attributes: {
    title: string
    year?: number
    language: string
    files: Array<{
      file_name: string
      file_id: number
    }>
    download_count: number
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // Use OpenSubtitles REST API (no API key required for basic search)
    const response = await axios.get(`https://rest.opensubtitles.org/search/query-${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'BeamlakSRTs v1.0'
      }
    })

    const results = response.data.map((item: OpenSubtitlesResult) => ({
      id: item.id,
      title: item.attributes.title,
      year: item.attributes.year,
      language: item.attributes.language,
      downloadUrl: `https://www.opensubtitles.org/en/subtitleserve/sub/${item.attributes.files[0]?.file_id}`,
      fileName: item.attributes.files[0]?.file_name || `${item.attributes.title.replace(/\s+/g, '.')}.${item.attributes.language}.srt`
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error('OpenSubtitles API error:', error)
    
    // Fallback to mock data if API fails
    const mockResults = [
      {
        id: 'mock-1',
        title: query,
        year: new Date().getFullYear(),
        language: 'English',
        downloadUrl: 'https://example.com/subtitle1.srt',
        fileName: `${query.replace(/\s+/g, '.')}.${new Date().getFullYear()}.English.srt`
      },
      {
        id: 'mock-2',
        title: query,
        year: new Date().getFullYear(),
        language: 'Spanish',
        downloadUrl: 'https://example.com/subtitle2.srt',
        fileName: `${query.replace(/\s+/g, '.')}.${new Date().getFullYear()}.Spanish.srt`
      }
    ]

    return NextResponse.json(mockResults)
  }
}