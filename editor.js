// editor.js — Editor visual para CrearDiseños con Fabric.js y funciones de plantillas y proyectos

window.addEventListener('DOMContentLoaded', function(){
  if(typeof fabric === 'undefined'){
    alert("No se cargó fabric.js. Agrega el CDN en tu HTML.");
    return;
  }
  // Canvas global para fácil acceso desde otras funciones
  const canvas = new fabric.Canvas('c', { backgroundColor: '#fff' });
  window.canvas = canvas;

  // Estado de historial para deshacer/rehacer
  let state = [];
  let current = -1;
  function saveState() {
    state = state.slice(0, current + 1);
    state.push(JSON.stringify(canvas));
    current++;
  }
  // Guarda estado en acciones relevantes
  canvas.on('object:added', saveState);
  canvas.on('object:modified', saveState);

  // Añadir texto
  document.getElementById('addText')?.addEventListener('click', () => {
    const text = new fabric.IText('Texto de ejemplo', { left: 100, top: 100, fontSize: 36, fill: "#2563eb" });
    canvas.add(text).setActiveObject(text);
  });

  // Añadir rectángulo
  document.getElementById('addRect')?.addEventListener('click', () => {
    const rect = new fabric.Rect({
      left: 120, top: 80, fill: '#6366f1', width: 130, height: 80
    });
    canvas.add(rect).setActiveObject(rect);
  });

  // Añadir círculo
  document.getElementById('addCircle')?.addEventListener('click', () => {
    const circle = new fabric.Circle({
      left: 200, top: 120, fill: '#2563eb', radius: 50
    });
    canvas.add(circle).setActiveObject(circle);
  });

  // Añadir línea
  document.getElementById('addLine')?.addEventListener('click', () => {
    const line = new fabric.Line([20, 60, 200, 60], {
      left: 60, top: 170, stroke: '#18181b', strokeWidth: 4
    });
    canvas.add(line).setActiveObject(line);
  });

  // Subir imagen
  document.getElementById('imgLoader')?.addEventListener('change', function(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      fabric.Image.fromURL(ev.target.result, img => {
        img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 });
        canvas.add(img);
      });
    };
    reader.readAsDataURL(f);
  });

  // Cargar plantilla SVG demo
  document.getElementById('loadTemplateBtn')?.addEventListener('click', function(){
    fabric.loadSVGFromURL('sample_template.svg', function(objects, options){
      const obj = fabric.util.groupSVGElements(objects, options);
      canvas.clear();
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
      saveState();
    });
  });

  // Exportar PNG
  document.getElementById('exportPNG')?.addEventListener('click', () => {
    const url = canvas.toDataURL({format: 'png'});
    const a = document.createElement('a');
    a.href = url; a.download = 'design.png'; a.click();
  });

  // Deshacer
  document.getElementById('undoBtn')?.addEventListener('click', ()=>{
    if(current > 0){
      current--;
      canvas.loadFromJSON(state[current], canvas.renderAll.bind(canvas));
    }
  });

  // Rehacer
  document.getElementById('redoBtn')?.addEventListener('click', ()=>{
    if(current < state.length - 1){
      current++;
      canvas.loadFromJSON(state[current], canvas.renderAll.bind(canvas));
    }
  });

  // Eliminar objeto
  document.getElementById('deleteBtn')?.addEventListener('click', ()=>{
    const obj = canvas.getActiveObject();
    if(obj) canvas.remove(obj);
  });

  // Guardar proyecto en localStorage
  document.getElementById('saveProject')?.addEventListener('click', ()=>{
    const json = canvas.toJSON();
    let arr = JSON.parse(localStorage.getItem('saved_projects')||'[]');
    arr.push(json);
    localStorage.setItem('saved_projects', JSON.stringify(arr));
    alert('Proyecto guardado localmente. Puedes verlo en la sección "Proyectos".');
  });

  // Cargar proyecto (archivo JSON)
  document.getElementById('loadProject')?.addEventListener('click', ()=>{
    document.getElementById('loadProjectFile').click();
  });
  document.getElementById('loadProjectFile')?.addEventListener('change', function(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      try{
        const json = JSON.parse(ev.target.result);
        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
      }catch(er){ alert('Archivo JSON inválido'); }
    };
    reader.readAsText(f);
  });

});