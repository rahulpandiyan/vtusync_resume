import { NextResponse } from 'next/server';
import { getLinkedInAuthUrl } from '@/utils/actions/linkedin/actions';

export async function GET() {
  try {
    const authUrl = await getLinkedInAuthUrl();
    return NextResponse.json({ url: authUrl });
  } catch {
    return NextResponse.json(
      { error: 'Failed to get LinkedIn auth URL' },
      { status: 500 }
    );
  }
}
