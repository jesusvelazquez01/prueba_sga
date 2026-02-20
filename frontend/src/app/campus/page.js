'use client';
import Link from 'next/link';
import { Hammer, ArrowLeft, HardHat, Construction } from 'lucide-react';

export default function CampusUnderConstruction() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center font-sans">

            {/* Icono Animado */}
            <div className="relative mb-8">
                <div className="absolute -inset-4 bg-iesnh-cyan/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-full shadow-lg border-2 border-iesnh-light">
                    <Construction className="w-16 h-16 text-iesnh-cyan" />
                </div>
            </div>

            {/* Título y Mensaje */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-iesnh-blue mb-4 tracking-tight">
                Campus Virtual <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-iesnh-cyan to-blue-600">
                    En Construcción
                </span>
            </h1>

            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
                Estamos trabajando arduamente en el código para brindarte la mejor experiencia educativa digital.
                <br /><br />
                <span className="font-medium text-iesnh-blue">¡Pronto podrás acceder a tus clases y materiales!</span>
            </p>

            {/* Botón de Retorno */}
            <Link
                href="/"
                className="group flex items-center gap-2 bg-iesnh-blue text-white px-8 py-3 rounded-full font-bold hover:bg-iesnh-cyan transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver al Inicio
            </Link>

            {/* Footer simple */}
            <div className="mt-16 text-sm text-gray-400">
                <p>Departamento de Sistemas &copy; {new Date().getFullYear()} IESNH</p>
                <p>Artinnex Code Artisans</p>

            </div>
        </div>
    );
}