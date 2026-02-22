"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Key, Plus, Trash2, Power, Clock, User, AlertCircle, Pencil, X } from 'lucide-react';

interface License {
    key: string;
    expires_at: string;
    active: boolean;
    reason?: string;
    note?: string;
    last_seen?: string;
    hwid?: string;
}

export default function AdminLicensesPage() {
    const [mounted, setMounted] = useState(false);
    const [token, setToken] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [newLicense, setNewLicense] = useState<License>({
        key: '',
        expires_at: '',
        active: true,
        note: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatForInput = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('T')) return dateStr.substring(0, 16);
        return `${dateStr}T00:00`;
    };
    const fetchLicenses = async (currentAdminToken: string) => {
        try {
            const res = await fetch(`/api/license/admin?token=${currentAdminToken}`);
            if (res.ok) {
                const data = await res.ok ? await res.json() : [];
                setLicenses(data);
                setIsAuthorized(true);
            } else {
                alert("Token de administrador inválido");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAction = async (action: 'add' | 'update' | 'delete', licenseData: License) => {
        try {
            const res = await fetch(`/api/license/admin?token=${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, licenseData })
            });
            if (res.ok) {
                const data = await res.json();
                setLicenses(data.licenses);
                if (action === 'add' || action === 'update') {
                    setNewLicense({ key: '', expires_at: '', active: true, note: '' });
                    setIsEditing(false);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                            <Shield className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-white mb-2">Panel de Control</h1>
                    <p className="text-slate-400 text-center text-sm mb-8">Gestión de licencias - Acceso Restringido</p>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">USUARIO</label>
                            <input
                                type="text"
                                placeholder="Usuario..."
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                                value={token.split(':')[0] || ''}
                                onChange={(e) => setToken(e.target.value + ':' + (token.split(':')[1] || ''))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 ml-1">CONTRASEÑA</label>
                            <input
                                type="password"
                                placeholder="Contraseña..."
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                                value={token.split(':')[1] || ''}
                                onChange={(e) => setToken((token.split(':')[0] || '') + ':' + e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                const [u, p] = token.split(':');
                                if (u === 'nenegro' && p === 'Eider1993.1') {
                                    fetchLicenses('nexus-master-key');
                                    setToken('nexus-master-key');
                                } else {
                                    alert("Credenciales incorrectas");
                                }
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                        >
                            Acceder al Sistema
                        </button>
                        <p className="text-[10px] text-slate-600 text-center mt-4 italic">
                            Email de recuperación: eiderflw@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-slate-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Key className="text-blue-500" /> Gestión de Licencias
                        </h1>
                        <p className="text-slate-500">Administra el acceso de tus clientes al Nexus Dashboard</p>
                    </div>
                    <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-xs text-blue-400 font-mono">
                        ADMIN_TOKEN: ACTIVO
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Nueva Licencia */}
                    <div className="lg:col-span-1 border border-slate-800 bg-slate-900 rounded-xl p-6 h-fit sticky top-6">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {isEditing ? <Pencil className="w-5 h-5 text-yellow-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                                {isEditing ? 'Editar Licencia' : 'Crear Licencia'}
                            </span>
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setNewLicense({ key: '', expires_at: '', active: true, note: '' });
                                    }}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">CÓDIGO DE LLAVE</label>
                                <input
                                    type="text"
                                    placeholder="EJ: NEXUS-FREE-2026"
                                    className={`w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    value={newLicense.key}
                                    onChange={(e) => !isEditing && setNewLicense({ ...newLicense, key: e.target.value })}
                                    readOnly={isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">FECHA DE VENCIMIENTO</label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white"
                                    value={newLicense.expires_at}
                                    onChange={(e) => setNewLicense({ ...newLicense, expires_at: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">USUARIO / NOTA</label>
                                <input
                                    type="text"
                                    placeholder="Nombre del cliente..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm"
                                    value={newLicense.note}
                                    onChange={(e) => setNewLicense({ ...newLicense, note: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={() => handleAction(isEditing ? 'update' : 'add', newLicense)}
                                className={`w-full font-bold py-2 rounded transition-colors text-sm ${isEditing ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                            >
                                {isEditing ? 'Actualizar Licencia' : 'Generar Licencia'}
                            </button>
                        </div>
                    </div>

                    {/* Tabla de Licencias */}
                    <div className="lg:col-span-2 space-y-4">
                        {licenses.map((lic) => (
                            <div key={lic.key} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg border ${lic.active ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                        <Key className={`w-6 h-6 ${lic.active ? 'text-blue-500' : 'text-red-500'}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white uppercase tracking-wider">{lic.key}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${lic.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                {lic.active ? 'Activo' : 'Baneado'}
                                            </span>
                                            {lic.active && lic.last_seen && mounted && (
                                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${new Date().getTime() - new Date(lic.last_seen).getTime() < 5 * 60 * 1000 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${new Date().getTime() - new Date(lic.last_seen).getTime() < 5 * 60 * 1000 ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
                                                    {new Date().getTime() - new Date(lic.last_seen).getTime() < 5 * 60 * 1000 ? 'ON' : 'OFF'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {lic.note || 'Sin nota'}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Expiración: {lic.expires_at.replace('T', ' ')}</span>
                                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-[9px] ${lic.hwid ? 'text-blue-400 border border-blue-500/20' : 'text-slate-600 border border-slate-800'}`}>
                                                HWID: {lic.hwid ? lic.hwid.substring(0, 12) + '...' : 'LIBRE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setNewLicense({
                                                ...lic,
                                                expires_at: formatForInput(lic.expires_at)
                                            });
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="p-2 rounded hover:bg-slate-800 text-blue-400 transition-colors"
                                        title="Editar detalles"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleAction('update', { ...lic, active: !lic.active, reason: !lic.active ? '' : 'Licencia suspendida por Admin' })}
                                        className={`p-2 rounded hover:bg-slate-800 transition-colors ${lic.active ? 'text-orange-500' : 'text-green-500'}`}
                                        title={lic.active ? 'Suspender (Kill-Switch)' : 'Activar'}
                                    >
                                        <Power className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("¿Resetear el candado de hardware (HWID)? El usuario podrá usar la llave en otra PC.")) {
                                                handleAction('update', { ...lic, hwid: '' });
                                            }
                                        }}
                                        className={`p-2 rounded hover:bg-slate-800 transition-colors ${lic.hwid ? 'text-purple-400' : 'text-slate-600 opacity-30'}`}
                                        title="Resetear HWID (Desvincular PC)"
                                        disabled={!lic.hwid}
                                    >
                                        <Shield className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const reason = prompt("Razón del bloqueo:", lic.reason || "");
                                            if (reason !== null) handleAction('update', { ...lic, active: false, reason });
                                        }}
                                        className="p-2 rounded hover:bg-slate-800 text-yellow-500 transition-colors"
                                        title="Editar Razón"
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => confirm("¿Eliminar esta licencia?") && handleAction('delete', lic)}
                                        className="p-2 rounded hover:bg-slate-800 text-red-500 transition-colors"
                                        title="Eliminar permanentemente"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {licenses.length === 0 && (
                            <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                                <Key className="w-12 h-12 text-slate-700 mx-auto mb-2 opacity-50" />
                                <p className="text-slate-600">No hay licencias emitidas todavía.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
