<p align="center">
  <img src="./assets/rendi-logo-horizontal.svg" alt="Rendi" width="420">
</p>

<p align="center">
  <strong>Mandá tus facturas por Telegram y Rendi te devuelve tus gastos ordenados en Excel.</strong>
</p>

<p align="center">
  <img alt="Estado" src="https://img.shields.io/badge/estado-en%20dise%C3%B1o-F59E0B">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-NestJS-0F766E">
  <img alt="Telegram" src="https://img.shields.io/badge/canal-Telegram-0F766E">
</p>

---

## ¿Qué es Rendi?

Rendi es un bot de Telegram para comercios, monotributistas y sus contadores. El cliente le manda el PDF de una factura electrónica al bot, Rendi extrae los datos y los guarda en una planilla de Excel prolija, lista para pasarle al contador a fin de mes.

Hoy ese proceso es manual: se guardan los tickets y se entregan en papel o en fotos sueltas. Rendi busca reemplazar ese cajón de comprobantes.

## Para quién

- **Clientes de un estudio contable** (comercios y monotributistas): mandan los comprobantes desde el celular.
- **Contadores**: reciben todo ordenado, sin tener que tipear ni perseguir tickets.

## Cómo funciona

1. **El cliente envía el comprobante** al bot de Telegram (por ahora, PDF de factura electrónica).
2. **Rendi lo recibe** por webhook y descarga el archivo.
3. **Extrae los datos**: lee el texto del PDF y el QR de la factura electrónica.
4. **Valida** importes, fecha y duplicados.
5. **Guarda el comprobante.** Si algo no se pudo leer con certeza, queda marcado como **"revisar"** en lugar de descartarse.
6. **Responde** por el mismo chat y, cuando se pide, genera el Excel.

## Datos que extrae

| Campo | Ejemplo | De dónde sale |
|---|---|---|
| Fecha | 2026-11-13 | QR |
| CUIT del emisor | 30-12345678-9 | QR |
| Tipo y número | Factura B 0004-00012345 | QR |
| Total | 12.500,00 | QR |
| Neto e IVA | 10.330,58 / 2.169,42 | Texto del PDF |
| Razón social del emisor | Ferretería López | Texto del PDF |
| Estado | `ok` / `revisar` | Validaciones |
| Archivo original | `comprobantes/2026-11/ferreteria-lopez.pdf` | Telegram |

> El QR de las facturas electrónicas de ARCA trae fecha, CUIT, punto de venta, tipo, número e importe total, pero no el desglose de neto e IVA. Ese dato hay que leerlo del texto del PDF.

## Stack

| Pieza | Herramienta |
|---|---|
| Lenguaje y runtime | TypeScript (modo estricto) sobre Node.js LTS |
| Framework | NestJS |
| Canal | Telegram Bot API (grammY o `nestjs-telegraf`, a decidir al empezar) |
| Validación | `class-validator` + `ValidationPipe` |
| Base de datos | SQLite + Prisma |
| Texto de PDF | `unpdf` o `pdfjs-dist` |
| QR | PDF a imagen + `jsQR` o `zxing-wasm` |
| Excel | ExcelJS |
| Tareas programadas | `@nestjs/schedule` |
| Configuración | `@nestjs/config` |
| Tests | Jest |
| Despliegue | Docker en un VPS |

## Por qué Telegram

- La Bot API es gratuita y se crea el bot en minutos con @BotFather, sin verificación de empresa.
- No hay ventana de 24 horas ni plantillas de mensajes: el bot puede responder cuando quiera a quien ya le escribió.
- En desarrollo se puede usar *long polling*, así que no hace falta túnel público para probar.
- El webhook se protege con un token secreto que Telegram envía en un header.
- **Riesgo comercial a validar:** los clientes de un contador en Argentina usan más WhatsApp que Telegram. Antes de vender, conviene confirmar con contadores reales que sus clientes aceptarían instalar y usar Telegram.

## Arquitectura

El canal de mensajería queda aislado detrás de una interfaz, para poder sumar WhatsApp más adelante sin tocar el resto del sistema.

```
src/
├── channels/
│   ├── channel.interface.ts   # Contrato: recibir archivo, responder texto, enviar archivo
│   └── telegram/              # Implementación para Telegram
├── clientes/                  # Quién es cada cliente del estudio
├── comprobantes/              # Guardado, estados (ok / revisar), duplicados
├── extraction/                # Lectura de PDF y QR
├── excel/                     # Generación del .xlsx
├── app.module.ts
└── main.ts
prisma/
└── schema.prisma
assets/
└── rendi-logo-4-horizontal.svg
```

## Modelo de despliegue

- **Una instalación por cliente**, con su propio bot de Telegram y su propio archivo SQLite.
- Backup simple: copiar un archivo.
- Modelo comercial: abono mensual con mantenimiento incluido.

## Instalación

```bash
git clone <url-del-repo> rendi
cd rendi

npm install
cp .env.example .env        # Completá las variables (ver abajo)

npx prisma migrate dev
npm run start:dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token que te da @BotFather al crear el bot |
| `TELEGRAM_WEBHOOK_SECRET` | Texto secreto para validar que los mensajes vienen de Telegram |
| `PUBLIC_URL` | URL pública HTTPS del servidor (solo en producción) |
| `DATABASE_URL` | Ruta de la base SQLite, por ejemplo `file:./rendi.db` |

## Crear y conectar el bot

1. En Telegram, hablá con **@BotFather**, ejecutá `/newbot` y guardá el token.
2. **Desarrollo:** el bot usa *long polling*, no necesitás exponer el servidor.
3. **Producción:** registrá el webhook con tu URL pública y el secreto:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d "url=https://<tu-dominio>/telegram/webhook" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```
4. El servidor debe rechazar cualquier request que no traiga el header `X-Telegram-Bot-Api-Secret-Token` correcto.

## Uso (propuesta inicial)

- `/start`: el cliente se presenta (la forma de identificarlo está por definir).
- Enviar un PDF de factura: el bot lo procesa y responde con el resumen.
- `/excel`: recibe la planilla del mes.

## Límites a tener en cuenta

- Telegram permite que el bot descargue archivos de hasta 20 MB, suficiente para facturas en PDF.
- Un bot no puede escribirle primero a alguien que nunca lo inició: el cliente siempre tiene que ejecutar `/start`.
- Los datos de los comprobantes incluyen CUIT y montos de terceros: hay que cuidar dónde se guardan y quién accede (Ley 25.326 de protección de datos personales).
- El Excel es una ayuda administrativa y no reemplaza el registro contable ni fiscal.

## Decisiones pendientes

- [ ] "Cliente" de la instalación: ¿un estudio contable o cada comercio?
- [ ] Cómo se identifica quién escribe (alta previa por el contador, o auto-registro con un código).
- [ ] Qué responde el bot al recibir un comprobante (confirmación simple o resumen).
- [ ] Cómo recibe el contador el Excel y cómo corrige los comprobantes en "revisar".
- [ ] Qué hacer con audios, texto suelto y varios archivos juntos.
- [ ] Validar con contadores reales que sus clientes usarían Telegram.

## Hoja de ruta

- [ ] "Hola mundo" en NestJS: recibir un mensaje del bot
- [ ] Recibir y descargar un PDF desde Telegram
- [ ] Extracción de texto y QR de facturas electrónicas
- [ ] Validaciones, duplicados y estado "revisar"
- [ ] Exportación a Excel con totales por mes
- [ ] Identificación de clientes
- [ ] Despliegue con Docker en un VPS
- [ ] Soporte para fotos de tickets (OCR o visión)
- [ ] Segundo canal: WhatsApp

## Licencia

Por definir.