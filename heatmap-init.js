// heatmap-init.js — demo de mapa de calor con puntos aleatorios
document.addEventListener('DOMContentLoaded', function(){
  const container = document.getElementById('heatmapContainer');
  if(!container || typeof h337 === 'undefined') return;
  const heatmapInstance = h337.create({container: container, radius: 40});
  const points = [];
  const width = container.offsetWidth || 300;
  const height = container.offsetHeight || 200;
  const max = 50;
  for(let i=0;i<200;i++){
    points.push({ x: Math.floor(Math.random()*width), y: Math.floor(Math.random()*height), value: Math.floor(Math.random()*max) });
  }
  const data = { max: max, data: points };
  heatmapInstance.setData(data);
});