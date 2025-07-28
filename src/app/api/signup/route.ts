import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json()
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: {
      name,
      email
    }
  })
  
  return NextResponse.json({ success: true, userId: user.id })
}