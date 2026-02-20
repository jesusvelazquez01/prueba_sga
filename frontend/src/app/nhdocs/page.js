'use client';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { ArrowLeft, Loader2, QrCode, Barcode as BarcodeIcon, FileText, Search, MapPin, User, Calendar, ArrowRight, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

export default function NHDocsPage() {
    const [codigo, setCodigo] = useState('');
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [urlBase, setUrlBase] = useState('');

    // --- NUEVO: Leer URL y Auto-Buscar si viene de un QR ---
    useEffect(() => {
        // Guardamos la URL base para generar el QR correcto
        setUrlBase(window.location.origin);

        // Leemos si la URL trae "?codigo=0001_REC_26"
        const params = new URLSearchParams(window.location.search);
        const codigoUrl = params.get('codigo');
        
        if (codigoUrl) {
            setCodigo(codigoUrl);
            realizarBusqueda(codigoUrl);
        }
    }, []);

    const realizarBusqueda = async (codigoBuscado) => {
        if (!codigoBuscado.trim()) return;
        setLoading(true);
        setError('');
        setResultado(null);

        try {
            const response = await axios.get(`/expediente/${codigoBuscado}`);
            setResultado(response.data);
        } catch (err) {
            console.error(err);
            setError('No se han encontrado registros para el código ingresado. Por favor, verifique la información e intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        realizarBusqueda(codigo);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#1F4E78] transition font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md">
                    <ArrowLeft size={18} />
                    <span className="hidden sm:inline">Volver al Portal Principal</span>
                </Link>
            </div>

            <div className="max-w-5xl w-full space-y-8 mt-12 sm:mt-8">
                
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-[#1F4E78] rounded-full mb-2 shadow-md">
                        <Search className="text-white h-8 w-8" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F4E78] tracking-tight">
                        Mesa de Entradas Virtual
                    </h2>
                    <p className="text-base text-gray-600 font-medium uppercase tracking-wide">
                        Consulta Pública de Expedientes y Trámites
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 shadow-md rounded-2xl border border-gray-200">
                    <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto relative z-10">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                required
                                autoComplete="off"
                                style={{ color: '#000000', opacity: 1 }}
                                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-[#1F4E78] text-gray-900 bg-gray-50 font-bold text-lg transition-colors placeholder:font-normal placeholder:text-gray-400 uppercase"
                                placeholder="Ingrese el Número de Expediente (Ej: 0001_REC_26)"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                            />
                            <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-[#1F4E78] hover:bg-[#153654] focus:outline-none transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'CONSULTAR'}
                        </button>
                    </form>
                    
                    {error && (
                        <div className="mt-6 bg-red-50 text-red-800 p-4 rounded-xl text-center border border-red-200 font-medium animate-in fade-in">
                            {error}
                        </div>
                    )}
                </div>

                {/* RESULTADOS - DISEÑO NUEVO (QR, BARRAS, TABLA) */}
                {resultado && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        
                        {/* 1. SECCIÓN DE TARJETAS (QR, BARRAS, FOJAS) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* CÓDIGO QR - AHORA GUARDA EL LINK DIRECTO */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between overflow-hidden">
                                <div className="bg-[#1F4E78] p-4 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <QrCode className="text-white h-8 w-8" />
                                </div>
                                <div className="flex flex-col items-end justify-center flex-1 ml-4">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">VALIDACIÓN QR</span>
                                    <div className="bg-white p-1 border border-gray-200 rounded-lg">
                                        {/* El QR ahora contiene: https://tusitio.com/nhdocs?codigo=0001_REC_26 */}
                                        <QRCodeSVG value={`${urlBase}/nhdocs?codigo=${resultado.codigo}`} size={64} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between overflow-hidden">
                                <div className="bg-[#1F4E78] p-4 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <BarcodeIcon className="text-white h-8 w-8" />
                                </div>
                                <div className="flex flex-col items-end justify-center flex-1 overflow-hidden ml-4">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">CÓDIGO DE BARRAS</span>
                                    <div className="w-full flex justify-end">
                                        <div className="scale-75 origin-right">
                                            <Barcode 
                                                value={resultado.codigo} 
                                                width={1.5} 
                                                height={40} 
                                                displayValue={false} 
                                                margin={0}
                                                background="transparent"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm text-[#1F4E78] font-mono mt-1 font-bold">{resultado.codigo}</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                                <div className="bg-gray-700 p-4 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                    <FileText className="text-white h-8 w-8" />
                                </div>
                                <div className="flex flex-col items-end justify-center flex-1 ml-4">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">DOCUMENTACIÓN (FOJAS)</span>
                                    <span className="text-5xl font-black text-gray-800">{resultado.cantidad_fojas}</span>
                                </div>
                            </div>
                        </div>

                        {/* INFORMACIÓN DEL EXPEDIENTE Y BOTÓN DE PDF */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1F4E78]"></div>
                            
                            <div className="border-b border-gray-200 pb-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">ASUNTO DEL TRÁMITE</h3>
                                    <p className="text-2xl font-bold text-gray-900 leading-tight">{resultado.asunto}</p>
                                </div>
                                
                                {/* --- NUEVO: BOTÓN VER DOCUMENTO ESCANEADO --- */}
                                {resultado.archivo_digital_url && (
                                    <a 
                                        href={resultado.archivo_digital_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#00B0F0] hover:bg-[#0090C0] text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                                    >
                                        <Download size={18} />
                                        Ver Documento
                                    </a>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200"><User size={20} className="text-gray-600" /></div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Titular / Iniciador</p>
                                        <p className="font-bold text-gray-900 text-base">{resultado.iniciado_por}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200"><Calendar size={20} className="text-gray-600" /></div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Fecha de Creación</p>
                                        <p className="font-bold text-gray-900 text-base">{resultado.fecha_inicio}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-200"><MapPin size={20} className="text-gray-600" /></div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Estado Administrativo</p>
                                        <p className="font-bold uppercase inline-flex px-3 py-1 mt-1 rounded-md bg-[#1F4E78] text-white tracking-wide text-xs">
                                            {resultado.estado}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HISTORIAL DE MOVIMIENTOS DETALLADO */}
                        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden mt-8">
                            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                                    <FileText className="text-[#1F4E78]" size={22} />
                                    Historial de Pases y Movimientos
                                </h3>
                                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider border border-gray-300">
                                    Auditoría de Trámite
                                </span>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-[#1F4E78] text-white uppercase text-xs tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold w-16 text-center">Fojas</th>
                                            <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                                            <th className="px-6 py-4 font-semibold text-center">Dependencia (Origen ➔ Destino)</th>
                                            <th className="px-6 py-4 font-semibold">Autorización (Firmas)</th>
                                            <th className="px-6 py-4 font-semibold">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {resultado.historial?.length > 0 ? (
                                            resultado.historial.map((mov, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-5 text-center align-top">
                                                        <span className="inline-block bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded border border-gray-200">
                                                            {mov.fojas || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 align-top">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900">{mov.fecha}</span>
                                                            <span className="text-xs text-gray-500 font-mono mt-1">{mov.hora}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 align-top">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <span className="font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-md border border-gray-300 shadow-sm text-xs uppercase tracking-wider">
                                                                {mov.origen}
                                                            </span>
                                                            <ArrowRight size={16} className="text-gray-400" />
                                                            <span className="font-bold text-[#1F4E78] bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200 shadow-sm text-xs uppercase tracking-wider">
                                                                {mov.destino}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 align-top">
                                                        <div className="flex flex-col gap-2 text-xs">
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-gray-500 font-bold uppercase w-16 text-[10px] tracking-widest mt-0.5">Entregó:</span>
                                                                <span className="text-gray-900 font-medium bg-gray-100 px-2 py-0.5 rounded">{mov.enviado_por}</span>
                                                            </div>
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-[#1F4E78] font-bold uppercase w-16 text-[10px] tracking-widest mt-0.5">Recibió:</span>
                                                                <span className="text-gray-900 font-medium bg-gray-100 px-2 py-0.5 rounded">{mov.recibido_por}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 align-top text-gray-700 text-xs leading-relaxed max-w-[250px]">
                                                        {mov.observaciones ? (
                                                            <p className="italic bg-gray-50 p-3 rounded-md border border-gray-200">
                                                                "{mov.observaciones}"
                                                            </p>
                                                        ) : (
                                                            <span className="text-gray-400 italic">- Sin observaciones registradas -</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-16">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <FileText size={40} className="mb-4 text-gray-300" />
                                                        <p className="text-lg font-medium text-gray-600">Sin movimientos administrativos registrados</p>
                                                        <p className="text-sm mt-1">El expediente se encuentra en su dependencia de origen.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {resultado.historial.length === 0 && (
                                <div className="p-8 text-center text-gray-500 bg-gray-50">
                                    El expediente se encuentra iniciado pero aún no tiene movimientos registrados.
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}