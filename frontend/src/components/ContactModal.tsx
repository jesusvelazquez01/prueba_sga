'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    careerId: number | null;
    careerName: string;
}

export default function ContactModal({ isOpen, onClose, careerId, careerName }: ContactModalProps) {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await api.post('/postulantes', {
                ...formData,
                carrera_id: careerId // Enviamos el ID de la carrera para la relación N:M
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ nombre_completo: '', email: '', telefono: '', mensaje: '' });
            }, 2500);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">

                {/* Header */}
                <div className="bg-iesnh-blue p-5 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Solicitar Información</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-10 space-y-3">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <h4 className="text-xl font-bold text-gray-800">¡Solicitud Enviada!</h4>
                            <p className="text-gray-600">Nos pondremos en contacto contigo pronto.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Déjanos tus datos para recibir asesoramiento sobre: <br />
                                <span className="font-bold text-iesnh-blue">{careerName}</span>
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-iesnh-cyan focus:border-transparent outline-none transition"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.nombre_completo}
                                    onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-iesnh-cyan outline-none"
                                        placeholder="juan@mail.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-iesnh-cyan outline-none"
                                        placeholder="388..."
                                        value={formData.telefono}
                                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Mensaje (Opcional)</label>
                                <textarea
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-iesnh-cyan outline-none resize-none"
                                    placeholder="¿Alguna consulta específica?"
                                    value={formData.mensaje}
                                    onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2 rounded">
                                    <AlertCircle size={16} /> Hubo un error. Intenta nuevamente.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-iesnh-cyan text-white font-bold py-3 rounded-lg hover:bg-[#25a0cc] transition flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {status === 'loading' && <Loader2 className="animate-spin" size={18} />}
                                {status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}