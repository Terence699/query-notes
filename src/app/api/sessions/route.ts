import { getQASessions } from '@/actions/chat';
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
    const noteId = searchParams.get('noteId');
    
    if (!noteId) {
      return Response.json({ error: 'Note ID is required' }, { status: 400 });
    }

    const result = await getQASessions(parseInt(noteId));
    return Response.json(result);
  } catch (error) {
    console.error('[SESSIONS API ERROR]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 