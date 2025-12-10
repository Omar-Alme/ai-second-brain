// app/api/db-test/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const count = await prisma.userProfile.count();
        return NextResponse.json({ ok: true, userProfiles: count });
    } catch (error) {
        console.error('[db-test] error:', error);
        return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
    }
}
