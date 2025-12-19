'use client';

import { AuthProvider as AuthProviderContext } from '@/context/AuthContext';

export default function AuthProvider({ children }) {
    return <AuthProviderContext>{children}</AuthProviderContext>;
}

