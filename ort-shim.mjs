// Stellt die ONNX-Runtime (Browser-Build) als ES-Modul bereit.
// Wird von der Piper-Bibliothek über die Import-Map in index.html geladen.
const SRC = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/ort.wasm.min.js';

if (!window.ort) {
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SRC;
    s.onload = resolve;
    s.onerror = () => reject(new Error('ONNX Runtime konnte nicht geladen werden'));
    document.head.appendChild(s);
  });
}

export default window.ort;
