'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('nenegro');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuthStore();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded credentials as requested
        if (username === 'nenegro' && password === 'Eider1993.1') {
            login();
            router.push('/');
        } else {
            setError('Access Denied. Invalid Credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-500 to-transparent opacity-50"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-nexus-400 shadow-lg shadow-nexus-500/10">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Nexus Admin</h1>
                    <p className="text-slate-500 text-sm">Secure Entry Node</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Codename</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all"
                            placeholder="Enter user ID"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Passkey</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-nexus-500 focus:ring-1 focus:ring-nexus-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-mono">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-nexus-600 hover:bg-nexus-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-nexus-500/20 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}
