import { getQAMessages } from '@/actions/chat';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return Response.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const result = await getQAMessages(parseInt(sessionId));
    return Response.json(result);
  } catch (error) {
    console.error('[MESSAGES API ERROR]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 