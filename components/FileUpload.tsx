'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { parseExcel } from '@/lib/excel-parser';
import { useCreatorStore } from '@/store/useCreatorStore';

export default function FileUpload() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { setCreators } = useCreatorStore();

    const handleFile = async (file: File) => {
        setError(null);
        setSuccess(false);
        setIsProcessing(true);

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            alert('Solo se permiten archivos Excel (.xlsx, .xls)');
            setIsProcessing(false);
            return;
        }

        try {
            // Emulate progress
            await new Promise(r => setTimeout(r, 500));

            const creators = await parseExcel(file, () => { });

            // Auto-save to History
            try {
                await fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ creators })
                });
            } catch (histErr) {
                console.error('Failed to save history:', histErr);
            }

            setSuccess(true);

            // Delay navigation/update
            setTimeout(() => {
                setCreators(creators);
                setSuccess(false); // Reset state
            }, 1000);
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Error al procesar el archivo.');
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <button
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isProcessing}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border
                    ${success
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : error
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }
                `}
            >
                {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : success ? (
                    <CheckCircle className="w-4 h-4" />
                ) : error ? (
                    <AlertCircle className="w-4 h-4" />
                ) : (
                    <Upload className="w-4 h-4" />
                )}

                {isProcessing ? 'Procesando...' : success ? '¡Carga Exitosa!' : 'Cargar Reporte'}
            </button>
        </div>
    );
}
