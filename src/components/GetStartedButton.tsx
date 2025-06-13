'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function GetStartedButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    checkUser();
  }, []);

  const getStartedLink = user ? '/notes' : '/signup';

  if (loading) {
    return (
      <div className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md animate-pulse">
        Get started
      </div>
    );
  }

  return (
    <Link
      href={getStartedLink}
      className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
    >
      Get started
    </Link>
  );
} 