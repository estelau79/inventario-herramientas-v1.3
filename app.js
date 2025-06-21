const form = document.getElementById("formulario");
const registrosDiv = document.getElementById("registros");
const btnDescargar = document.getElementById("descargarExcel");
const modal = document.getElementById("modal-ayuda");
const btnAyuda = document.getElementById("btn-ayuda");
const spanClose = document.querySelector(".close");

let inventario = JSON.parse(localStorage.getItem("inventario")) || [];

form.addEventListener("submit", e => {
  e.preventDefault();
  const codigo = document.getElementById("codigo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const movimiento = document.getElementById("movimiento").value;
  const fecha = new Date().toLocaleString();

  inventario.push({ codigo, descripcion, movimiento, fecha });
  localStorage.setItem("inventario", JSON.stringify(inventario));
  form.reset();
  renderizar();
});

function renderizar() {
  registrosDiv.innerHTML = "";
  if (inventario.length === 0) {
    btnDescargar.style.display = "none";
    return;
  }

  inventario.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `${item.codigo} - ${item.descripcion} [${item.movimiento}] - ${item.fecha}`;
    registrosDiv.appendChild(div);
  });

  btnDescargar.style.display = "block";
}

btnDescargar.addEventListener("click", () => {
  const wb = XLSX.utils.book_new();
  const wsData = inventario.map(i => [i.codigo, i.descripcion, i.movimiento, i.fecha]);
  wsData.unshift(["Código", "Descripción", "Movimiento", "FechaHora"]);
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "InventarioActivo");
  const fecha = new Date().toLocaleDateString("es-AR").replace(/\//g, "-");
  XLSX.writeFile(wb, `inventario-esteban-${fecha}.xlsx`);
});

btnAyuda.onclick = () => modal.style.display = "block";
spanClose.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };

renderizar();