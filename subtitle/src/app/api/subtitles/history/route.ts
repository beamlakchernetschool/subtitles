import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const history = await db.subtitleHistory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(history)
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, year, language, downloadUrl, fileName } = body

    if (!title || !language || !downloadUrl || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const historyItem = await db.subtitleHistory.create({
      data: {
        title,
        year: year ? parseInt(year) : null,
        language,
        downloadUrl,
        fileName
      }
    })

    return NextResponse.json(historyItem)
  } catch (error) {
    console.error('History creation error:', error)
    return NextResponse.json({ error: 'Failed to save to history' }, { status: 500 })
  }
}