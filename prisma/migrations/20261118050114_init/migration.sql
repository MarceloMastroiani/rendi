-- CreateTable
CREATE TABLE "Comprobante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estado" TEXT NOT NULL DEFAULT 'REVISAR',
    "origen" TEXT,
    "motivoRevision" TEXT,
    "fechaEmision" DATETIME,
    "emisorCuit" TEXT,
    "emisorNombre" TEXT,
    "tipoComprobante" INTEGER,
    "puntoVenta" INTEGER,
    "numero" INTEGER,
    "cae" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'PES',
    "total" BIGINT,
    "netoGravado" BIGINT,
    "iva" BIGINT,
    "archivoNombre" TEXT,
    "archivoMime" TEXT NOT NULL,
    "archivoBytes" INTEGER NOT NULL,
    "archivoHash" TEXT NOT NULL,
    "archivoRuta" TEXT NOT NULL,
    "qrRaw" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_archivoHash_key" ON "Comprobante"("archivoHash");

-- CreateIndex
CREATE INDEX "Comprobante_fechaEmision_idx" ON "Comprobante"("fechaEmision");

-- CreateIndex
CREATE INDEX "Comprobante_estado_idx" ON "Comprobante"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_emisorCuit_tipoComprobante_puntoVenta_numero_key" ON "Comprobante"("emisorCuit", "tipoComprobante", "puntoVenta", "numero");
