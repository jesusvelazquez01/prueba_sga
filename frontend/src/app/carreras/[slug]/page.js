'use client';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/axios';
import { Loader2, ArrowLeft, Download, Calendar, BookOpen, FileText, X, Check } from 'lucide-react';

const InternalContactModal = ({ isOpen, onClose, careerId, careerName }) => {
    const [formData, setFormData] = useState({ nombre_completo: '', email: '', telefono: '', mensaje: '',localidad: '' });
    const [status, setStatus] = useState('idle');

    if (!isOpen) return null;
    
   const handleSubmit = async (e) => {
        e.preventDefault();

      

        setStatus('loading');

        let telefonoLimpio = formData.telefono.replace(/[^0-9]/g, '');

        if (!telefonoLimpio.startsWith('54')) {
            telefonoLimpio = '549' + telefonoLimpio;
        }

        try {
            await api.post('/postulantes', {
                ...formData,
                telefono: telefonoLimpio,
                carrera_id: careerId
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ nombre_completo: '', email: '', telefono: '', mensaje: '', localidad: '' });
            }, 2000);
            console.log('Datos enviados:', { ...formData, telefono: telefonoLimpio, carrera_id: careerId });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-iesnh-blue mb-1">Solicitar Información</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Te asesoramos sobre: <span className="font-bold text-iesnh-cyan">{careerName}</span>
                </p>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                            <Check className="text-green-600" size={32} />
                        </div>
                        <p className="font-bold text-gray-800">¡Datos enviados correctamente!</p>
                        <p className="text-sm text-gray-500 mt-2">Un asesor te contactará pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text" required placeholder="Nombre Completo"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition"
                            value={formData.nombre_completo} onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                        />
                        <input
                            type="email" required placeholder="Email"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            type="tel" required placeholder="Teléfono / WhatsApp"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition"
                            value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                        />
                         <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition"
                            value={formData.localidad} onChange={e => setFormData({ ...formData, localidad: e.target.value })}>
                        <option value="">Selecciona tu localidad</option>
                            <option value="San Salvador de Jujuy">San Salvador de Jujuy</option>
                            <option value="Palpalá">Palpalá</option>
                            <option value="Perico">Perico</option>
                            <option value ="San pedro">San pedro</option>
                            <option value="Libertador Gral. San Martín">Libertador Gral. San Martín</option>
                            <option value="Humahuaca">Humahuaca</option>
                            <option value="Tilcara">Tilcara</option>
                            <option value="Maimará">Maimará</option>
                            <option value="Susques">Susques</option>
                            <option value="Abra Pampa">Abra Pampa</option>
                            <option value="La Quiaca">La Quiaca</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <textarea
                            placeholder="¿Alguna duda específica?" rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition resize-none"
                            value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                        />

                        <button
                            type="submit" disabled={status === 'loading'}
                            className="w-full bg-iesnh-cyan hover:bg-[#209dc9] text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> Enviando...</> : 'ENVIAR SOLICITUD'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};


export default function DetalleCarrera({ params }) {
    const resolvedParams = use(params);
    const { slug } = resolvedParams;

    const [carrera, setCarrera] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!slug) return;

        api.get(`/carreras/${slug}`)
            .then(res => {
                setCarrera(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-iesnh-cyan" />
        </div>
    );

    if (!carrera) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Carrera no encontrada</h1>
            <Link href="/" className="text-iesnh-blue hover:underline flex items-center gap-2">
                <ArrowLeft size={20} /> Volver al inicio
            </Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-white pb-20 font-sans">

            <div className="relative h-[400px] w-full bg-gray-900">
                <Image
                    src={carrera.image || '/placeholder.jpg'}
                    alt={carrera.title}
                    fill
                    className="object-cover opacity-60"
                    unoptimized
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-iesnh-blue/90 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 max-w-7xl mx-auto">
                    <Link href="/#carreras" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition text-sm font-bold uppercase tracking-wider">
                        <ArrowLeft size={16} className="mr-2" /> Volver a Carreras
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                        {carrera.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-white/90 text-sm font-medium">
                        {carrera.duracion && (
                            <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                <Calendar size={16} /> {carrera.duracion}
                            </span>
                        )}
                        {carrera.modalidad && (
                            <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                <BookOpen size={16} /> {carrera.modalidad}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-iesnh-blue mb-6 border-b pb-2">Perfil Profesional</h2>
                        <div
                            className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: carrera.content }}
                        />
                    </div>

                    <div className="lg:col-span-1 space-y-6">

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="text-iesnh-cyan" /> Documentación
                            </h3>
                            <div className="space-y-3">
                                {carrera.plan_estudio ? (
                                    <a href={carrera.plan_estudio} target="_blank" className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-iesnh-cyan hover:text-iesnh-blue transition group cursor-pointer">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-iesnh-blue">Descargar Plan de Estudio</span>
                                        <Download size={18} className="text-gray-400 group-hover:text-iesnh-cyan" />
                                    </a>
                                ) : (
                                    <p className="text-sm text-gray-400 italic text-center py-2">Plan de estudio no disponible.</p>
                                )}

                                {carrera.resolucion && (
                                    <a href={carrera.resolucion} target="_blank" className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-iesnh-cyan hover:text-iesnh-blue transition group cursor-pointer">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-iesnh-blue">Resolución Ministerial</span>
                                        <Download size={18} className="text-gray-400 group-hover:text-iesnh-cyan" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="bg-iesnh-blue rounded-xl p-6 text-white text-center shadow-lg">
                            <h3 className="font-bold text-xl mb-2">¿Te interesa esta carrera?</h3>
                            <p className="text-iesnh-light text-sm mb-6">
                                Solicita asesoramiento personalizado ahora mismo.
                            </p>

                            <button
                                onClick={() => setModalOpen(true)}
                                className="block w-full bg-iesnh-cyan py-3 rounded-lg font-bold text-white hover:bg-white hover:text-iesnh-blue transition shadow-md hover:shadow-lg transform active:scale-95"
                            >
                                SOLICITAR INFORMACIÓN
                            </button>
                        </div>

                    </div>

                </div>
            </div>

            <InternalContactModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                careerId={carrera.id}
                careerName={carrera.title}
            />

        </main>
    );
}