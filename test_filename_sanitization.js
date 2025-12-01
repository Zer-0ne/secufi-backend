// Test filename sanitization
function sanitizeFilename(filename) {
    return filename.replace(/[\\/:*?"<>|]/g, '_');
}

// Test cases
const testFilenames = [
    'Tata AIG Motor Review Proposal_3184_PR/24/6201148809.pdf',
    'Invoice/2024/January/12345.pdf',
    'Statement:Q1:2024.pdf',
    'Report*2024.pdf',
    'Document"2024.pdf',
    'File<2024>.pdf',
    'Report|2024.pdf',
    'Normal_Filename.pdf'
];

console.log('🧪 Testing Filename Sanitization:');
testFilenames.forEach(filename => {
    const sanitized = sanitizeFilename(filename);
    console.log(`Original: ${filename}`);
    console.log(`Sanitized: ${sanitized}`);
    console.log('---');
});