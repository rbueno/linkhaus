import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req, ev) {
    const { pathname } = req.nextUrl
    const host = req.headers.get('host')
    
    // if (!host.startsWith('www') && pathname.startsWith('/dashboard')) return NextResponse.redirect('https://www.linkhaus.app/dashboard')
    return NextResponse.next()
}