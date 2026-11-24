/* ThaiLoko careers - vanilla JS. Nothing is sent or stored anywhere. */
(function () {
  "use strict";

  var CONFIG = typeof TL_CONFIG !== "undefined" ? TL_CONFIG : { email: "", referencePrefix: "TL-2026-" };
  var JOBS = typeof TL_JOBS !== "undefined" ? TL_JOBS : [];

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function findJob(id) {
    for (var i = 0; i < JOBS.length; i++) if (JOBS[i].id === id) return JOBS[i];
    return null;
  }

  /* ---------- contact email (defined once in data/jobs.js) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-email-link]"), function (a) {
    a.textContent = CONFIG.email;
    a.setAttribute("href", "mailto:" + CONFIG.email);
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-email-text]"), function (s) {
    s.textContent = CONFIG.email;
  });

  var cardsBox = $("#cards");
  if (!cardsBox) return; // other pages need nothing else

  /* ---------- intro and channels ---------- */
  if (typeof TL_INTRO !== "undefined") $("#intro").textContent = TL_INTRO;
  if (typeof TL_CHANNELS !== "undefined") {
    TL_CHANNELS.forEach(function (c) { $("#channels").appendChild(el("li", null, c)); });
  }

  /* ---------- filters + search + cards ---------- */
  var AREAS = ["Todas", "Cocina", "Reparto", "Gestión"];
  var state = { area: "Todas", q: "" };
  var filtersBox = $("#filters");
  var searchInput = $("#q");
  var countBox = $("#count");
  var emptyBox = $("#empty");

  AREAS.forEach(function (a) {
    var b = el("button", { type: "button", "class": "chip", "aria-pressed": a === "Todas" ? "true" : "false" }, a);
    b.addEventListener("click", function () {
      state.area = a;
      Array.prototype.forEach.call(filtersBox.children, function (c) {
        c.setAttribute("aria-pressed", c === b ? "true" : "false");
      });
      render();
    });
    filtersBox.appendChild(b);
  });

  searchInput.addEventListener("input", function () { state.q = norm(searchInput.value.trim()); render(); });

  function haystack(j) {
    return norm([j.title, j.area, j.workplace, j.duties.join(" "), j.required.join(" "), j.nice.join(" ")].join(" "));
  }

  function render() {
    cardsBox.textContent = "";
    var shown = JOBS.filter(function (j) {
      return (state.area === "Todas" || j.area === state.area) && (!state.q || haystack(j).indexOf(state.q) !== -1);
    });
    shown.forEach(function (j) {
      var card = el("article", { "class": "card" });
      card.appendChild(el("span", { "class": "badge" }, j.area));
      var h = el("h3"); h.appendChild(document.createTextNode(j.title)); card.appendChild(h);
      var ul = el("ul", { "class": "meta" });
      [["Centro", j.shortWorkplace], ["Vacantes", String(j.vacancies)], ["Contrato", j.contractShort]].forEach(function (p) {
        var li = el("li"); li.appendChild(el("strong", null, p[0] + ": ")); li.appendChild(document.createTextNode(p[1])); ul.appendChild(li);
      });
      card.appendChild(ul);
      card.appendChild(el("p", { "class": "salary" }, j.salaryShort + " brutos/año"));
      var act = el("div", { "class": "actions" });
      var more = el("button", { type: "button", "class": "btn btn-outline" }, "Ver detalle");
      more.setAttribute("aria-label", "Ver detalle: " + j.title);
      more.addEventListener("click", function () { location.hash = "oferta-" + j.id; });
      var apply = el("button", { type: "button", "class": "btn btn-primary" }, "Aplicar");
      apply.setAttribute("aria-label", "Aplicar a: " + j.title);
      apply.addEventListener("click", function () { goToForm(j.id); });
      act.appendChild(more); act.appendChild(apply); card.appendChild(act);
      cardsBox.appendChild(card);
    });
    countBox.textContent = shown.length === 1 ? "1 oferta encontrada" : shown.length + " ofertas encontradas";
    emptyBox.hidden = shown.length !== 0;
  }

  /* ---------- modal (native <dialog>, with a minimal fallback) ---------- */
  var modal = $("#modal");
  var mTitle = $("#m-title");
  var mBody = $("#m-body");
  var currentJob = null;

  function section(title, content) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el("h3", null, title));
    if (Array.isArray(content)) {
      var ul = el("ul");
      content.forEach(function (t) { ul.appendChild(el("li", null, t)); });
      frag.appendChild(ul);
    } else {
      frag.appendChild(el("p", null, content));
    }
    return frag;
  }

  function openJob(id) {
    var j = findJob(id);
    if (!j) return;
    currentJob = j;
    mTitle.textContent = j.title;
    mBody.textContent = "";
    var dl = el("dl", { "class": "facts" });
    [["Área", j.area], ["Vacantes", String(j.vacancies)], ["Centro de trabajo", j.workplace], ["Contrato y jornada", j.contract], ["Retribución", j.salary]].forEach(function (p) {
      var box = el("div"); box.appendChild(el("dt", null, p[0])); box.appendChild(el("dd", null, p[1])); dl.appendChild(box);
    });
    mBody.appendChild(dl);
    mBody.appendChild(section("Funciones", j.duties));
    mBody.appendChild(section("Requisitos imprescindibles", j.required));
    mBody.appendChild(section("Se valorará", j.nice));
    mBody.appendChild(section("Ofrecemos", j.offer));
    mBody.appendChild(section("Cómo aplicar", j.how + " También puedes usar el formulario de esta página o escribir a " + CONFIG.email + "."));
    if (typeof modal.showModal === "function") { if (!modal.open) modal.showModal(); }
    else modal.setAttribute("open", "");
    mBody.scrollTop = 0; modal.scrollTop = 0;
  }

  function closeModal() {
    if (typeof modal.close === "function") { if (modal.open) modal.close(); }
    else modal.removeAttribute("open");
  }

  modal.addEventListener("close", function () {
    if (/^#oferta-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  });
  $("#m-close").addEventListener("click", closeModal);
  $("#m-close2").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); }); // click on backdrop
  $("#m-apply").addEventListener("click", function () { if (currentJob) goToForm(currentJob.id); });

  function onHash() {
    var m = /^#oferta-(.+)$/.exec(location.hash);
    if (m && findJob(m[1])) openJob(m[1]); else if (modal.open) closeModal();
  }
  window.addEventListener("hashchange", onHash);

  /* ---------- application form (simulation) ---------- */
  var form = $("#apply");
  var jobSelect = $("#job");
  var formCard = $("#form-card");
  var success = $("#success");
  var summary = $("#error-summary");
  var message = $("#message");
  var counter = $("#counter");

  jobSelect.appendChild(el("option", { value: "" }, "Selecciona un puesto…"));
  JOBS.forEach(function (j) { jobSelect.appendChild(el("option", { value: j.id }, j.title)); });

  function goToForm(id) {
    closeModal();
    if (/^#oferta-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    if (id) jobSelect.value = id;
    clearErrors();
    showForm();
    var target = $("#aplicar");
    target.scrollIntoView();
    window.setTimeout(function () { $("#name").focus(); }, 50);
  }

  function showForm() { success.hidden = true; formCard.hidden = false; }

  message.addEventListener("input", function () { counter.textContent = message.value.length + " / 800"; });

  var MAX_SIZE = 2 * 1024 * 1024;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^(?:\+34|0034)?[6-9]\d{8}$/;

  function clearErrors() {
    summary.hidden = true; summary.textContent = "";
    Array.prototype.forEach.call(form.querySelectorAll(".field"), function (f) {
      f.classList.remove("invalid");
      var inp = f.querySelector("input, select, textarea");
      if (inp) inp.removeAttribute("aria-invalid");
      var e = f.querySelector(".error"); if (e) e.textContent = "";
    });
  }

  function validate() {
    var errors = [];
    function add(field, inputId, msg) { errors.push({ field: field, id: inputId, msg: msg }); }

    var name = $("#name").value.trim();
    if (!name) add("name", "name", "Escribe tu nombre y apellidos.");
    else if (name.split(/\s+/).length < 2) add("name", "name", "Indica nombre y apellidos.");

    var email = $("#email").value.trim();
    if (!email) add("email", "email", "Escribe tu correo electrónico.");
    else if (!EMAIL_RE.test(email)) add("email", "email", "El correo no es válido. Ejemplo: nombre@dominio.es.");

    var phone = $("#phone").value.replace(/[\s.\-]/g, "");
    if (phone && !PHONE_RE.test(phone)) add("phone", "phone", "El teléfono no es válido. Usa el formato 612 345 678 o +34 612 345 678.");

    if (!jobSelect.value) add("job", "job", "Selecciona el puesto al que aplicas.");

    if (message.value.length > 800) add("message", "message", "El mensaje supera los 800 caracteres.");

    var file = $("#cv").files && $("#cv").files[0];
    if (!file) add("cv", "cv", "Adjunta tu currículum en PDF, DOC o DOCX.");
    else if (!/\.(pdf|doc|docx)$/i.test(file.name)) add("cv", "cv", "Formato no admitido. Usa PDF, DOC o DOCX.");
    else if (file.size === 0) add("cv", "cv", "El archivo está vacío.");
    else if (file.size > MAX_SIZE) add("cv", "cv", "El archivo pesa más de 2 MB. Reduce su tamaño e inténtalo de nuevo.");

    if (!$("#consent").checked) add("consent", "consent", "Debes aceptar el tratamiento de datos para enviar la candidatura.");
    return errors;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    var errors = validate();
    if (errors.length) {
      var ul = el("ul");
      errors.forEach(function (er) {
        var f = form.querySelector('[data-field="' + er.field + '"]');
        f.classList.add("invalid");
        $("#" + er.id).setAttribute("aria-invalid", "true");
        $("#err-" + er.field).textContent = er.msg;
        var li = el("li"), a = el("a", { href: "#" + er.id }, er.msg);
        a.addEventListener("click", function (ev) { ev.preventDefault(); $("#" + er.id).focus(); });
        li.appendChild(a); ul.appendChild(li);
      });
      summary.appendChild(el("p", null, errors.length === 1 ? "Hay 1 error en el formulario:" : "Hay " + errors.length + " errores en el formulario:"));
      summary.appendChild(ul);
      summary.hidden = false;
      summary.focus();
      return;
    }
    // Success: only a random on-screen reference. Nothing is sent or stored.
    var n = String(Math.floor(Math.random() * 9999) + 1);
    while (n.length < 4) n = "0" + n;
    $("#ref").textContent = CONFIG.referencePrefix + n;
    $("#done-job").textContent = findJob(jobSelect.value).title;
    formCard.hidden = true;
    success.hidden = false;
    success.scrollIntoView();
    success.focus();
  });

  $("#back").addEventListener("click", function () {
    form.reset();
    counter.textContent = "0 / 800";
    clearErrors();
    showForm();
    var t = $("#t-ofertas");
    t.setAttribute("tabindex", "-1");
    t.scrollIntoView();
    t.focus();
  });

  /* ---------- start ---------- */
  render();
  onHash();
})();
