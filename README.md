<p align="center">
  <img src="./assets/rendi-logo-horizontal.svg" alt="Rendi" width="420">
</p>

<p align="center">
  <strong>Mandá tus tickets por WhatsApp y Rendi te devuelve tus gastos ordenados en Excel.</strong>
</p>

<p align="center">
  <img alt="Estado" src="https://img.shields.io/badge/estado-en%20desarrollo-F59E0B">
  <img alt="Python" src="https://img.shields.io/badge/python-3.11%2B-0F766E">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-webhook-0F766E">
</p>

---

## ¿Qué es Rendi?

Rendi es una app que se conecta a la API de WhatsApp. Le mandás la foto o el PDF de un comprobante de compra (ticket o factura), extrae los datos y los guarda en una planilla de Excel prolija, lista para usar o para pasarle a tu contador.

## Cómo funciona

1. **Enviás el comprobante** por WhatsApp (PDF o imagen).
2. **Rendi lo recibe** a través del webhook de la WhatsApp Cloud API y descarga el archivo.
3. **Extrae los datos**: lee el texto del PDF, el QR de la factura electrónica o, si es una foto, usa OCR / un modelo con visión.
4. **Valida** los importes (neto + IVA = total), la fecha y detecta duplicados.
5. **Guarda y responde**: registra el comprobante y te confirma por el mismo chat. Cuando quieras, pedís el Excel y te lo devuelve.

## Datos que extrae

| Campo | Ejemplo |
|---|---|
| Fecha | 2026-11-13 |
| Comercio | Ferretería López |
| CUIT | 30-12345678-9 |
| Tipo y número de comprobante | Factura B 0004-00012345 |
| Neto | 10.330,58 |
| IVA | 2.169,42 |
| Total | 12.500,00 |
| Medio de pago | Débito |
| Archivo original | `comprobantes/2026-11/ferreteria-lopez.pdf` |

## Stack

- **Python 3.11+**
- **FastAPI**: webhook de WhatsApp
- **pdfplumber / PyMuPDF**: lectura de PDF con texto
- **OCR o modelo con visión**: fotos y escaneados
- **pyzbar / OpenCV**: lectura de QR de facturas electrónicas
- **SQLite**: base de datos de comprobantes
- **openpyxl**: generación del Excel

## Estructura del proyecto

```
rendi/
├── app/
│   ├── main.py            # Webhook (FastAPI)
│   ├── whatsapp.py        # Cliente de la Cloud API (descarga de media, respuestas)
│   ├── extraction/        # PDF, QR, OCR / visión
│   ├── validation.py      # Chequeos y detección de duplicados
│   ├── db.py              # Acceso a SQLite
│   └── export_excel.py    # Generación del .xlsx
├── assets/
│   └── rendi-logo-4-horizontal.svg
├── comprobantes/          # Archivos originales recibidos
├── .env.example
├── requirements.txt
└── README.md
```

## Instalación

```bash
git clone <url-del-repo> rendi
cd rendi

python -m venv .venv
source .venv/bin/activate        # En Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # Completá las variables (ver abajo)
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `WHATSAPP_TOKEN` | Token de acceso de la WhatsApp Cloud API |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número de teléfono de WhatsApp Business |
| `WHATSAPP_VERIFY_TOKEN` | Texto que elegís para verificar el webhook |
| `DATABASE_URL` | Ruta de la base de datos (por defecto, SQLite local) |

## Configurar el webhook

1. Creá una app en [Meta for Developers](https://developers.facebook.com/) y activá el producto **WhatsApp**.
2. Levantá el servidor:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
3. Para probar en local, exponé el puerto con un túnel (por ejemplo, ngrok):
   ```bash
   ngrok http 8000
   ```
4. En el panel de Meta, cargá la URL pública `https://<tu-tunel>/webhook` y el mismo `WHATSAPP_VERIFY_TOKEN` del `.env`.
5. Suscribite al evento `messages`.

## Uso

- Enviá una foto o un PDF de un comprobante al número configurado.
- Rendi te responde con los datos que leyó para que los confirmes.
- Escribí `excel` (o `excel octubre`) para recibir la planilla.

## Hoja de ruta

- [ ] Webhook y descarga de archivos desde WhatsApp
- [ ] Extracción de PDF con texto
- [ ] Lectura de QR de facturas electrónicas (ARCA)
- [ ] OCR / visión para fotos de tickets
- [ ] Validaciones y detección de duplicados
- [ ] Exportación a Excel con totales por mes y categoría
- [ ] Soporte para varios usuarios
- [ ] Categorización automática de gastos

## Licencia

Por definir.