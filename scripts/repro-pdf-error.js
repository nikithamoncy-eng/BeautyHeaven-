
const pdfLib = require('pdf-parse');
const fs = require('fs');

// Polyfill DOMMatrix if missing (Minimal for PDF.js to load)
if (typeof DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {
        constructor() {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
            this.m11 = 1; this.m12 = 0; this.m21 = 0; this.m22 = 1; this.m31 = 0; this.m32 = 0;
            this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
        }
        setMatrixValue() { return this; }
        multiply() { return this; }
        translate() { return this; }
        scale() { return this; }
        toString() { return 'matrix(1, 0, 0, 1, 0, 0)'; }
    };
}

async function testPdfParse() {
    console.log('Testing pdf-parse...');
    console.log('pdfLib type:', typeof pdfLib);
    console.log('pdfLib keys:', Object.keys(pdfLib));

    // Check if it's a default export or named
    const PDFParse = pdfLib.PDFParse || pdfLib.default || pdfLib;

    try {
        const dummyBuffer = Buffer.from('%PDF-1.4\n1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n3 0 obj <</Type /Page /MediaBox [0 0 612 792] /Resources <<>> /Parent 2 0 R>> endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer <</Size 4 /Root 1 0 R>>\nstartxref\n200\n%%EOF');

        console.log('Attempting to parse PDF buffer with v2 API...');
        const parser = new PDFParse({ data: dummyBuffer });
        const result = await parser.getText();
        await parser.destroy();

        console.log('Parsed successfully:', result.text);

    } catch (error) {
        console.error('Error:', error);
    }
}

testPdfParse();
