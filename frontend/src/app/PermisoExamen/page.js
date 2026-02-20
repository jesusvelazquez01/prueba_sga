"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import {
  CheckCircle,
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Loader2,
  CreditCard,
  Download,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

// Componente principal con Suspense por el uso de useSearchParams
export default function FichaPermisoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-sky-600" /></div>}>
      <FichaPermisoWizard />
    </Suspense>
  );
}

function FichaPermisoWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados de flujo y pasos
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fichaId, setFichaId] = useState(null);
  const [paymentLink, setPaymentLink] = useState("");

  // Estados de datos
  const [carreras, setCarreras] = useState([]);
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    carrera_id: "",
    apellido: "",
    nombres: "",
    dni: "",
    telefono: "",
    fecha: getTodayDate(),
  });

  const [materias, setMaterias] = useState([
    { num_materia: "", nombre: "", anio: "", condicion: "REGULAR", fecha_examen: "" },
  ]);

  // Detectar retorno de Mercado Pago
  useEffect(() => {
    const currentStep = searchParams.get("step");
    const id = searchParams.get("ficha_id");

    if (currentStep === "3" && id) {
      setFichaId(id);
      setStep(3);
    }
  }, [searchParams]);

  useEffect(() => {
    api.get("/carreras")
      .then((res) => setCarreras(res.data))
      .catch((err) => console.error("Error cargando carreras:", err));
  }, []);

  const handleMateriaChange = (index, field, value) => {
    const nuevasMaterias = [...materias];
    nuevasMaterias[index][field] = value;
    setMaterias(nuevasMaterias);
  };

  // PASO 1: Envío de datos iniciales
  const handleSubmitDatos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/fichas-permiso", {
        ...formData,
        materias,
      });

      setFichaId(response.data.ficha_id);
      setPaymentLink(response.data.init_point);
      setStep(2);
    } catch (err) {
      setError("Error al procesar los datos. Verifique los campos e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // PASO 3: Funciones de descarga
  const downloadFile = async (endpoint, filename) => {
    setLoading(true);
    try {
      const response = await api.get(endpoint, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("No se pudo descargar el archivo. Es posible que el pago aún se esté procesando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-stone-50 to-slate-100 text-slate-800 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* WIZARD PROGRESS BAR */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold transition-colors duration-500 ${step >= 1 ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <div className={`flex-1 h-1 transition-colors duration-500 ${step >= 2 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold transition-colors duration-500 ${step >= 2 ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <div className={`flex-1 h-1 transition-colors duration-500 ${step >= 3 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold transition-colors duration-500 ${step >= 3 ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>3</div>
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto mt-3 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            <span className={step >= 1 ? "text-sky-700" : ""}>Datos</span>
            <span className={step >= 2 ? "text-sky-700" : ""}>Pago</span>
            <span className={step >= 3 ? "text-sky-700" : ""}>Descarga</span>
          </div>
        </div>

        {/* STEP 1: FORMULARIO */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-start mb-6">
              <button onClick={() => router.push("/")} className="group inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Volver al inicio
              </button>
            </div>

            <form onSubmit={handleSubmitDatos} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <div className="p-2 bg-sky-100 rounded-lg"><FileText className="text-sky-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Paso 1: Inscripción</h3>
                  <p className="text-sm text-slate-500">Ingresa tus datos académicos y personales.</p>
                </div>
              </div>

              {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Carrera / Tecnicatura</label>
                  <select required value={formData.carrera_id} onChange={(e) => setFormData({ ...formData, carrera_id: e.target.value })} className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all">
                    <option value="">Selecciona tu carrera</option>
                    {carreras.map((c) => (<option key={c.id} value={c.id}>{c.nombre || c.title}</option>))}
                  </select>
                </div>
                <input placeholder="Apellido" required className="border border-slate-200 bg-slate-50 p-4 rounded-2xl focus:ring-4 focus:ring-sky-100" onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} />
                <input placeholder="Nombres" required className="border border-slate-200 bg-slate-50 p-4 rounded-2xl focus:ring-4 focus:ring-sky-100" onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} />
                <input placeholder="DNI" required className="border border-slate-200 bg-slate-50 p-4 rounded-2xl focus:ring-4 focus:ring-sky-100" onChange={(e) => setFormData({ ...formData, dni: e.target.value })} />
                <input placeholder="Teléfono" required className="border border-slate-200 bg-slate-50 p-4 rounded-2xl focus:ring-4 focus:ring-sky-100" onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider">Materias a Inscribirse</h4>
                {materias.map((materia, index) => (
                  <div key={index} className="p-6 border border-slate-100 bg-slate-50/30 rounded-3xl space-y-4 relative">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-sky-600 text-white text-[10px] font-black rounded-full uppercase">Materia {index + 1}</span>
                      {materias.length > 1 && (
                        <button type="button" onClick={() => setMaterias(materias.filter((_, i) => i !== index))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input placeholder="N°" className="border border-slate-200 p-3 rounded-xl bg-white" value={materia.num_materia} onChange={(e) => handleMateriaChange(index, "num_materia", e.target.value)} />
                      <input placeholder="Nombre de materia" className="border border-slate-200 p-3 rounded-xl bg-white md:col-span-2" value={materia.nombre} onChange={(e) => handleMateriaChange(index, "nombre", e.target.value)} />
                      <input type="number" placeholder="Año" className="border border-slate-200 p-3 rounded-xl bg-white" value={materia.anio} onChange={(e) => handleMateriaChange(index, "anio", e.target.value)} />
                      <select className="border border-slate-200 p-3 rounded-xl bg-white" value={materia.condicion} onChange={(e) => handleMateriaChange(index, "condicion", e.target.value)}>
                        <option value="REGULAR">Regular</option>
                        <option value="LIBRE">Libre</option>
                      </select>
                      <input type="date" className="border border-slate-200 p-3 rounded-xl bg-white" value={materia.fecha_examen} onChange={(e) => handleMateriaChange(index, "fecha_examen", e.target.value)} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setMaterias([...materias, { num_materia: "", nombre: "", anio: "", condicion: "REGULAR", fecha_examen: "" }])} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> Añadir Materia
                </button>
              </div>

              <button type="submit" disabled={loading} className="w-full font-bold py-5 rounded-2xl shadow-xl bg-sky-600 hover:bg-sky-700 text-white transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" /> : "CONTINUAR AL PAGO"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: PAGO */}
        {step === 2 && (
          <div className="max-w-xl mx-auto bg-white p-12 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-50 text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CreditCard size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Paso 2: Arancel</h2>
              <p className="text-slate-500 font-medium">Para oficializar la inscripción, abona el derecho de examen.</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 p-6 rounded-3xl space-y-1">
              <span className="text-xs font-black text-sky-600 uppercase tracking-widest">Total a pagar</span>
              <p className="text-4xl font-black text-sky-900">$2.500,00</p>
            </div>
            <a href={paymentLink} className="flex items-center justify-center gap-3 w-full bg-[#009EE3] hover:bg-[#0086C3] text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-200 text-xl tracking-wide uppercase">
              PAGAR AHORA <ExternalLink size={20} />
            </a>
            <button onClick={() => setStep(1)} className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors italic uppercase tracking-tighter">← Modificar datos previos</button>
          </div>
        )}

        {/* STEP 3: DESCARGA */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-[40px] shadow-2xl shadow-green-100 border border-green-50 text-center space-y-10 animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck size={54} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">¡INSCRIPCIÓN EXITOSA!</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Tu pago ha sido procesado. Descarga la ficha para presentar ante el preceptor y guarda tu comprobante.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              <button
                onClick={() => downloadFile(`/fichas-permiso/${fichaId}/pdf`, `FichaExamen_${fichaId}.pdf`)}
                disabled={loading}
                className="group flex flex-col items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white p-8 rounded-[32px] transition-all hover:-translate-y-2 shadow-xl shadow-slate-200"
              >
                <Download size={32} className="group-hover:bounce" />
                <span className="font-black text-xs uppercase tracking-widest">Descargar Ficha</span>
              </button>

              <button
                onClick={() => downloadFile(`/fichas-permiso/${fichaId}/comprobante`, `ReciboPago_${fichaId}.pdf`)}
                disabled={loading}
                className="group flex flex-col items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-800 p-8 rounded-[32px] transition-all hover:-translate-y-2 hover:border-sky-200 hover:bg-sky-50/30"
              >
                <FileText size={32} className="text-sky-600" />
                <span className="font-black text-xs uppercase tracking-widest">Recibo de Pago</span>
              </button>
            </div>

            <div className="pt-8 border-t border-slate-50 flex flex-col gap-4">
              <button onClick={() => router.push("/")} className="text-slate-400 font-bold hover:text-sky-600 transition-colors uppercase text-xs tracking-widest">Finalizar Proceso</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}