/*
 * ============================================================================
 * TALLER GOSPODINOFF — REDISEÑO WEB APPLE "LIQUID GLASS" + SEGURIDAD OWASP
 * ============================================================================
 * Cabeceras HTTP de Seguridad Recomendadas para Producción (Nginx / Apache /
 * Cloudflare / Vercel / Netlify) — Configurar en el servidor web o CDN:
 *
 *   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
 *   Content-Security-Policy: default-src 'self';
 *     script-src 'self';
 *     style-src 'self' 'unsafe-inline';
 *     img-src 'self' https://images.unsplash.com data:;
 *     font-src 'self' data:;
 *     connect-src 'self';
 *     frame-ancestors 'none';
 *     object-src 'none';
 *     base-uri 'self';
 *     form-action 'self' https://wa.me;
 *     upgrade-insecure-requests;
 *   X-Frame-Options: DENY
 *   X-Content-Type-Options: nosniff
 *   Referrer-Policy: strict-origin-when-cross-origin
 *   Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
 *   Cross-Origin-Opener-Policy: same-origin
 * ============================================================================
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Cpu,
  ExternalLink,
  FileText,
  Gauge,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  RotateCcw,
  Scale,
  Settings,
  ShieldCheck,
  Star,
  Wrench,
  X,
} from 'lucide-react';

// ============================================================================
// CONSTANTES DE DISEÑO, NEGOCIO Y SEGURIDAD (ALLOWLISTS ESTRICTAS)
// ============================================================================

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", Arial, sans-serif';

// Superficies Liquid Glass sobre claro y oscuro con refracción especular superior
const GLASS_LIGHT =
  'backdrop-blur-2xl bg-white/70 border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_8px_32px_rgba(0,0,0,0.08)]';

const GLASS_DARK =
  'backdrop-blur-2xl bg-neutral-900/65 border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_8px_32px_rgba(0,0,0,0.08)]';

export const BUSINESS_INFO = Object.freeze({
  name: 'Taller Gospodinoff',
  subtitle: 'Multimarcas · Servicio Oficial Citroën',
  domainUrl: 'https://gospodinoff.com.uy',
  moveNotice:
    'Nos mudamos — Ahora todo en una única dirección: Bvar. Artigas entre Pérez del Puerto y Santana, Maldonado',
  address: 'Bvar. Artigas entre Pérez del Puerto y Santana, CP 20000, Maldonado, Uruguay.',
  addressShort: 'Bvar. Artigas entre Pérez del Puerto y Santana, Maldonado',
  landlineDisplay: '4227 1626',
  landlineHref: 'tel:+59842271626',
  whatsappDisplay: '+598 99 491 626',
  whatsappDigits: '59899491626',
  whatsappBaseUrl: 'https://wa.me/59899491626',
  email: 'mecanica@gospodinoff.com.uy',
  emailHref: 'mailto:mecanica@gospodinoff.com.uy',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Bvar.+Artigas+entre+Perez+del+Puerto+y+Santana+Maldonado+Uruguay',
  experienceYears: '30+',
});

export const VEHICLE_BRANDS = Object.freeze(['Citroën', 'Nissan', 'Renault', 'Otra']);

export const SERVICE_OPTIONS = Object.freeze([
  'Diagnóstico',
  'Servicio Integral / Mantenimiento',
  'Tren delantero/Alineación',
  'Otro',
]);

export const SECURITY_LIMITS = Object.freeze({
  MAX_NAME_LEN: 60,
  MIN_NAME_LEN: 2,
  MAX_PHONE_LEN: 20,
  MIN_PHONE_DIGITS: 7,
  MAX_PHONE_DIGITS: 15,
  MAX_PLATE_LEN: 15,
  MIN_NOTES_LEN: 6,
  MAX_NOTES_LEN: 350,
  COOLDOWN_MS: 15000,
  MAX_SESSION_SUBMITS: 5,
  MAX_BOOKING_DAYS_AHEAD: 120,
});

// Recursos fotográficos locales ('self') y respaldos verificados estrictamente bajo HTTPS
const PHOTOS = Object.freeze({
  heroCar: './hero-auto.jpg',
  heroWorkshop: './hero-taller.jpg',
  heroWorkshopFallback:
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1600&q=85',
  diagnostics:
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=80',
  preventive:
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=80',
  heritage:
    'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1400&q=80',
  alignment:
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1400&q=80',
});

const NAV_LINKS = Object.freeze([
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'contacto', label: 'Contacto' },
]);

const TESTIMONIALS = Object.freeze([
  {
    id: 'testimonio-1',
    quote: '¡Excelente servicio! Me atendieron rápidamente y el trabajo es de calidad.',
    author: 'Cliente verificado',
    context: 'Atención de taller · Maldonado',
  },
  {
    id: 'testimonio-2',
    quote: 'Soy cliente desde hace años y siempre quedo satisfecho con la atención y el servicio.',
    author: 'Cliente habitual',
    context: 'Mantenimiento periódico · Maldonado',
  },
  {
    id: 'testimonio-3',
    quote: 'El personal es muy amable y profesional, sin duda regresaré.',
    author: 'Cliente particular',
    context: 'Servicio posventa · Maldonado',
  },
]);

// ============================================================================
// CAPA DE SEGURIDAD, SANITIZACIÓN Y VALIDACIÓN (OWASP FRONTEND)
// ============================================================================

/**
 * Elimina caracteres de control, delimitadores HTML (<, >) y aplica longitud
 * máxima estricta para prevenir inyección XSS o manipulación de enlaces.
 */
export function sanitizeInput(value, maxLength = 350, { collapseWhitespace = false } = {}) {
  if (typeof value !== 'string') return '';
  let clean = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '');
  if (collapseWhitespace) {
    clean = clean.replace(/\s+/g, ' ').trim();
  }
  return clean.slice(0, maxLength);
}

/**
 * Retorna la fecha local actual en formato ISO YYYY-MM-DD.
 */
export function getLocalDateISO(offsetDays = 0) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  now.setDate(now.getDate() + offsetDays);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Valida un campo individual del formulario de turnos devolviendo un mensaje
 * descriptivo específico o cadena vacía si es válido.
 */
export function validateField(fieldName, formData, todayISO = getLocalDateISO(0)) {
  const maxDateISO = getLocalDateISO(SECURITY_LIMITS.MAX_BOOKING_DAYS_AHEAD);

  switch (fieldName) {
    case 'brand': {
      return VEHICLE_BRANDS.includes(formData.brand)
        ? ''
        : 'Seleccioná una marca válida de la lista.';
    }
    case 'service': {
      return SERVICE_OPTIONS.includes(formData.service)
        ? ''
        : 'Seleccioná un servicio válido de la lista.';
    }
    case 'name': {
      const clean = sanitizeInput(formData.name, SECURITY_LIMITS.MAX_NAME_LEN, {
        collapseWhitespace: true,
      });
      if (!clean) return 'Ingresá tu nombre y apellido.';
      if (clean.length < SECURITY_LIMITS.MIN_NAME_LEN) {
        return `El nombre debe tener al menos ${SECURITY_LIMITS.MIN_NAME_LEN} caracteres.`;
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]+$/.test(clean)) {
        return 'Usá solo letras, espacios, apóstrofes o guiones.';
      }
      return '';
    }
    case 'phone': {
      const clean = sanitizeInput(formData.phone, SECURITY_LIMITS.MAX_PHONE_LEN, {
        collapseWhitespace: true,
      });
      if (!clean) return 'Ingresá un teléfono o WhatsApp de contacto.';
      if (!/^[0-9+\s()-]+$/.test(clean)) {
        return 'El teléfono solo admite números, +, espacios, paréntesis y guiones.';
      }
      const digits = clean.replace(/\D/g, '');
      if (digits.length < SECURITY_LIMITS.MIN_PHONE_DIGITS) {
        return `El número debe incluir al menos ${SECURITY_LIMITS.MIN_PHONE_DIGITS} dígitos.`;
      }
      if (digits.length > SECURITY_LIMITS.MAX_PHONE_DIGITS) {
        return 'El número ingresado excede la longitud permitida.';
      }
      return '';
    }
    case 'plate': {
      const clean = sanitizeInput(formData.plate, SECURITY_LIMITS.MAX_PLATE_LEN, {
        collapseWhitespace: true,
      });
      if (!clean) return '';
      if (!/^[a-zA-Z0-9\s-]+$/.test(clean)) {
        return 'Matrícula o modelo: usá solo letras, números y guiones.';
      }
      return '';
    }
    case 'date': {
      const dateStr = sanitizeInput(formData.date, 10, { collapseWhitespace: true });
      if (!dateStr) return 'Seleccioná una fecha preferida para tu turno.';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return 'Formato de fecha inválido (AAAA-MM-DD).';
      }
      const parsed = new Date(`${dateStr}T12:00:00Z`);
      if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateStr) {
        return 'La fecha ingresada no existe en el calendario.';
      }
      if (dateStr < todayISO) {
        return 'Elegí una fecha igual o posterior al día de hoy.';
      }
      if (dateStr > maxDateISO) {
        return `Podés agendar hasta con ${SECURITY_LIMITS.MAX_BOOKING_DAYS_AHEAD} días de anticipación.`;
      }
      return '';
    }
    case 'notes': {
      const clean = sanitizeInput(formData.notes, SECURITY_LIMITS.MAX_NOTES_LEN, {
        collapseWhitespace: true,
      });
      if (!clean) return 'Contanos brevemente el motivo de tu consulta.';
      if (clean.length < SECURITY_LIMITS.MIN_NOTES_LEN) {
        return `Agregá un detalle mínimo de ${SECURITY_LIMITS.MIN_NOTES_LEN} caracteres.`;
      }
      return '';
    }
    case 'privacyAccepted': {
      return formData.privacyAccepted
        ? ''
        : 'Debés aceptar la Política de Privacidad (Ley N° 18.331) para continuar.';
    }
    default:
      return '';
  }
}

/**
 * Ejecuta validación completa del formulario y retorna los datos sanitizados
 * junto al mapa de errores por campo.
 */
export function validateAppointmentForm(rawForm, todayISO = getLocalDateISO(0)) {
  const sanitized = {
    brand: VEHICLE_BRANDS.includes(rawForm.brand) ? rawForm.brand : VEHICLE_BRANDS[0],
    service: SERVICE_OPTIONS.includes(rawForm.service) ? rawForm.service : SERVICE_OPTIONS[0],
    name: sanitizeInput(rawForm.name, SECURITY_LIMITS.MAX_NAME_LEN, { collapseWhitespace: true }),
    phone: sanitizeInput(rawForm.phone, SECURITY_LIMITS.MAX_PHONE_LEN, { collapseWhitespace: true }),
    plate: sanitizeInput(rawForm.plate, SECURITY_LIMITS.MAX_PLATE_LEN, {
      collapseWhitespace: true,
    }).toUpperCase(),
    date: sanitizeInput(rawForm.date, 10, { collapseWhitespace: true }),
    notes: sanitizeInput(rawForm.notes, SECURITY_LIMITS.MAX_NOTES_LEN, {
      collapseWhitespace: true,
    }),
    privacyAccepted: Boolean(rawForm.privacyAccepted),
    honeypot: typeof rawForm.websiteUrl === 'string' ? rawForm.websiteUrl : '',
  };

  const fields = ['brand', 'service', 'name', 'phone', 'plate', 'date', 'notes', 'privacyAccepted'];
  const errors = {};
  for (const field of fields) {
    const err = validateField(field, sanitized, todayISO);
    if (err) errors[field] = err;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    isBotTrapTriggered: sanitized.honeypot.trim().length > 0,
    errors,
    sanitized,
  };
}

/**
 * Construye una URL segura hacia WhatsApp codificando todo parámetro dinámico
 * con encodeURIComponent() y validando contra listas blancas.
 */
export function buildWhatsAppUrl(sanitizedData) {
  const safeBrand = VEHICLE_BRANDS.includes(sanitizedData.brand) ? sanitizedData.brand : 'Otra';
  const safeService = SERVICE_OPTIONS.includes(sanitizedData.service)
    ? sanitizedData.service
    : 'Otro';

  const lines = [
    'Hola Taller Gospodinoff, solicito turno / presupuesto:',
    `- Marca: ${sanitizeInput(safeBrand, 40, { collapseWhitespace: true })}`,
    `- Servicio: ${sanitizeInput(safeService, 60, { collapseWhitespace: true })}`,
    `- Fecha preferida: ${sanitizeInput(sanitizedData.date, 10, { collapseWhitespace: true })}`,
    `- Nombre: ${sanitizeInput(sanitizedData.name, SECURITY_LIMITS.MAX_NAME_LEN, { collapseWhitespace: true })}`,
    `- Teléfono: ${sanitizeInput(sanitizedData.phone, SECURITY_LIMITS.MAX_PHONE_LEN, { collapseWhitespace: true })}`,
  ];

  if (sanitizedData.plate) {
    lines.push(
      `- Matrícula / Modelo: ${sanitizeInput(sanitizedData.plate, SECURITY_LIMITS.MAX_PLATE_LEN, { collapseWhitespace: true })}`
    );
  }

  lines.push(
    `- Consulta: ${sanitizeInput(sanitizedData.notes, SECURITY_LIMITS.MAX_NOTES_LEN, { collapseWhitespace: true })}`
  );

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  return `${BUSINESS_INFO.whatsappBaseUrl}?text=${encodedMessage}`;
}

/**
 * Construye un enlace mailto: codificado estrictamente con encodeURIComponent().
 */
export function buildMailtoUrl(sanitizedData) {
  const safeBrand = VEHICLE_BRANDS.includes(sanitizedData.brand) ? sanitizedData.brand : 'Otra';
  const safeService = SERVICE_OPTIONS.includes(sanitizedData.service)
    ? sanitizedData.service
    : 'Otro';

  const subject = `Solicitud de turno (${safeBrand} - ${safeService})`;
  const bodyLines = [
    'Solicitud enviada desde gospodinoff.com.uy',
    `Marca: ${safeBrand}`,
    `Servicio: ${safeService}`,
    `Fecha preferida: ${sanitizeInput(sanitizedData.date, 10, { collapseWhitespace: true })}`,
    `Nombre: ${sanitizeInput(sanitizedData.name, SECURITY_LIMITS.MAX_NAME_LEN, { collapseWhitespace: true })}`,
    `Teléfono: ${sanitizeInput(sanitizedData.phone, SECURITY_LIMITS.MAX_PHONE_LEN, { collapseWhitespace: true })}`,
    sanitizedData.plate
      ? `Matrícula / Modelo: ${sanitizeInput(sanitizedData.plate, SECURITY_LIMITS.MAX_PLATE_LEN, { collapseWhitespace: true })}`
      : null,
    `Consulta: ${sanitizeInput(sanitizedData.notes, SECURITY_LIMITS.MAX_NOTES_LEN, { collapseWhitespace: true })}`,
  ].filter(Boolean);

  return `${BUSINESS_INFO.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    bodyLines.join('\n')
  )}`;
}

// ============================================================================
// COMPONENTE DE MODAL LEGAL EN LIQUID GLASS (LEY N° 18.331 & AVISO LEGAL)
// ============================================================================

function LegalModal({ activeModal, onClose }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!activeModal) return undefined;

    previousFocusRef.current = document.activeElement;
    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const isPrivacy = activeModal === 'privacy';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-md"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className={`relative w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-[28px] text-[#1D1D1F] ${GLASS_LIGHT} bg-white/90`}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-black/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0066CC]/10 text-[#0066CC]">
              {isPrivacy ? <Lock className="h-5 w-5" aria-hidden="true" /> : <Scale className="h-5 w-5" aria-hidden="true" />}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                Cumplimiento Normativo · Uruguay
              </p>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-semibold tracking-tight text-[#1D1D1F]">
                {isPrivacy
                  ? 'Política de Privacidad (Ley N° 18.331)'
                  : 'Aviso Legal y Condiciones de Uso'}
              </h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana legal"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-[#1D1D1F] hover:bg-black/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(88vh-148px)] px-6 py-5 space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#1D1D1F]">
          {isPrivacy ? (
            <>
              <p className="text-[#6E6E73]">
                En cumplimiento de la <strong className="text-[#1D1D1F]">Ley N° 18.331 de Protección de Datos Personales y Acción de Habeas Data</strong> de la República Oriental del Uruguay y su Decreto Reglamentario N° 414/009, Taller Gospodinoff informa el tratamiento de los datos ingresados en este sitio web.
              </p>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/5 space-y-2">
                <h3 className="font-semibold text-[#1D1D1F]">1. Responsable y Finalidad</h3>
                <p className="text-[#6E6E73]">
                  Los datos proporcionados en el asistente de turnos (nombre, teléfono, marca del vehículo, matrícula opcional, fecha preferida y consulta) se utilizan exclusivamente para coordinar citas mecánicas, diagnósticos y presupuestos en nuestra sede de {BUSINESS_INFO.address}
                </p>
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/5 space-y-2">
                <h3 className="font-semibold text-[#1D1D1F]">2. Seguridad y Mínima Exposición</h3>
                <p className="text-[#6E6E73]">
                  Este sitio opera bajo protocolo seguro HTTPS, valida y sanitiza las entradas en navegador y no almacena datos personales en cookies publicitarias ni los cede a terceros con fines comerciales. El envío por WhatsApp o correo electrónico se inicia únicamente tras confirmación explícita del usuario.
                </p>
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/5 space-y-2">
                <h3 className="font-semibold text-[#1D1D1F]">3. Derechos de Acceso, Rectificación y Supresión</h3>
                <p className="text-[#6E6E73]">
                  Podés ejercer en cualquier momento tus derechos de acceso, rectificación, actualización, inclusión o supresión escribiendo a{' '}
                  <a
                    href={BUSINESS_INFO.emailHref}
                    className="font-medium text-[#0066CC] underline underline-offset-2"
                  >
                    {BUSINESS_INFO.email}
                  </a>{' '}
                  o comunicándote al teléfono {BUSINESS_INFO.landlineDisplay}.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/5 space-y-2">
                <h3 className="font-semibold text-[#1D1D1F]">1. Identificación del Titular</h3>
                <p className="text-[#6E6E73]">
                  Sitio oficial de <strong className="text-[#1D1D1F]">{BUSINESS_INFO.name}</strong> — Servicio Oficial Citroën y atención multimarcas especializada en Citroën, Nissan y Renault. Sede única en {BUSINESS_INFO.address} Teléfono fijo: {BUSINESS_INFO.landlineDisplay} · Celular / WhatsApp: {BUSINESS_INFO.whatsappDisplay} · Correo: {BUSINESS_INFO.email}.
                </p>
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/5 space-y-2">
                <h3 className="font-semibold text-[#1D1D1F]">2. Alcance de Turnos y Presupuestos Online</h3>
                <p className="text-[#6E6E73]">
                  Las solicitudes enviadas a través del asistente web constituyen una pre-reserva sujeta a confirmación de disponibilidad horaria por parte del taller. Todo presupuesto definitivo se elabora tras la inspección técnica y diagnóstico presencial del vehículo.
                </p>
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/5 space-y-2">
                <h3 className="font-semibold text-[#1D1D1F]">3. Propiedad Intelectual y Jurisdicción</h3>
                <p className="text-[#6E6E73]">
                  Los textos, identidad comercial y marcas mencionadas pertenecen a sus respectivos titulares y se citan con fines estrictamente informativos de especialidad técnica. Este sitio se rige por las leyes vigentes de la República Oriental del Uruguay.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-black/10 bg-[#FBFBFD]">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 rounded-full bg-[#1D1D1F] text-white text-sm font-medium hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL: TALLER GOSPODINOFF
// ============================================================================

export default function TallerGospodinoff() {
  const todayISO = useMemo(() => getLocalDateISO(0), []);
  const maxDateISO = useMemo(() => getLocalDateISO(SECURITY_LIMITS.MAX_BOOKING_DAYS_AHEAD), []);
  const defaultDateISO = useMemo(() => getLocalDateISO(1), []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [addressCopied, setAddressCopied] = useState(false);
  const [carAnimRun, setCarAnimRun] = useState(1);

  // Estado del Asistente Interactivo de Turnos y Presupuestos
  const [formData, setFormData] = useState({
    brand: 'Citroën',
    service: 'Diagnóstico',
    name: '',
    phone: '',
    plate: '',
    date: defaultDateISO,
    notes: '',
    privacyAccepted: false,
    websiteUrl: '', // Campo honeypot invisible para bloquear bots automatizados
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [rateLimitNotice, setRateLimitNotice] = useState('');

  const lastSignatureRef = useRef('');
  const formHeadingRef = useRef(null);
  const nameInputRef = useRef(null);
  const errorSummaryRef = useRef(null);

  // Temporizador de rate-limiting en UI para evitar envíos duplicados
  useEffect(() => {
    if (cooldownSeconds <= 0) return undefined;
    const interval = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [cooldownSeconds]);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickSelectFromCard = ({ brand, service }) => {
    setFormData((prev) => ({
      ...prev,
      brand: brand && VEHICLE_BRANDS.includes(brand) ? brand : prev.brand,
      service: service && SERVICE_OPTIONS.includes(service) ? service : prev.service,
    }));
    setSubmittedRecord(null);
    setRateLimitNotice('');
    scrollToSection('turnos');
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 450);
  };

  const handleFieldChange = (field, rawValue) => {
    let nextValue = rawValue;
    if (field === 'name') nextValue = sanitizeInput(rawValue, SECURITY_LIMITS.MAX_NAME_LEN);
    if (field === 'phone') nextValue = sanitizeInput(rawValue, SECURITY_LIMITS.MAX_PHONE_LEN);
    if (field === 'plate') nextValue = sanitizeInput(rawValue, SECURITY_LIMITS.MAX_PLATE_LEN);
    if (field === 'notes') nextValue = sanitizeInput(rawValue, SECURITY_LIMITS.MAX_NOTES_LEN);
    if (field === 'date') nextValue = sanitizeInput(rawValue, 10);

    const updated = { ...formData, [field]: nextValue };
    setFormData(updated);
    setRateLimitNotice('');

    // Si el campo ya mostró error antes, revalidar al escribir para limpiar el error apenas sea válido
    if (touched[field] && errors[field]) {
      const nextErr = validateField(field, updated, todayISO);
      setErrors((prev) => {
        const copy = { ...prev };
        if (nextErr) copy[field] = nextErr;
        else delete copy[field];
        return copy;
      });
    }
  };

  const handleFieldBlur = (field) => {
    const cleanVal =
      typeof formData[field] === 'string'
        ? sanitizeInput(
            formData[field],
            field === 'notes'
              ? SECURITY_LIMITS.MAX_NOTES_LEN
              : field === 'name'
                ? SECURITY_LIMITS.MAX_NAME_LEN
                : field === 'phone'
                  ? SECURITY_LIMITS.MAX_PHONE_LEN
                  : SECURITY_LIMITS.MAX_PLATE_LEN,
            { collapseWhitespace: true }
          )
        : formData[field];

    const updated = {
      ...formData,
      [field]: field === 'plate' && typeof cleanVal === 'string' ? cleanVal.toUpperCase() : cleanVal,
    };
    setFormData(updated);
    setTouched((prev) => ({ ...prev, [field]: true }));

    const fieldError = validateField(field, updated, todayISO);
    setErrors((prev) => {
      const copy = { ...prev };
      if (fieldError) copy[field] = fieldError;
      else delete copy[field];
      return copy;
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setRateLimitNotice('');

    // Bloqueo de envío duplicado / rate-limiting en sesión
    if (submitCount >= SECURITY_LIMITS.MAX_SESSION_SUBMITS) {
      setRateLimitNotice(
        'Alcanzaste el límite de solicitudes en esta sesión. Comunicate directo al +598 99 491 626 o 4227 1626.'
      );
      return;
    }

    if (cooldownSeconds > 0) {
      setRateLimitNotice(`Esperá ${cooldownSeconds} segundos antes de enviar una nueva solicitud.`);
      return;
    }

    const result = validateAppointmentForm(formData, todayISO);

    // Honeypot: si un bot automatizado completó el campo trampa oculto, abortamos sin ejecutar acciones
    if (result.isBotTrapTriggered) {
      return;
    }

    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({
        brand: true,
        service: true,
        name: true,
        phone: true,
        plate: true,
        date: true,
        notes: true,
        privacyAccepted: true,
      });
      window.setTimeout(() => {
        errorSummaryRef.current?.focus();
      }, 20);
      return;
    }

    const payloadSignature = JSON.stringify({
      b: result.sanitized.brand,
      s: result.sanitized.service,
      d: result.sanitized.date,
      p: result.sanitized.phone,
      n: result.sanitized.notes,
    });

    if (payloadSignature === lastSignatureRef.current && submittedRecord) {
      setRateLimitNotice(
        'Esta solicitud ya fue preparada debajo. Podés enviarla directo por WhatsApp o modificar algún dato.'
      );
      return;
    }

    lastSignatureRef.current = payloadSignature;
    const whatsappUrl = buildWhatsAppUrl(result.sanitized);
    const mailtoUrl = buildMailtoUrl(result.sanitized);

    setErrors({});
    setSubmittedRecord({
      ...result.sanitized,
      whatsappUrl,
      mailtoUrl,
      createdAt: new Date().toLocaleTimeString('es-UY', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    setSubmitCount((c) => c + 1);
    setCooldownSeconds(Math.ceil(SECURITY_LIMITS.COOLDOWN_MS / 1000));
  };

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(BUSINESS_INFO.address);
        setAddressCopied(true);
        window.setTimeout(() => setAddressCopied(false), 2600);
      }
    } catch {
      setAddressCopied(false);
    }
  };

  const errorEntries = Object.entries(errors);
  const directWhatsAppHello = `${BUSINESS_INFO.whatsappBaseUrl}?text=${encodeURIComponent(
    'Hola Taller Gospodinoff, quisiera consultar disponibilidad para un turno.'
  )}`;

  return (
    <div
      style={{ fontFamily: FONT_STACK }}
      className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] antialiased selection:bg-[#0066CC] selection:text-white"
    >
      {/* Enlace accesible de salto directo al contenido */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#1D1D1F] focus:text-white focus:text-sm focus:font-medium"
      >
        Ir al contenido principal
      </a>

      {/* ================================================================== */}
      {/* 1. BARRA DE NAVEGACIÓN FLOTANTE (LIQUID GLASS)                     */}
      {/* ================================================================== */}
      <header className="fixed top-3 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none">
        <div
          className={`pointer-events-auto mx-auto max-w-6xl rounded-full px-3 sm:px-5 py-2 transition-colors ${GLASS_LIGHT} bg-white/80`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Identidad visual */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('inicio');
              }}
              className="flex items-center gap-2.5 min-h-[44px] min-w-0 pr-1 sm:pr-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              <span
                aria-hidden="true"
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D1D1F] text-white shadow-sm"
              >
                <Wrench className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#B81D24] ring-2 ring-white" />
              </span>
              <span className="flex flex-col leading-tight min-w-0">
                <span className="text-[13px] sm:text-[15px] font-semibold tracking-tight text-[#1D1D1F] truncate">
                  {BUSINESS_INFO.name}
                </span>
                <span className="text-[11px] font-medium text-[#6E6E73] hidden sm:block">
                  {BUSINESS_INFO.subtitle}
                </span>
              </span>
            </a>

            {/* Enlaces de escritorio */}
            <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.id);
                  }}
                  className="px-3.5 py-2 rounded-full text-[13px] font-medium text-[#1D1D1F]/85 hover:text-[#1D1D1F] hover:bg-black/5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Acción principal y botón móvil */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollToSection('turnos')}
                className="min-h-[44px] px-3.5 sm:px-5 rounded-full bg-[#1D1D1F] text-white text-xs sm:text-[13px] font-medium tracking-tight whitespace-nowrap hover:bg-black active:scale-[0.98] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
              >
                Agendar Turno
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-controls="menu-movil-gospodinoff"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-[#1D1D1F] hover:bg-black/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú desplegable móvil en Liquid Glass */}
        {mobileMenuOpen && (
          <nav
            id="menu-movil-gospodinoff"
            aria-label="Navegación móvil"
            className={`pointer-events-auto md:hidden mt-2 mx-auto max-w-6xl rounded-[26px] p-4 ${GLASS_LIGHT} bg-white/95`}
          >
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
              {BUSINESS_INFO.subtitle}
            </p>
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                    className="flex items-center justify-between min-h-[44px] px-3 rounded-2xl text-[15px] font-medium text-[#1D1D1F] hover:bg-black/5 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-[#6E6E73]" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-black/10 grid grid-cols-2 gap-2">
              <a
                href={directWhatsAppHello}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 rounded-full bg-[#0066CC] text-white text-xs font-medium"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 min-h-[44px] px-3 rounded-full bg-black/5 text-[#1D1D1F] text-xs font-medium"
              >
                <MapPin className="h-4 w-4 text-[#B81D24]" aria-hidden="true" />
                <span>Ver Mapa</span>
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="contenido-principal">
        {/* ================================================================ */}
        {/* 2. HERO SECTION AUTOMOTRIZ + ANIMACIÓN DE INGRESO DEL VEHÍCULO   */}
        {/* ================================================================ */}
        <section
          id="inicio"
          className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 bg-[#0A0A0C] text-white"
        >
          {/* Atmósfera real de taller mecánico en segundo plano con viñeta oscura */}
          <img
            src={PHOTOS.heroWorkshop}
            alt=""
            aria-hidden="true"
            onError={(e) => {
              e.currentTarget.src = PHOTOS.heroWorkshopFallback;
            }}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 scale-105"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0A0C]/90 via-[#0A0A0C]/85 to-[#0A0A0C]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-1/4 h-[380px] w-[620px] rounded-full bg-[#0066CC]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/3 -left-20 h-[300px] w-[420px] rounded-full bg-[#B81D24]/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl">
            {/* Píldora oficial de mudanza en Liquid Glass oscuro */}
            <div className="flex justify-center lg:justify-start">
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contacto');
                }}
                className={`inline-flex items-center gap-2.5 max-w-full rounded-full px-4 py-2 text-xs sm:text-[13px] font-medium text-white hover:bg-white/15 transition-colors ${GLASS_DARK}`}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#B81D24]"
                />
                <span className="truncate sm:whitespace-normal">
                  {BUSINESS_INFO.moveNotice}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#2997FF]" aria-hidden="true" />
              </a>
            </div>

            {/* Escenario principal dividido: mensaje + ingreso animado del vehículo al box */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Columna de identidad y acciones */}
              <div className="lg:col-span-5 text-center lg:text-left">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#D2D2D7]">
                  <Wrench className="h-4 w-4 text-[#B81D24]" aria-hidden="true" />
                  <span>Taller Mecánico · Servicio Oficial Citroën</span>
                </p>

                <h1 className="mt-4 text-4xl sm:text-5xl xl:text-[56px] font-semibold tracking-tight leading-[1.06] text-white">
                  Más de 30 años de precisión mecánica para tu vehículo.
                </h1>

                <p className="mx-auto lg:mx-0 mt-5 max-w-xl text-base sm:text-[18px] leading-relaxed text-[#D2D2D7]">
                  Servicio Oficial Citroën y atención multimarcas especializada en Maldonado, con
                  foco en Citroën, Nissan y Renault.
                </p>

                {/* Llamados a la acción principales */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5">
                  <button
                    type="button"
                    onClick={() => scrollToSection('turnos')}
                    className="w-full sm:w-auto min-h-[48px] px-7 rounded-full bg-white text-[#1D1D1F] text-[15px] font-semibold tracking-tight whitespace-nowrap hover:bg-[#F5F5F7] active:scale-[0.98] transition-transform inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997FF]"
                  >
                    <span>Solicitar turno online</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <a
                    href={directWhatsAppHello}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3 inline-flex items-center justify-center gap-1.5 text-[15px] font-medium whitespace-nowrap text-[#2997FF] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997FF] rounded-full"
                  >
                    <span>Escribir por WhatsApp</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                {/* Accesos rápidos de 1 toque en móviles */}
                <div className="mt-7 grid grid-cols-3 gap-2.5 sm:hidden">
                  <a
                    href={directWhatsAppHello}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center min-h-[56px] rounded-2xl p-2.5 text-center text-white ${GLASS_DARK}`}
                  >
                    <MessageCircle className="h-5 w-5 text-[#2997FF]" aria-hidden="true" />
                    <span className="mt-1 text-[11px] font-semibold">WhatsApp</span>
                  </a>
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center min-h-[56px] rounded-2xl p-2.5 text-center text-white ${GLASS_DARK}`}
                  >
                    <MapPin className="h-5 w-5 text-[#B81D24]" aria-hidden="true" />
                    <span className="mt-1 text-[11px] font-semibold">Mapa</span>
                  </a>
                  <a
                    href={BUSINESS_INFO.landlineHref}
                    className={`flex flex-col items-center justify-center min-h-[56px] rounded-2xl p-2.5 text-center text-white ${GLASS_DARK}`}
                  >
                    <Phone className="h-5 w-5 text-white" aria-hidden="true" />
                    <span className="mt-1 text-[11px] font-semibold">4227 1626</span>
                  </a>
                </div>
              </div>

              {/* Columna de escenario animado: auto ingresando al box de diagnóstico */}
              <div className="lg:col-span-7">
                <div className="relative rounded-[30px] bg-black border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden">
                  {/* Barra superior del box técnico */}
                  <div className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-6 pt-4 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#B81D24]"
                      />
                      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#D2D2D7] truncate">
                        Box de Recepción y Diagnóstico · Maldonado
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCarAnimRun((n) => n + 1)}
                      aria-label="Repetir animación de ingreso del vehículo"
                      className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white hover:bg-white/20 active:scale-[0.97] transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997FF]"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-[#2997FF]" aria-hidden="true" />
                      <span>Ver entrada</span>
                    </button>
                  </div>

                  {/* Pista animada del vehículo */}
                  <div
                    key={carAnimRun}
                    className="relative px-3 sm:px-6 pt-5 pb-4 overflow-hidden bg-black"
                  >
                    {/* Haz de luz LED frontal proyectado sobre el piso al estacionar */}
                    <div
                      aria-hidden="true"
                      className="tg-headlight-on pointer-events-none absolute right-2 bottom-[24%] h-20 w-44 rounded-full bg-gradient-to-r from-white/30 via-[#2997FF]/15 to-transparent blur-2xl"
                    />

                    {/* Vehículo entrando suavemente al taller desde la izquierda */}
                    <div className="tg-car-arrive relative mx-auto max-w-[600px]">
                      <img
                        src={PHOTOS.heroCar}
                        alt="Vehículo ingresando al box de diagnóstico técnico de Taller Gospodinoff"
                        onError={(e) => {
                          e.currentTarget.src = PHOTOS.heroWorkshopFallback;
                        }}
                        className="w-full h-[210px] sm:h-[290px] object-contain select-none"
                      />

                      {/* Escaneo óptico de diagnóstico computarizado sobre el chasis */}
                      <div
                        aria-hidden="true"
                        className="tg-scan-beam pointer-events-none absolute inset-y-4 inset-x-0 flex justify-center"
                      >
                        <div className="h-full w-[2px] bg-gradient-to-b from-transparent via-[#2997FF] to-transparent shadow-[0_0_24px_6px_rgba(41,151,255,0.55)]" />
                      </div>
                    </div>

                    {/* Línea técnica de piso de box hidráulico */}
                    <div
                      aria-hidden="true"
                      className="mx-auto mt-1 h-px w-11/12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />

                    {/* Indicadores mecánicos revelados al completar el ingreso */}
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="tg-pin-1 rounded-2xl bg-neutral-900/80 border border-white/15 px-2.5 sm:px-3 py-2.5 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-1.5 text-[#2997FF]">
                          <Cpu className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white whitespace-nowrap">
                            Escáner ECU
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#D2D2D7] hidden sm:block">
                          Diagnóstico electrónico
                        </p>
                      </div>

                      <div className="tg-pin-2 rounded-2xl bg-neutral-900/80 border border-white/15 px-2.5 sm:px-3 py-2.5 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-1.5 text-[#2997FF]">
                          <Gauge className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white whitespace-nowrap">
                            Alineación
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#D2D2D7] hidden sm:block">
                          Tren delantero y balanceo
                        </p>
                      </div>

                      <div className="tg-pin-3 rounded-2xl bg-neutral-900/80 border border-white/15 px-2.5 sm:px-3 py-2.5 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-1.5 text-[#B81D24]">
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white whitespace-nowrap">
                            Citroën
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#D2D2D7] hidden sm:block">
                          Servicio Oficial y multimarcas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitrina real del taller mecánico en operación */}
            <div className="mt-10 sm:mt-14 relative rounded-[32px] overflow-hidden bg-[#111114] shadow-[0_24px_64px_rgba(0,0,0,0.45)] border border-white/15">
              <div className="relative">
                <img
                  src={PHOTOS.heroWorkshop}
                  alt="Mecánico realizando diagnóstico computarizado en box hidráulico de taller moderno"
                  onError={(e) => {
                    e.currentTarget.src = PHOTOS.heroWorkshopFallback;
                  }}
                  className="w-full h-[240px] sm:h-[340px] md:h-[450px] object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#0A0A0C]/20 to-transparent md:from-[#0A0A0C]/90"
                />
              </div>

              <div className="relative p-4 md:p-0 md:absolute md:inset-x-6 md:bottom-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`rounded-2xl p-4 text-white ${GLASS_DARK}`}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]">
                    <span className="h-2 w-2 rounded-full bg-[#B81D24]" aria-hidden="true" />
                    <span>Servicio Oficial</span>
                  </div>
                  <p className="mt-1.5 text-base font-semibold tracking-tight text-white">
                    Citroën en Maldonado
                  </p>
                  <p className="mt-0.5 text-xs text-[#D2D2D7]">
                    Estándares oficiales y atención posventa.
                  </p>
                </div>

                <div className={`rounded-2xl p-4 text-white ${GLASS_DARK}`}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]">
                    <Car className="h-3.5 w-3.5 text-[#2997FF]" aria-hidden="true" />
                    <span>Especialización</span>
                  </div>
                  <p className="mt-1.5 text-base font-semibold tracking-tight text-white">
                    Citroën, Nissan y Renault
                  </p>
                  <p className="mt-0.5 text-xs text-[#D2D2D7]">
                    Cobertura integral para todas las marcas.
                  </p>
                </div>

                <div className={`rounded-2xl p-4 text-white ${GLASS_DARK}`}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]">
                    <MapPin className="h-3.5 w-3.5 text-[#2997FF]" aria-hidden="true" />
                    <span>Sede Única</span>
                  </div>
                  <p className="mt-1.5 text-base font-semibold tracking-tight text-white">
                    Bvar. Artigas · Maldonado
                  </p>
                  <p className="mt-0.5 text-xs text-[#D2D2D7]">
                    Entre Pérez del Puerto y Santana, CP 20000.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 3. BENTO GRID DE SERVICIOS Y TRAYECTORIA                         */}
        {/* ================================================================ */}
        <section id="servicios" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F5F5F7]">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0066CC]">
                Servicios Especializados
              </p>
              <h2 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
                Ingeniería de mantenimiento para cada kilómetro.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#6E6E73]">
                Diagnóstico electrónico, mecánica preventiva y atención posventa oficial reunidos en
                una sola dirección en Maldonado.
              </p>
            </div>

            {/* Cuadrícula Bento Asimétrica */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Tarjeta 1: Servicio Oficial Citroën & Multimarcas (Clara amplia) */}
              <article
                className={`md:col-span-7 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden ${GLASS_LIGHT}`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#B81D24]/10 px-3.5 py-1 text-xs font-semibold text-[#B81D24]">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Servicio Oficial Citroën</span>
                    </span>
                    <span className="text-xs font-medium text-[#6E6E73]">
                      Posventa Multimarcas
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F]">
                    Servicio Oficial Citroën & Multimarcas
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-[#6E6E73]">
                    Especialistas en{' '}
                    <strong className="font-semibold text-[#1D1D1F]">
                      Citroën, Nissan y Renault
                    </strong>
                    , además de atención posventa integral para todas las marcas.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {['Citroën', 'Nissan', 'Renault', 'Todas las marcas'].map((brandTag) => (
                      <span
                        key={brandTag}
                        className="rounded-full bg-[#F5F5F7] border border-black/5 px-3.5 py-1.5 text-xs font-medium text-[#1D1D1F]"
                      >
                        {brandTag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div className="sm:col-span-7 overflow-hidden rounded-2xl border border-black/5">
                    <img
                      src={PHOTOS.preventive}
                      alt="Mecánico realizando mantenimiento especializado en vehículo"
                      className="h-44 w-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-5 flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickSelectFromCard({
                          brand: 'Citroën',
                          service: 'Servicio Integral / Mantenimiento',
                        })
                      }
                      className="min-h-[44px] w-full px-4 rounded-full bg-[#1D1D1F] text-white text-sm font-medium hover:bg-black transition-colors inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                    >
                      <span>Consultar turno</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Tarjeta 2: Diagnósticos Computarizados (Alto contraste oscuro #0A0A0C) */}
              <article className="md:col-span-5 relative rounded-[28px] bg-[#0A0A0C] p-1 overflow-hidden shadow-[0_16px_44px_rgba(0,0,0,0.18)]">
                {/* Destellos ambientales sutiles detrás del panel de vidrio oscuro */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-12 -right-10 h-56 w-56 rounded-full bg-[#0066CC]/35 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#B81D24]/25 blur-3xl"
                />

                <div
                  className={`relative h-full rounded-[24px] p-6 sm:p-7 flex flex-col justify-between text-white ${GLASS_DARK}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#2997FF]">
                        <Cpu className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#D2D2D7]">
                        Electrónica & ECU
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl sm:text-[28px] font-semibold tracking-tight text-white">
                      Diagnósticos Computarizados
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#D2D2D7]">
                      Diagnósticos precisos de última generación para identificar cualquier falla
                      mecánica o electrónica en el vehículo.
                    </p>

                    <ul className="mt-5 space-y-2.5 text-sm text-[#F5F5F7]">
                      <li className="flex items-center gap-2.5">
                        <Activity className="h-4 w-4 shrink-0 text-[#2997FF]" aria-hidden="true" />
                        <span>Lectura computarizada de fallas y sensores</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Settings className="h-4 w-4 shrink-0 text-[#2997FF]" aria-hidden="true" />
                        <span>Control de inyección, encendido y módulos</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/15">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickSelectFromCard({
                          service: 'Diagnóstico',
                        })
                      }
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-medium text-[#2997FF] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997FF] rounded-lg px-1"
                    >
                      <span>Agendar diagnóstico computarizado</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>

              {/* Tarjeta 3: Servicio Integral Preventivo (Clara) */}
              <article
                className={`md:col-span-5 rounded-[28px] p-6 sm:p-7 flex flex-col justify-between ${GLASS_LIGHT}`}
              >
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0066CC]/10 text-[#0066CC]">
                    <Gauge className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                    Servicio Integral Preventivo
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#6E6E73]">
                    Cambio de aceite y filtros, inspección general de tren delantero y tren trasero,
                    control de niveles, rotación, balanceo y alineación.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-[#1D1D1F]">
                    {[
                      'Aceite y filtros',
                      'Tren delantero y trasero',
                      'Control de niveles',
                      'Rotación y alineación',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-xl bg-[#F5F5F7] px-3 py-2 border border-black/5"
                      >
                        <CheckCircle2
                          className="h-3.5 w-3.5 shrink-0 text-[#0066CC]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-black/10 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickSelectFromCard({
                        service: 'Servicio Integral / Mantenimiento',
                      })
                    }
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-medium text-[#0066CC] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC] rounded-lg px-1"
                  >
                    <span>Solicitar service</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickSelectFromCard({
                        service: 'Tren delantero/Alineación',
                      })
                    }
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-medium text-[#1D1D1F] hover:text-[#0066CC] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC] rounded-lg px-1"
                  >
                    <span>Alineación / tren</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>

              {/* Tarjeta 4: 30+ Años de Respaldo (#nosotros) */}
              <article
                id="nosotros"
                className={`md:col-span-7 scroll-mt-24 rounded-[28px] p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center ${GLASS_LIGHT}`}
              >
                <div className="sm:col-span-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3.5 py-1 text-xs font-semibold text-[#1D1D1F]">
                    <Award className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
                    <span>Nosotros · Trayectoria en Maldonado</span>
                  </span>

                  <h3 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F]">
                    30+ Años de Respaldo
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-[#6E6E73]">
                    Compromiso con la calidad, repuestos confiables y atención personalizada en
                    Maldonado.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-black/10">
                    <div>
                      <p className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">+30</p>
                      <p className="mt-0.5 text-xs text-[#6E6E73]">
                        Años de trayectoria mecánica en Maldonado
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">1 Sede</p>
                      <p className="mt-0.5 text-xs text-[#6E6E73]">
                        Todo unificado en Bvar. Artigas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-5">
                  <div className="relative overflow-hidden rounded-2xl border border-black/5">
                    <img
                      src={PHOTOS.heritage}
                      alt="Herramientas y precisión mecánica en taller automotriz"
                      className="h-56 sm:h-64 w-full object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                    />
                    <span className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/60 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-white border border-white/20">
                      Repuestos confiables y trato directo
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4. ASISTENTE INTERACTIVO DE TURNOS Y PRESUPUESTOS (OSCURO GLASS) */}
        {/* ================================================================ */}
        <section
          id="turnos"
          className="relative scroll-mt-20 overflow-hidden bg-[#0A0A0C] py-16 sm:py-24 px-4 sm:px-6 text-white"
        >
          {/* Destellos ambientales sutiles para dar profundidad a los paneles de vidrio */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-12 left-1/4 h-72 w-72 rounded-full bg-[#0066CC]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none bottom-10 right-1/5 absolute h-72 w-72 rounded-full bg-[#B81D24]/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Columna de contexto y resumen de seguridad */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2997FF]">
                    Asistente de Turnos y Presupuestos
                  </p>
                  <h2
                    ref={formHeadingRef}
                    className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-white"
                  >
                    Coordiná tu visita al taller en menos de un minuto.
                  </h2>
                  <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-[#D2D2D7]">
                    Elegí la marca de tu vehículo, el tipo de servicio y la fecha preferida.
                    Validamos tu consulta y armamos el mensaje listo para enviar directo a nuestro
                    equipo técnico.
                  </p>
                </div>

                {/* Tarjeta informativa en Liquid Glass oscuro */}
                <div className={`rounded-[24px] p-5 space-y-4 ${GLASS_DARK}`}>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 shrink-0 text-[#2997FF] mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-white">Recepción en sede única</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#D2D2D7]">
                        {BUSINESS_INFO.addressShort}. Confirmamos disponibilidad horaria por
                        WhatsApp o teléfono fijo ({BUSINESS_INFO.landlineDisplay}).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-white/15">
                    <ShieldCheck
                      className="h-5 w-5 shrink-0 text-[#2997FF] mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Formulario protegido (OWASP + Ley N° 18.331)
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#D2D2D7]">
                        Entradas sanitizadas, filtro anti-bots y codificación segura antes de abrir
                        WhatsApp ({BUSINESS_INFO.whatsappDisplay}).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel interactivo del formulario */}
              <div className="lg:col-span-7">
                <div className={`rounded-[28px] p-6 sm:p-8 ${GLASS_DARK}`}>
                  {/* Resumen de errores accesible tras submit inválido */}
                  {errorEntries.length > 0 && (
                    <div
                      ref={errorSummaryRef}
                      tabIndex={-1}
                      className="mb-6 rounded-2xl border border-red-400/50 bg-red-950/60 p-4 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      <div className="flex items-center gap-2 font-semibold text-red-200">
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>
                          Revisá {errorEntries.length === 1 ? 'el campo marcado' : `los ${errorEntries.length} campos marcados`} antes de continuar:
                        </span>
                      </div>
                      <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-red-100">
                        {errorEntries.map(([key, message]) => (
                          <li key={key}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rateLimitNotice && (
                    <div
                      role="status"
                      className="mb-6 rounded-2xl border border-amber-300/40 bg-amber-950/50 p-4 text-xs sm:text-sm text-amber-100 flex items-start gap-2.5"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-300" aria-hidden="true" />
                      <span>{rateLimitNotice}</span>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
                    {/* Campo honeypot invisible (protección anti-spam) */}
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="websiteUrl">No completar este campo</label>
                      <input
                        id="websiteUrl"
                        name="websiteUrl"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData((p) => ({ ...p, websiteUrl: e.target.value }))}
                      />
                    </div>

                    {/* 1. Marca del vehículo */}
                    <fieldset>
                      <legend className="text-sm font-semibold text-white">
                        1. Marca del vehículo
                      </legend>
                      <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {VEHICLE_BRANDS.map((brand) => {
                          const selected = formData.brand === brand;
                          return (
                            <button
                              key={brand}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => handleFieldChange('brand', brand)}
                              className={`min-h-[44px] rounded-2xl px-3 text-sm font-medium transition-all border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997FF] ${
                                selected
                                  ? 'bg-white text-[#1D1D1F] border-white shadow-sm'
                                  : 'bg-white/5 text-[#F5F5F7] border-white/20 hover:bg-white/10'
                              }`}
                            >
                              {brand}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* 2. Servicio requerido */}
                    <fieldset>
                      <legend className="text-sm font-semibold text-white">
                        2. Servicio requerido
                      </legend>
                      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {SERVICE_OPTIONS.map((service) => {
                          const selected = formData.service === service;
                          return (
                            <button
                              key={service}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => handleFieldChange('service', service)}
                              className={`min-h-[44px] rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition-all border flex items-center justify-between gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997FF] ${
                                selected
                                  ? 'bg-[#0066CC] text-white border-[#2997FF] shadow-sm'
                                  : 'bg-white/5 text-[#F5F5F7] border-white/20 hover:bg-white/10'
                              }`}
                            >
                              <span>{service}</span>
                              {selected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* 3. Datos de contacto y fecha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="turno-nombre"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]"
                        >
                          Nombre y apellido *
                        </label>
                        <input
                          ref={nameInputRef}
                          id="turno-nombre"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          maxLength={SECURITY_LIMITS.MAX_NAME_LEN}
                          value={formData.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          onBlur={() => handleFieldBlur('name')}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'err-turno-nombre' : undefined}
                          placeholder="Ej. Martín Rodríguez"
                          className="mt-1.5 w-full min-h-[44px] rounded-2xl bg-black/45 border border-white/25 px-4 text-sm text-white placeholder:text-neutral-400 focus:border-[#2997FF] focus:outline-none focus:ring-2 focus:ring-[#2997FF]/40"
                        />
                        {errors.name && (
                          <p id="err-turno-nombre" role="alert" className="mt-1.5 text-xs text-red-300">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="turno-telefono"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]"
                        >
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          id="turno-telefono"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          required
                          autoComplete="tel"
                          maxLength={SECURITY_LIMITS.MAX_PHONE_LEN}
                          value={formData.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          onBlur={() => handleFieldBlur('phone')}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={errors.phone ? 'err-turno-telefono' : undefined}
                          placeholder="Ej. 099 123 456"
                          className="mt-1.5 w-full min-h-[44px] rounded-2xl bg-black/45 border border-white/25 px-4 text-sm text-white placeholder:text-neutral-400 focus:border-[#2997FF] focus:outline-none focus:ring-2 focus:ring-[#2997FF]/40"
                        />
                        {errors.phone && (
                          <p id="err-turno-telefono" role="alert" className="mt-1.5 text-xs text-red-300">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="turno-fecha"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]"
                        >
                          Fecha preferida *
                        </label>
                        <div className="relative mt-1.5">
                          <input
                            id="turno-fecha"
                            name="date"
                            type="date"
                            required
                            min={todayISO}
                            max={maxDateISO}
                            value={formData.date}
                            onChange={(e) => handleFieldChange('date', e.target.value)}
                            onBlur={() => handleFieldBlur('date')}
                            aria-invalid={Boolean(errors.date)}
                            aria-describedby={errors.date ? 'err-turno-fecha' : undefined}
                            className="w-full min-h-[44px] rounded-2xl bg-black/45 border border-white/25 px-4 text-sm text-white [color-scheme:dark] focus:border-[#2997FF] focus:outline-none focus:ring-2 focus:ring-[#2997FF]/40"
                          />
                        </div>
                        {errors.date && (
                          <p id="err-turno-fecha" role="alert" className="mt-1.5 text-xs text-red-300">
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="turno-matricula"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]"
                        >
                          Matrícula / Modelo (opcional)
                        </label>
                        <input
                          id="turno-matricula"
                          name="plate"
                          type="text"
                          maxLength={SECURITY_LIMITS.MAX_PLATE_LEN}
                          value={formData.plate}
                          onChange={(e) => handleFieldChange('plate', e.target.value)}
                          onBlur={() => handleFieldBlur('plate')}
                          aria-invalid={Boolean(errors.plate)}
                          aria-describedby={errors.plate ? 'err-turno-matricula' : undefined}
                          placeholder="Ej. B123456 · C4"
                          className="mt-1.5 w-full min-h-[44px] rounded-2xl bg-black/45 border border-white/25 px-4 text-sm uppercase text-white placeholder:normal-case placeholder:text-neutral-400 focus:border-[#2997FF] focus:outline-none focus:ring-2 focus:ring-[#2997FF]/40"
                        />
                        {errors.plate && (
                          <p id="err-turno-matricula" role="alert" className="mt-1.5 text-xs text-red-300">
                            {errors.plate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 4. Consulta breve */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="turno-consulta"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#D2D2D7]"
                        >
                          Consulta breve *
                        </label>
                        <span className="text-[11px] text-[#D2D2D7]">
                          {formData.notes.length}/{SECURITY_LIMITS.MAX_NOTES_LEN}
                        </span>
                      </div>
                      <textarea
                        id="turno-consulta"
                        name="notes"
                        rows={3}
                        required
                        maxLength={SECURITY_LIMITS.MAX_NOTES_LEN}
                        value={formData.notes}
                        onChange={(e) => handleFieldChange('notes', e.target.value)}
                        onBlur={() => handleFieldBlur('notes')}
                        aria-invalid={Boolean(errors.notes)}
                        aria-describedby={errors.notes ? 'err-turno-consulta' : undefined}
                        placeholder="Contanos el síntoma, kilometraje o trabajo que necesitás presupuestar."
                        className="mt-1.5 w-full rounded-2xl bg-black/45 border border-white/25 px-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:border-[#2997FF] focus:outline-none focus:ring-2 focus:ring-[#2997FF]/40"
                      />
                      {errors.notes && (
                        <p id="err-turno-consulta" role="alert" className="mt-1.5 text-xs text-red-300">
                          {errors.notes}
                        </p>
                      )}
                    </div>

                    {/* Consentimiento Ley N° 18.331 */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.privacyAccepted}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const updated = { ...formData, privacyAccepted: checked };
                            setFormData(updated);
                            setTouched((p) => ({ ...p, privacyAccepted: true }));
                            const err = validateField('privacyAccepted', updated, todayISO);
                            setErrors((prev) => {
                              const copy = { ...prev };
                              if (err) copy.privacyAccepted = err;
                              else delete copy.privacyAccepted;
                              return copy;
                            });
                          }}
                          aria-invalid={Boolean(errors.privacyAccepted)}
                          aria-describedby={
                            errors.privacyAccepted ? 'err-turno-privacidad' : undefined
                          }
                          className="mt-1 h-4 w-4 rounded border-white/40 bg-black/50 text-[#0066CC] focus:ring-[#2997FF]"
                        />
                        <span className="text-xs leading-relaxed text-[#D2D2D7]">
                          Acepto el tratamiento de mis datos exclusivamente para coordinar este turno o presupuesto conforme a la{' '}
                          <button
                            type="button"
                            onClick={() => setActiveModal('privacy')}
                            className="font-semibold text-[#2997FF] underline underline-offset-2 hover:text-white"
                          >
                            Política de Privacidad (Ley N° 18.331)
                          </button>
                          .
                        </span>
                      </label>
                      {errors.privacyAccepted && (
                        <p id="err-turno-privacidad" role="alert" className="mt-1.5 text-xs text-red-300">
                          {errors.privacyAccepted}
                        </p>
                      )}
                    </div>

                    {/* Botón de confirmación */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={cooldownSeconds > 0}
                        className="min-h-[48px] px-7 rounded-full bg-white text-[#1D1D1F] text-sm font-semibold tracking-tight hover:bg-[#F5F5F7] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997FF]"
                      >
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {cooldownSeconds > 0
                            ? `Esperá ${cooldownSeconds}s para reenviar`
                            : 'Confirmar y preparar solicitud'}
                        </span>
                      </button>

                      <span className="text-[11px] text-[#D2D2D7] inline-flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-[#2997FF]" aria-hidden="true" />
                        <span>Sin envío automático oculto</span>
                      </span>
                    </div>
                  </form>

                  {/* Confirmación en pantalla + envío directo sanitizado por WhatsApp */}
                  {submittedRecord && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-950/45 p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            className="h-5 w-5 shrink-0 text-emerald-300 mt-0.5"
                            aria-hidden="true"
                          />
                          <div>
                            <h3 className="text-base font-semibold text-white">
                              Solicitud validada y registrada en pantalla ({submittedRecord.createdAt})
                            </h3>
                            <p className="mt-0.5 text-xs text-emerald-100/90">
                              Enviá el resumen verificado por WhatsApp al {BUSINESS_INFO.whatsappDisplay} o por correo electrónico.
                            </p>
                          </div>
                        </div>
                      </div>

                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-black/40 p-3.5 text-xs border border-white/10">
                        <div>
                          <dt className="text-[#D2D2D7]">Vehículo / Marca</dt>
                          <dd className="font-semibold text-white">
                            {submittedRecord.brand}
                            {submittedRecord.plate ? ` · ${submittedRecord.plate}` : ''}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#D2D2D7]">Servicio solicitado</dt>
                          <dd className="font-semibold text-white">{submittedRecord.service}</dd>
                        </div>
                        <div>
                          <dt className="text-[#D2D2D7]">Fecha preferida</dt>
                          <dd className="font-semibold text-white">{submittedRecord.date}</dd>
                        </div>
                        <div>
                          <dt className="text-[#D2D2D7]">Contacto</dt>
                          <dd className="font-semibold text-white">
                            {submittedRecord.name} ({submittedRecord.phone})
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-[#D2D2D7]">Consulta</dt>
                          <dd className="font-medium text-white break-words">
                            {submittedRecord.notes}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={submittedRecord.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] px-5 rounded-full bg-[#0066CC] text-white text-sm font-medium hover:bg-[#0071E3] transition-colors inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          <span>Enviar por WhatsApp ({BUSINESS_INFO.whatsappDisplay})</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>

                        <a
                          href={submittedRecord.mailtoUrl}
                          className="min-h-[44px] px-4 rounded-full bg-white/10 border border-white/25 text-white text-sm font-medium hover:bg-white/20 transition-colors inline-flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          <span>Enviar por Email</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 5. TESTIMONIOS REALES DE CLIENTES                                */}
        {/* ================================================================ */}
        <section id="testimonios" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 bg-[#F5F5F7]">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0066CC]">
                Experiencias Reales
              </p>
              <h2 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
                La confianza de quienes eligen nuestro taller año tras año.
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((item) => (
                <figure
                  key={item.id}
                  className={`rounded-[28px] p-6 sm:p-7 flex flex-col justify-between ${GLASS_LIGHT}`}
                >
                  <div>
                    <div
                      className="flex items-center gap-1 text-[#1D1D1F]"
                      aria-label="Valoración de 5 estrellas"
                    >
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-4 w-4 fill-[#1D1D1F] text-[#1D1D1F]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote className="mt-5 text-[17px] font-medium leading-relaxed text-[#1D1D1F]">
                      “{item.quote}”
                    </blockquote>
                  </div>

                  <figcaption className="mt-6 pt-4 border-t border-black/10">
                    <p className="text-sm font-semibold text-[#1D1D1F]">{item.author}</p>
                    <p className="text-xs text-[#6E6E73]">{item.context}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 6. UBICACIÓN, CONTACTO OFICIAL Y FOOTER SEGURO                   */}
        {/* ================================================================ */}
        <section id="contacto" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-6 bg-[#FBFBFD]">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B81D24]">
                Nueva Sede Única · Maldonado
              </p>
              <h2 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
                Todo en una única dirección para atenderte mejor.
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tarjeta dividida: Mapa y Ubicación */}
              <div className="lg:col-span-6 relative rounded-[28px] overflow-hidden bg-[#0A0A0C] text-white min-h-[360px] flex flex-col justify-between shadow-[0_16px_44px_rgba(0,0,0,0.14)]">
                <img
                  src={PHOTOS.alignment}
                  alt="Área de servicio mecánico y alineación de Taller Gospodinoff"
                  className="absolute inset-0 h-full w-full object-cover opacity-50"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/70 to-[#0A0A0C]/40"
                />

                <div className="relative p-6 sm:p-8 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white border border-white/25">
                    <span className="h-2 w-2 rounded-full bg-[#B81D24]" aria-hidden="true" />
                    <span>Nos mudamos · Dirección unificada</span>
                  </span>
                </div>

                <div className="relative p-4 sm:p-6">
                  <div className={`rounded-[22px] p-5 ${GLASS_DARK}`}>
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="h-5 w-5 shrink-0 text-[#2997FF] mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight text-white">
                          Taller Gospodinoff — Maldonado
                        </h3>
                        <p className="mt-1 text-sm text-[#D2D2D7]">{BUSINESS_INFO.address}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <a
                        href={BUSINESS_INFO.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] px-4 rounded-full bg-white text-[#1D1D1F] text-xs sm:text-sm font-semibold hover:bg-[#F5F5F7] transition-colors inline-flex items-center gap-2"
                      >
                        <Navigation className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                        <span>Abrir en Google Maps</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="min-h-[44px] px-4 rounded-full bg-white/10 border border-white/25 text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors inline-flex items-center gap-2"
                      >
                        {addressCopied ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                            <span>Dirección copiada</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" aria-hidden="true" />
                            <span>Copiar dirección</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta dividida: Canales oficiales verificados */}
              <div className={`lg:col-span-6 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between ${GLASS_LIGHT}`}>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                    Contacto Directo Verificado
                  </h3>
                  <p className="mt-2 text-sm text-[#6E6E73]">
                    Comunicate directamente con nuestro equipo técnico para consultas, repuestos o
                    coordinación de turnos.
                  </p>

                  <ul className="mt-6 space-y-3">
                    <li className="rounded-2xl bg-[#F5F5F7] p-4 border border-black/5 flex items-start gap-3.5">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#B81D24] shadow-xs">
                        <MapPin className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Dirección única
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-[#1D1D1F]">
                          {BUSINESS_INFO.address}
                        </p>
                      </div>
                    </li>

                    <li>
                      <a
                        href={BUSINESS_INFO.landlineHref}
                        className="min-h-[60px] rounded-2xl bg-[#F5F5F7] hover:bg-black/[0.04] transition-colors p-4 border border-black/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1D1D1F] shadow-xs">
                            <Phone className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                              Teléfono fijo
                            </p>
                            <p className="mt-0.5 text-base font-semibold text-[#1D1D1F]">
                              {BUSINESS_INFO.landlineDisplay}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#6E6E73]" aria-hidden="true" />
                      </a>
                    </li>

                    <li>
                      <a
                        href={directWhatsAppHello}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[60px] rounded-2xl bg-[#F5F5F7] hover:bg-black/[0.04] transition-colors p-4 border border-black/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066CC] text-white shadow-xs">
                            <MessageCircle className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                              Celular / WhatsApp
                            </p>
                            <p className="mt-0.5 text-base font-semibold text-[#1D1D1F]">
                              {BUSINESS_INFO.whatsappDisplay}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-[#0066CC]" aria-hidden="true" />
                      </a>
                    </li>

                    <li>
                      <a
                        href={BUSINESS_INFO.emailHref}
                        className="min-h-[60px] rounded-2xl bg-[#F5F5F7] hover:bg-black/[0.04] transition-colors p-4 border border-black/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0066CC] shadow-xs">
                            <Mail className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                              Email oficial
                            </p>
                            <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#1D1D1F] truncate">
                              {BUSINESS_INFO.email}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#6E6E73]" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer minimalista con sello de seguridad OWASP y modales legales activos */}
      <footer className="bg-[#F5F5F7] border-t border-black/10 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold tracking-tight text-[#1D1D1F]">
                {BUSINESS_INFO.name}
              </span>
              <span className="text-xs text-[#6E6E73]">· {BUSINESS_INFO.subtitle}</span>
            </div>
            <p className="text-xs text-[#6E6E73]">
              {BUSINESS_INFO.address} ·{' '}
              <a
                href={BUSINESS_INFO.domainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066CC] hover:underline"
              >
                gospodinoff.com.uy
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-[#1D1D1F] ${GLASS_LIGHT}`}
            >
              <Lock className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />
              <span>Conexión Segura HTTPS · Estándares OWASP</span>
            </span>

            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="min-h-[40px] px-3 rounded-full text-xs font-medium text-[#1D1D1F] hover:bg-black/5 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              <FileText className="h-3.5 w-3.5 text-[#6E6E73]" aria-hidden="true" />
              <span>Política de Privacidad</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('legal')}
              className="min-h-[40px] px-3 rounded-full text-xs font-medium text-[#1D1D1F] hover:bg-black/5 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              <Scale className="h-3.5 w-3.5 text-[#6E6E73]" aria-hidden="true" />
              <span>Aviso Legal</span>
            </button>
          </div>
        </div>
      </footer>

      <LegalModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
