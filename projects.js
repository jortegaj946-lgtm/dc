document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById('projectsList');
  const data = localStorage.getItem('saved_projects');
  if (!data) {
    list.innerHTML = '<p>No hay proyectos guardados (demo)</p>';
    return;
  }
  try {
    const arr = JSON.parse(data);
    arr.forEach((p, i) => {
      const d = document.createElement('div');
      d.className = 'proj';
      d.innerHTML = `<strong>Proyecto ${(i + 1)}</strong> 
        <button onclick="download(${i})">Descargar JSON</button>`;
      list.appendChild(d);
    });
    window.download = function (i) {
      const blob = new Blob([JSON.stringify(arr[i])], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'project_' + (i + 1) + '.json';
      a.click();
    }
  } catch (e) {
    list.innerHTML = '<p>Error cargando proyectos</p>';
  }
});