import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const count = await prisma.note.count();
        return NextResponse.json({ ok: true, notesCount: count });
    } catch (error) {
        console.error('DB test error:', error);
        return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
    }
}
