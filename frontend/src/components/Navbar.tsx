'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Función para generar el link con la barra '/' al inicio para que funcione desde cualquier página
    const getLink = (item: string) => {
        const slug = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return item === 'Inicio' ? '/' : `/#${slug}`;
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <Link href="/" className="relative h-12 w-12 block">
                            <Image
                                src="/IsnhLogo.png"
                                alt="IESNH Logo"
                                fill
                                className="object-contain"
                            />
                        </Link>
                        <div className="hidden md:flex flex-col">
                            <span className="text-iesnh-blue font-bold text-xl leading-none">IESNH</span>
                            <span className="text-gray-500 text-xs font-medium">Nuevo Horizonte</span>
                        </div>
                    </div>

                    {/* MENÚ DE ESCRITORIO */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {['Inicio', 'Carreras', 'Institución', 'Contacto', 'NHDocs'].map((item) => (
                            <Link
                                key={item}
                                href={getLink(item)}
                                className="text-gray-600 hover:text-iesnh-cyan font-medium transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                        
                       










                      
                        
                      
                    </div>

                    {/* BOTÓN MÓVIL */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-iesnh-blue">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MENÚ MÓVIL DESPLEGABLE */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Inicio', 'Carreras', 'Institución', 'Contacto'].map((item) => (
                            <Link
                                key={item}
                                href={getLink(item)}
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-iesnh-cyan hover:bg-gray-50 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        
                        {/* ENLACE NHDOCS MÓVIL */}
                        <Link
                            href="/nhdocs"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-iesnh-cyan hover:bg-gray-50 rounded-md"
                            onClick={() => setIsOpen(false)}
                        >
                            NHDocs
                        </Link>

                        <Link
                            href="/login"
                            className="block px-3 py-2 text-base font-bold text-iesnh-blue hover:bg-gray-50 rounded-md"
                            onClick={() => setIsOpen(false)}
                        >
                            Campus Virtual
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
