// editor.js — editor básico usando Fabric.js con funciones: añadir texto, subir imagen, undo/redo, export PNG, save/load JSON.
(function(){
  // espera a que fabric esté disponible
  function ready(fn){
    if(typeof fabric !== 'undefined') return fn();
    var tries = 0;
    var id = setInterval(function(){
      tries++;
      if(typeof fabric !== 'undefined'){ clearInterval(id); fn(); }
      if(tries>30){ clearInterval(id); console.warn('Fabric no cargó'); }
    },200);
  }

  ready(function(){
    let canvas = new fabric.Canvas('c', { backgroundColor: '#ffffff' });
    canvas.setHeight(700);
    canvas.setWidth(1000);

    const state = {undos:[], redos:[]};

    function saveState(){
      try{
        const json = canvas.toJSON();
        state.undos.push(json);
        if(state.undos.length>50) state.undos.shift();
        state.redos = [];
      }catch(e){ console.warn(e); }
    }
    canvas.on('object:modified', saveState);
    canvas.on('object:added', saveState);

    document.getElementById('addText').addEventListener('click', ()=>{
      const text = new fabric.IText('Nuevo texto', { left: 100, top: 100, fontSize: 40, fill: document.getElementById('fillColor').value });
      canvas.add(text).setActiveObject(text);
      saveState();
    });

    document.getElementById('imgLoader').addEventListener('change', function(e){
      const f = e.target.files[0];
      if(!f) return;
      const reader = new FileReader();
      reader.onload = function(ev){
        fabric.Image.fromURL(ev.target.result, function(img){
          img.set({ left: 100, top: 100, scaleX: 0.6, scaleY: 0.6 });
          canvas.add(img).setActiveObject(img);
          saveState();
        });
      };
      reader.readAsDataURL(f);
    });

    document.getElementById('fillColor').addEventListener('input', ()=>{
      const obj = canvas.getActiveObject();
      if(obj && (obj.type==='i-text' || obj.type==='textbox')) obj.set('fill', document.getElementById('fillColor').value);
      canvas.renderAll();
    });

    document.getElementById('fontSize').addEventListener('change', ()=>{
      const val = parseInt(document.getElementById('fontSize').value,10)||40;
      const obj = canvas.getActiveObject();
      if(obj && obj.set) obj.set('fontSize', val);
      canvas.renderAll();
    });

    document.getElementById('opacity').addEventListener('input', ()=>{
      const v = parseFloat(document.getElementById('opacity').value);
      const obj = canvas.getActiveObject();
      if(obj && obj.set) obj.set('opacity', v);
      canvas.renderAll();
    });

    document.getElementById('bringForward').addEventListener('click', ()=>{ const o=canvas.getActiveObject(); if(o) canvas.bringForward(o); });
    document.getElementById('sendBack').addEventListener('click', ()=>{ const o=canvas.getActiveObject(); if(o) canvas.sendBackwards(o); });
    document.getElementById('delete').addEventListener('click', ()=>{ const o=canvas.getActiveObject(); if(o) canvas.remove(o); });

    document.getElementById('undoBtn').addEventListener('click', ()=>{
      if(state.undos.length>0){
        const last = state.undos.pop();
        state.redos.push(canvas.toJSON());
        canvas.loadFromJSON(last, canvas.renderAll.bind(canvas));
      }
    });
    document.getElementById('redoBtn').addEventListener('click', ()=>{
      if(state.redos.length>0){
        const next = state.redos.pop();
        state.undos.push(canvas.toJSON());
        canvas.loadFromJSON(next, canvas.renderAll.bind(canvas));
      }
    });

    document.getElementById('savePNG').addEventListener('click', ()=>{
      const dataURL = canvas.toDataURL({format:'png', multiplier:2});
      const a = document.createElement('a'); a.href = dataURL; a.download = 'design.png'; a.click();
    });

    document.getElementById('saveJSON').addEventListener('click', ()=>{
      const json = canvas.toJSON();
      let arr = JSON.parse(localStorage.getItem('saved_projects')||'[]');
      arr.push(json);
      localStorage.setItem('saved_projects', JSON.stringify(arr));
      alert('Proyecto guardado localmente (demo). Puedes ir a Proyectos para descargar.');
    });

    document.getElementById('loadJSON').addEventListener('click', ()=>{
      document.getElementById('loadFile').click();
    });
    document.getElementById('loadFile').addEventListener('change', function(e){
      const f = e.target.files[0];
      if(!f) return;
      const reader = new FileReader();
      reader.onload = function(ev){
        try{
          const json = JSON.parse(ev.target.result);
          canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
        }catch(er){ alert('JSON inválido'); }
      };
      reader.readAsText(f);
    });

    // template loader
    document.querySelectorAll('.tpl').forEach(btn=>{
      btn.addEventListener('click', function(){
        const url = this.dataset.url;
        fabric.loadSVGFromURL(url, function(objects, options){
          const obj = fabric.util.groupSVGElements(objects, options);
          canvas.clear(); canvas.add(obj); canvas.renderAll();
        }, function(err){ console.warn('Error cargando plantilla', err); });
      });
    });

    // basic keyboard shortcuts
    document.addEventListener('keydown', function(e){
      if((e.ctrlKey||e.metaKey) && e.key==='z'){ document.getElementById('undoBtn').click(); }
      if((e.ctrlKey||e.metaKey) && e.key==='y'){ document.getElementById('redoBtn').click(); }
    });

  }); // ready
})();