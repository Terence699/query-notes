'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import UserDropdown from './UserDropdown';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
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

  if (loading) {
    return <div className="py-2 px-4 rounded-md bg-muted animate-pulse w-28"></div>;
  }

  return user ? (
    <UserDropdown user={user} />
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
    >
      Login
    </Link>
  );
} 