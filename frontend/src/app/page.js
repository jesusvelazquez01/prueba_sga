'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/lib/axios';
import { Menu, X, Check, Loader2, MapPin, Phone, Facebook, Instagram, Twitter, Monitor, Dumbbell, Trophy, Utensils } from 'lucide-react';

// --- COMPONENTES INTERNOS (Navbar y Modal integrados) ---

const Navbar = ({ onOpenModal }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-iesnh-blue">
                            {/* Asegúrate de que IsnhLogo.jpg esté en la carpeta public/ */}
                            <Image
                                src="/IsnhLogo.png"
                                alt="IESNH"
                                width={48}
                                height={48}
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-iesnh-blue text-xl font-extrabold tracking-tight">IESNH</span>
                            <span className="text-gray-500 text-xs font-bold uppercase">Nuevo Horizonte</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {['Inicio', 'Carreras', 'Institucion', 'Contacto'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-gray-600 hover:text-iesnh-cyan px-3 py-2 rounded-md text-sm font-bold uppercase transition"
                                >
                                    {item}
                                </a>
                            ))}
                            <a
                                href="/nhdocs"
                                className="text-gray-600 hover:text-iesnh-cyan px-3 py-2 rounded-md text-sm font-bold uppercase transition"
                            >
                                NHDocs
                            </a>
                            <a
                                href="/PermisoExamen"
                                className="text-gray-600 hover:text-iesnh-cyan px-3 py-2 rounded-md text-sm font-bold uppercase transition"
                            >
                                PERMISO EXAMEN
                            </a>

                        </div>
                    </div>

                    <div className="hidden md:block">
                        <a href="/campus" className="bg-iesnh-blue hover:bg-[#09354d] text-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-wide transition shadow-lg">
                            Campus Virtual
                        </a>
                    </div>

                    {/* Mobile Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Inicio', 'Carreras', 'Institucion', 'Contacto'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-gray-800 block px-3 py-2 text-base font-bold uppercase"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <a
                            href="/PermisoExamen"
                            className="text-gray-800 block px-3 py-2 text-base font-bold uppercase"
                            onClick={() => setIsOpen(false)}
                        >
                            PERMISO EXAMEN
                        </a>
                        <a href="/campus" className="text-iesnh-cyan block px-3 py-2 text-base font-bold uppercase">Campus Virtual</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

const ContactModal = ({ isOpen, onClose, careerId, careerName }) => {
    const [formData, setFormData] = useState({ nombre_completo: '', email: '', telefono: '', mensaje: '', localidad: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

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
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ nombre_completo: '', email: '', localidad: '', telefono: '', mensaje: '' });
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>

                <h2 className="text-2xl font-bold text-iesnh-blue mb-1">Solicitar Información</h2>
                <p className="text-sm text-gray-500 mb-6">Te asesoramos sobre: <span className="font-bold text-iesnh-cyan">{careerName}</span></p>

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
                        <input type="text" required placeholder="Nombre Completo" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition"
                            value={formData.nombre_completo} onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })} />

                        <input type="email" required placeholder="Email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                        <input type="tel" required placeholder="Teléfono / WhatsApp" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition"
                            value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
                        
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

                        <textarea placeholder="¿Alguna duda específica?" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-iesnh-cyan focus:ring-1 focus:ring-iesnh-cyan transition resize-none"
                            value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} />

                        {status === 'error' && <p className="text-red-500 text-sm text-center">Hubo un error al enviar. Intenta nuevamente.</p>}

                        <button type="submit" disabled={status === 'loading'} className="w-full bg-iesnh-cyan hover:bg-[#209dc9] text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2">
                            {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> Enviando...</> : 'ENVIAR SOLICITUD'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL ---

export default function LandingPage() {
    const [carreras, setCarreras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState({ id: null, title: '' });

    // Cargar carreras desde Laravel
    useEffect(() => {
        api.get('/carreras')
            .then(res => {
                setCarreras(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando carreras:", err);
                setLoading(false);
            });
    }, []);

    const openModal = (career) => {
        setSelectedCareer({ id: career?.id || null, title: career?.title || 'Asesoría General' });
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-iesnh-cyan selection:text-white">
            <Navbar onOpenModal={() => openModal(null)} />

            {/* HERO SECTION */}
            <section id="inicio" className="relative h-[600px] flex items-center justify-center bg-iesnh-blue overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Imagen de fondo */}
                    <Image
                        src="/herosection.webp"
                        alt="Campus IESNH"
                        fill
                        className="object-cover opacity-40 brightness-75"
                        priority
                    />
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-iesnh-blue/90 via-transparent to-iesnh-blue/30" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mt-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-iesnh-cyan/20 border border-iesnh-cyan/50 text-iesnh-light text-sm font-bold tracking-wider uppercase backdrop-blur-sm mb-6">
                        Inscripciones Abiertas 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Tu Futuro Profesional en <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-iesnh-cyan to-white">Nuevo Horizonte</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
                        Formación superior de excelencia académica y valores humanos. Encuentra tu vocación hoy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => openModal(null)} className="bg-iesnh-cyan hover:bg-white hover:text-iesnh-blue text-white font-bold py-3 px-8 rounded-full transition transform hover:-translate-y-1 shadow-xl">
                            SOLICITAR INFORMACIÓN
                        </button>
                        <a href="#carreras" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-iesnh-blue transition">
                            VER CARRERAS
                        </a>
                    </div>
                </div>
            </section>

            {/* CARRERAS (Grid) */}
            <section id="carreras" className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-iesnh-blue uppercase tracking-tight">Nuestra Oferta Académica</h2>
                    <div className="h-1.5 w-24 bg-iesnh-cyan mx-auto mt-4 rounded-full"></div>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">Tecnicaturas y profesorados diseñados para el mercado laboral actual.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 className="animate-spin text-iesnh-cyan mb-2" size={40} />
                        <p>Cargando oferta académica...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {carreras.map((carrera) => (
                            <div key={carrera.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col h-full">
                                <div className="relative h-52 w-full bg-gray-200 overflow-hidden">
                                    <Image
                                        src={carrera.image}

                                        alt={carrera.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-700"

                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                                    <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white leading-tight">
                                        {carrera.title}
                                    </h3>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{carrera.description}</p>

                                    <div className="flex gap-3 mt-auto">
                                        <a href={`/carreras/${carrera.slug}`} className="flex-1 text-center border border-iesnh-blue text-iesnh-blue font-bold py-2 rounded-lg hover:bg-iesnh-blue hover:text-white transition text-sm">
                                            VER PLAN
                                        </a>
                                        <button onClick={() => openModal(carrera)} className="flex-1 bg-iesnh-cyan text-white font-bold py-2 rounded-lg hover:bg-[#209dc9] transition text-sm">
                                            ME INTERESA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* INSTITUCION */}
            <section id="institucion" className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-iesnh-blue mb-6">Infraestructura de <span className="text-iesnh-cyan">Primer Nivel</span></h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Creemos que el aprendizaje requiere del entorno adecuado. Contamos con espacios modernos diseñados para potenciar tus habilidades académicas, deportivas y tecnológicas.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { label: "Gimnasio Musculacion", icon: <Dumbbell className="text-iesnh-cyan" /> },
                                { label: "Sala Informática", icon: <Monitor className="text-iesnh-cyan" /> },
                                { label: "Comedor", icon: <Utensils className="text-iesnh-cyan" /> },
                                { label: "Campo Deportivo", icon: <Trophy className="text-iesnh-cyan" /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-iesnh-cyan/30 transition">
                                    <div className="bg-white p-3 rounded-full shadow-sm">{item.icon}</div>
                                    <span className="font-bold text-gray-700">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/instituto.jpg"
                            alt="instituto"
                            fill
                            className="object-cover brightness-75"
                            priority
                        />                        </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="contacto" className="bg-[#0b2e42] text-white py-16 border-t-4 border-iesnh-cyan">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative h-10 w-10 bg-white rounded-full p-1">
                                <Image src="/IsnhLogo.png" alt="Logo" width={40} height={40} className="object-cover rounded-full" />
                            </div>
                            <span className="text-2xl font-bold tracking-wide">IESNH</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Tu futuro empieza aquí en el Instituto de Educacion Superior Nuevo Horizonte líderes con excelencia académica y compromiso social en la provincia de Jujuy.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-iesnh-cyan">Contacto</h4>
                        <ul className="space-y-4 text-gray-300 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-iesnh-cyan mt-1" />
                                <span>Manuel Castellano 3323 Esquina Idelfonso María de la Paz B° 47 Hectáreas, Alto Comedero 4600 San Salvador de Jujuy, Argentina</span>
                            </li>
                            {/* Lista de Teléfonos Corporativos */}
                            <li className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-white font-semibold mb-1">
                                    <Phone size={18} className="text-iesnh-cyan shrink-0" />
                                    <span>Teléfonos Corporativos:</span>
                                </div>

                                {/* Lista detallada con enlaces a WhatsApp */}
                                <div className="pl-8 space-y-2">
                                    {[
                                        { name: "Consultas", number: "5493886825633", label: "+54 9 388 682-5633" },
                                        { name: "Consultas", number: "5493884640637", label: "+54 9 388 464-0637" },
                                        { name: "Consultas", number: "5493884640570", label: "+54 9 388 464-0570" },
                                        { name: "Consultas", number: "5493884640651", label: "+54 9 388 464-0651" },
                                    ].map((contact, idx) => (
                                        <a
                                            key={idx}
                                            href={`https://wa.me/${contact.number}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-gray-400 hover:text-iesnh-cyan transition-colors"
                                        >
                                            <span className="font-bold text-gray-200">{contact.name}:</span> {contact.label}
                                        </a>
                                    ))}
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Columna Redes Sociales */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-iesnh-cyan uppercase tracking-wide">
                            Redes Sociales
                        </h4>
                        <div className="flex gap-4">
                            {/* Botón Facebook */}
                            <a
                                href="https://www.facebook.com/InstitutoDeEducacionSuperiorNuevoHorizonte"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 p-3 rounded-full hover:bg-[#1877F2] hover:scale-110 transition-all duration-300 text-white shadow-lg"
                                aria-label="Visitar Facebook"
                            >
                                <Facebook size={24} />
                            </a>

                            {/* Botón Instagram */}
                            <a
                                href="https://www.instagram.com/iesnuevohorizonte/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 p-3 rounded-full hover:bg-[#E4405F] hover:scale-110 transition-all duration-300 text-white shadow-lg"
                                aria-label="Visitar Instagram"
                            >
                                <Instagram size={24} />
                            </a>
                        </div>

                        <p className="mt-6 text-gray-400 text-sm">
                            Síguenos para enterarte de las últimas novedades académicas y eventos.
                        </p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Instituto de Educación Superior Nuevo Horizonte. Todos los derechos reservados.</p>
                </div>
            </footer>

            <ContactModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                careerId={selectedCareer.id}
                careerName={selectedCareer.title}
            />
        </div>
    );
}