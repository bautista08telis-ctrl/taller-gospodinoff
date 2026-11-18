import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const rootDir = path.resolve(import.meta.dirname);
const componentPath = path.join(rootDir, 'src', 'TallerGospodinoff.jsx');
const source = fs.readFileSync(componentPath, 'utf8');

// 1. Verificación estática de reglas OWASP en código fuente
assert.ok(!source.includes('dangerouslySetInnerHTML'), 'Prohibido dangerouslySetInnerHTML');
assert.ok(!/http:\/\/(?!localhost|127\.0\.0\.1)/i.test(source), 'Sin URLs inseguras http://');

const targetBlankMatches = [...source.matchAll(/target="_blank"[^>]*>/g)];
assert.ok(targetBlankMatches.length >= 4, 'Deben existir enlaces externos con target="_blank"');
for (const match of targetBlankMatches) {
  assert.ok(
    match[0].includes('rel="noopener noreferrer"'),
    `Falta rel="noopener noreferrer" en: ${match[0]}`
  );
}

// 2. Verificación funcional de sanitización, allowlists, honeypot y encodeURIComponent
const server = await createServer({
  root: rootDir,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
  appType: 'custom',
});

try {
  const mod = await server.ssrLoadModule('/src/TallerGospodinoff.jsx');

  // Sanitización XSS y límite de longitud
  assert.equal(
    mod.sanitizeInput('<script>alert(1)</script>Hola   mundo\u0000', 20, { collapseWhitespace: true }),
    'scriptalert(1)/scrip'
  );
  assert.equal(mod.sanitizeInput('Falla <img src=x>', 50, { collapseWhitespace: true }), 'Falla img src=x');

  // Validación estricta y trampa honeypot
  const today = mod.getLocalDateISO(0);
  const botAttempt = mod.validateAppointmentForm(
    {
      brand: 'Citroën',
      service: 'Diagnóstico',
      name: 'Juan Pérez',
      phone: '+598 99 123 456',
      plate: 'B-123456',
      date: mod.getLocalDateISO(1),
      notes: 'Control general de inyección',
      privacyAccepted: true,
      websiteUrl: 'https://spam.example',
    },
    today
  );
  assert.equal(botAttempt.isBotTrapTriggered, true, 'El honeypot debe detectar bots');

  // Rechazo de marca/servicio manipulados fuera de allowlist y XSS en notas
  const validSubmission = mod.validateAppointmentForm(
    {
      brand: 'Nissan',
      service: 'Tren delantero/Alineación',
      name: 'Ana <script> Silva',
      phone: '099 491 626',
      plate: 'b 998877',
      date: mod.getLocalDateISO(2),
      notes: 'Ruido en tren delantero & vibración',
      privacyAccepted: true,
      websiteUrl: '',
    },
    today
  );
  assert.equal(validSubmission.isValid, true);
  assert.equal(validSubmission.sanitized.plate, 'B 998877');
  assert.ok(!validSubmission.sanitized.name.includes('<'));

  const waUrl = mod.buildWhatsAppUrl(validSubmission.sanitized);
  assert.ok(waUrl.startsWith('https://wa.me/59899491626?text='), 'URL WhatsApp oficial requerida');
  assert.ok(!waUrl.includes('&vibración'), 'Caracteres especiales deben ir codificados con encodeURIComponent');
  assert.ok(waUrl.includes(encodeURIComponent('& vibración')), 'Parámetro codificado correctamente');

  const mailUrl = mod.buildMailtoUrl(validSubmission.sanitized);
  assert.ok(mailUrl.startsWith('mailto:mecanica@gospodinoff.com.uy?subject='));

  // Fecha pasada debe fallar
  const pastDateResult = mod.validateAppointmentForm(
    {
      brand: 'Renault',
      service: 'Otro',
      name: 'Carlos Gómez',
      phone: '4227 1626',
      plate: '',
      date: mod.getLocalDateISO(-1),
      notes: 'Consulta de presupuesto de embrague',
      privacyAccepted: true,
      websiteUrl: '',
    },
    today
  );
  assert.equal(pastDateResult.isValid, false);
  assert.ok(pastDateResult.errors.date, 'Debe rechazar fechas pasadas');

  console.log('SECURITY_SELF_CHECK_OK');
} finally {
  await server.close();
}
