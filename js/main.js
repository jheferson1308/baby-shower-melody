const CONFIG = {
  nombreBebe: "MELODY AITHANA",
  nombrePadres: "Sheyla Nicol",

  fecha: "Sábado 5 de diciembre de 2026",
  diaSemana: "Sábado",
  numeroDia: "5",
  mes: "Diciembre",
  anio: 2026,
  hora: "22:00 HRS",
  fechaISO: "2026-12-05T22:00:00",

  direccion: "La Esperanza Ma L-8",
  urlUbicacion: "https://maps.app.goo.gl/Ebk99xYZZWMm1LKt8",
  urlMapaEmbed: "https://www.google.com/maps?q=-14.056126,-75.728339&z=17&output=embed",

  whatsappReservas: "51907744617",
  mensajeConMama: "Hola, confirmo mi asistencia al baby shower de Melody Aithana, el sábado 5 de diciembre a las 10:00 p.m. Voy con mamá. Mi nombre es: ",
  mensajeConPapa: "Hola, confirmo mi asistencia al baby shower de Melody Aithana, el sábado 5 de diciembre a las 10:00 p.m. Voy con papá. Mi nombre es: ",

  rutaMusica: "assets/musica.mp3",
  volumenMusica: 0.6,

  contadorActivo: true,
  mostrarScuttle: true,

  imagenes: {
    arielPortada: "assets/ariel-portada.png",
    arielConcha: "assets/ariel-concha.png",
    scuttle: "assets/scuttle.png"
  },

  compartir: {
    titulo: "¡Baby shower de Melody Aithana! 💜",
    descripcion: "Te invitamos a celebrar la llegada de nuestra pequeña sirena. Sábado 5 de diciembre, 22:00 HRS.",
    imagen: "assets/ariel-portada.png"
  },

  creditos: "✦ Fabricado por Colerson ✦",
  derechos: "© {anio} Colerson. Todos los derechos reservados. | Ica, Perú"
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (selector) => document.querySelector(selector);

function actualizarDerechos() {
  const destino = $("#derechos");
  const texto = CONFIG.derechos.replace("{anio}", String(new Date().getFullYear()));
  const separador = texto.indexOf("|");
  destino.textContent = "";

  if (separador === -1) {
    destino.textContent = texto;
    return;
  }

  const primera = document.createElement("span");
  primera.className = "pie__derechos-parte";
  primera.textContent = `${texto.slice(0, separador).trim()} |`;

  const segunda = document.createElement("span");
  segunda.className = "pie__derechos-parte";
  segunda.textContent = texto.slice(separador + 1).trim();

  destino.append(primera, document.createTextNode(" "), segunda);
}

function actualizarContenido() {
  $("#nombre-bebe").textContent = CONFIG.nombreBebe;
  $("#nombres-padres").textContent = CONFIG.nombrePadres;
  $("#direccion-texto").textContent = CONFIG.direccion;
  $("#fecha-dia").textContent = CONFIG.diaSemana;
  $("#fecha-numero").textContent = CONFIG.numeroDia;
  $("#fecha-mes").textContent = CONFIG.mes;
  $("#fecha-hora").textContent = CONFIG.hora;

  const query = encodeURIComponent(CONFIG.direccion);
  const maps = CONFIG.urlUbicacion.trim() || `https://www.google.com/maps/search/?api=1&query=${query}`;
  $("#btn-ubicacion").href = maps;
  $("#mapa-frame").src = CONFIG.urlMapaEmbed;
  $("#creditos").textContent = CONFIG.creditos;
  actualizarDerechos();

  const numero = String(CONFIG.whatsappReservas).replace(/[^0-9]/g, "");
  const base = `https://wa.me/${numero}?text=`;
  $("#btn-mama").href = base + encodeURIComponent(CONFIG.mensajeConMama);
  $("#btn-papa").href = base + encodeURIComponent(CONFIG.mensajeConPapa);
}

function configurarImagenes() {
  document.querySelectorAll("[data-imagen]").forEach((img) => {
    const ruta = CONFIG.imagenes[img.dataset.imagen];
    if (ruta) img.src = ruta;
  });

  document.querySelectorAll(".figura--scuttle").forEach((figura) => {
    figura.hidden = !CONFIG.mostrarScuttle;
  });
}

function meta(selector, atributo, valor, nombre) {
  let elemento = document.querySelector(selector);
  if (!elemento) {
    elemento = document.createElement("meta");
    if (nombre) elemento.setAttribute(nombre, selector.includes("og:") ? "property" : "name");
    document.head.appendChild(elemento);
  }
  elemento.setAttribute(atributo, valor);
}

function actualizarMeta() {
  const imagen = new URL(CONFIG.compartir.imagen, window.location.href).href;
  const titulo = CONFIG.compartir.titulo;
  const descripcion = CONFIG.compartir.descripcion;

  document.title = titulo;
  meta('meta[name="description"]', "content", descripcion);
  meta('meta[property="og:title"]', "content", titulo, "og:title");
  meta('meta[property="og:description"]', "content", descripcion, "og:description");
  meta('meta[property="og:image"]', "content", imagen, "og:image");
  meta('meta[name="twitter:card"]', "content", "summary_large_image");
  meta('meta[name="twitter:title"]', "content", titulo, "twitter:title");
  meta('meta[name="twitter:description"]', "content", descripcion, "twitter:description");
  meta('meta[name="twitter:image"]', "content", imagen, "twitter:image");
}

function configurarContador() {
  const bloque = $("#contador");
  const objetivo = new Date(CONFIG.fechaISO).getTime();
  if (!CONFIG.contadorActivo || !Number.isFinite(objetivo)) {
    bloque.hidden = true;
    return;
  }
  bloque.hidden = false;

  const actualizar = () => {
    const restante = Math.max(0, objetivo - Date.now());
    const dias = Math.floor(restante / 86400000);
    const horas = Math.floor((restante % 86400000) / 3600000);
    const minutos = Math.floor((restante % 3600000) / 60000);
    $("#contador-dias").textContent = String(dias).padStart(2, "0");
    $("#contador-horas").textContent = String(horas).padStart(2, "0");
    $("#contador-min").textContent = String(minutos).padStart(2, "0");
  };

  actualizar();
  window.setInterval(actualizar, 60000);
}

let reproduciendo = false;
let audio = null;

function prepararAudio() {
  if (audio) return;
  audio = $("#audio-fondo");
  audio.loop = true;
  audio.volume = CONFIG.volumenMusica;
  if (!audio.getAttribute("src")) audio.src = CONFIG.rutaMusica;
}

function actualizarBotonMusica(estaSonando) {
  reproduciendo = estaSonando;
  document.body.classList.toggle("sonando", estaSonando);
  const boton = $("#btn-musica");
  boton.setAttribute("aria-pressed", String(estaSonando));
  boton.setAttribute("aria-label", estaSonando ? "Pausar música de fondo" : "Reproducir música de fondo");
}

function sonar() {
  prepararAudio();
  const promesa = audio.play();
  if (promesa && typeof promesa.then === "function") {
    promesa.then(() => actualizarBotonMusica(true)).catch(() => actualizarBotonMusica(false));
  } else {
    actualizarBotonMusica(!audio.paused);
  }
}

function pausar() {
  prepararAudio();
  audio.pause();
  actualizarBotonMusica(false);
}

function alternarMusica() {
  if (reproduciendo) pausar();
  else sonar();
}

function configurarReveals() {
  const elementos = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visible"));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  elementos.forEach((elemento) => observador.observe(elemento));
}

function configurarParallax() {
  if (reduceMotion) return;
  const capas = document.querySelectorAll(".decor-capa");
  if (!capas.length) return;
  const factores = [0.06, 0.03, 0.09];
  let pendiente = false;

  const aplicar = () => {
    pendiente = false;
    const desplazamiento = window.scrollY || window.pageYOffset || 0;
    capas.forEach((capa, indice) => {
      const factor = factores[indice] || 0.04;
      capa.style.transform = `translate3d(0, ${desplazamiento * factor}px, 0)`;
    });
  };

  window.addEventListener("scroll", () => {
    if (pendiente) return;
    pendiente = true;
    window.requestAnimationFrame(aplicar);
  }, { passive: true });
  aplicar();
}

function configurarCierre() {
  const cierre = $(".cierre");
  if (!cierre) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    cierre.classList.add("celebrando");
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("celebrando");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.25 });
  observador.observe(cierre);
}

function celebrarApertura() {
  if (reduceMotion) return;
  const capa = document.createElement("div");
  capa.className = "celebracion";
  capa.setAttribute("aria-hidden", "true");
  const colores = ["#f6b0ad", "#c9a7e8", "#fff", "#f6d48a", "#9fd5c8", "#f3b8d3"];

  for (let i = 0; i < 22; i += 1) {
    const particula = document.createElement("i");
    if (i % 4 === 0) particula.className = "estrella";
    particula.style.setProperty("--x", `${Math.round(Math.random() * 100)}%`);
    particula.style.setProperty("--dx", `${Math.round(Math.random() * 160 - 80)}px`);
    particula.style.setProperty("--dy", `${Math.round(Math.random() * 120 - 60)}px`);
    particula.style.setProperty("--d", `${(Math.random() * 1.2).toFixed(2)}s`);
    particula.style.setProperty("--color", colores[i % colores.length]);
    capa.appendChild(particula);
  }

  document.body.appendChild(capa);
  window.setTimeout(() => capa.remove(), 4200);
}

let abriendo = false;
function abrirInvitacion() {
  if (abriendo || document.body.classList.contains("abierta")) return;
  abriendo = true;
  document.body.classList.add("abriendo");
  $("#pista-abrir").classList.add("pista-oculta");
  sonar();

  window.setTimeout(() => {
    document.body.classList.add("abierta");
    window.scrollTo(0, 0);
    configurarReveals();
    configurarCierre();
    celebrarApertura();
  }, reduceMotion ? 60 : 900);
}

function configurarMapa() {
  const contenedor = $("#mapa-contenedor");
  const capa = $("#mapa-capa");
  const marco = $("#mapa-frame");
  const error = $("#mapa-error");
  let cargado = false;

  marco.addEventListener("load", () => {
    cargado = true;
    error.hidden = true;
  });
  marco.addEventListener("error", () => {
    error.hidden = false;
  });
  window.setTimeout(() => {
    if (!cargado) error.hidden = false;
  }, 8000);

  capa.addEventListener("click", (evento) => {
    evento.stopPropagation();
    contenedor.classList.add("mapa-activo");
    capa.setAttribute("aria-hidden", "true");
  });
  document.addEventListener("click", (evento) => {
    if (!contenedor.contains(evento.target)) {
      contenedor.classList.remove("mapa-activo");
      capa.setAttribute("aria-hidden", "false");
    }
  });
}

function init() {
  actualizarContenido();
  configurarMapa();
  configurarImagenes();
  actualizarMeta();
  configurarContador();
  configurarParallax();

  $("#btn-abrir").addEventListener("click", abrirInvitacion);
  $("#btn-musica").addEventListener("click", alternarMusica);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pausar();
  });
  document.querySelectorAll(".pie__link").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => evento.preventDefault());
  });
}

init();
