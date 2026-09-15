(function () {
  var PALETTES = [["citruspop","Citrus Pop — orange + pink","#ffffff","#111111","#FF7A00","#FF3EA5"],["babe","Babe — cherry + cream","#FFF8F0","#2B1C14","#7A1F2B","#FF4D5E"]]; var FONTSETS = [["oswald","Oswald"]];
  var KEYS = ["palette","font"];
  var root = document.documentElement;
  var state = {"palette":"citruspop","font":"oswald","hidden":true};
  try { Object.assign(state, JSON.parse(localStorage.getItem("ariel-r6") || "{}")); } catch (e) {}
  var q = new URLSearchParams(location.search);
  KEYS.forEach(function (k) { if (q.get(k)) state[k] = q.get(k); });
  function save() { try { localStorage.setItem("ariel-r6", JSON.stringify(state)); } catch (e) {} }
  var bar = document.createElement("div"); bar.id = "draft-bar";
  var h = '<span class="l">Choose</span><span class="g"><span class="l">Color</span>';
  PALETTES.forEach(function (p) { h += '<button data-k="palette" data-v="' + p[0] + '"><span class="sw" style="background:' + p[4] + ';box-shadow:-5px 0 0 -1px ' + p[5] + '"></span>' + p[1] + '</button>'; });
  h += '</span><span class="sp"></span><button id="draft-hide">Hide</button>';
  h += '<span class="br"></span><span class="g"><span class="l">Name font</span>';
  FONTSETS.forEach(function (t) { h += '<button data-k="font" data-v="' + t[0] + '">' + t[1] + '</button>'; });
  h += '</span>';
  bar.innerHTML = h; document.body.appendChild(bar);
  var show = document.createElement("button"); show.id = "draft-show"; show.textContent = "Choose color and font"; document.body.appendChild(show);
  function measure() { document.body.style.setProperty("--bar", state.hidden ? "0px" : bar.offsetHeight + "px"); }
  var favicon = document.querySelector('link[rel="icon"]');
  function updateFavicon() {
    var p = PALETTES.filter(function (p) { return p[0] === state.palette; })[0] || PALETTES[0];
    var bg = p[4], accent = p[5];
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
      "<rect width='64' height='64' fill='" + bg + "'/>" +
      "<text x='4' y='47' font-family='Arial Narrow, Impact, sans-serif' font-weight='700' font-size='38' fill='#fff'>A H</text>" +
      "<rect x='29' y='16' width='3' height='30' fill='" + accent + "'/>" +
      "</svg>";
    if (favicon) favicon.setAttribute("href", "data:image/svg+xml," + encodeURIComponent(svg));
  }
  function apply() {
    KEYS.forEach(function (k) { root.setAttribute("data-" + k, state[k]); });
    document.body.classList.toggle("draft-hidden", !!state.hidden);
    document.querySelectorAll("#draft-bar [data-k]").forEach(function (b) { b.classList.toggle("on", state[b.dataset.k] === b.dataset.v); });
    updateFavicon();
    measure();
  }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "draft-hide") { state.hidden = true; save(); apply(); return; }
    if (b.dataset.k) { state[b.dataset.k] = b.dataset.v; save(); apply(); }
  });
  show.addEventListener("click", function () { state.hidden = false; save(); apply(); });
  window.addEventListener("resize", measure);
  save(); apply();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  setTimeout(measure, 300);

  // The rail follows the scroll
  var links = document.querySelectorAll(".rail a");
  var secs = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var rail = document.querySelector(".rail");
  var railTimer, railHovered = false;
  function spy() {
    var y = window.scrollY + window.innerHeight * 0.45; var cur = "top";
    secs.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + cur); });
    clearTimeout(railTimer);
    if (cur === "top") { rail.classList.remove("visible"); return; }
    rail.classList.add("visible");
    if (!railHovered) railTimer = setTimeout(function () { rail.classList.remove("visible"); }, 1200);
  }
  rail.addEventListener("mouseenter", function () { railHovered = true; clearTimeout(railTimer); });
  rail.addEventListener("mouseleave", function () {
    railHovered = false;
    if (rail.classList.contains("visible")) railTimer = setTimeout(function () { rail.classList.remove("visible"); }, 1200);
  });
  window.addEventListener("scroll", spy, { passive: true }); window.addEventListener("resize", spy); spy();
})();
function sendMail(f) {
  location.href = "mailto:ariych31@gmail.com?subject=" + encodeURIComponent("Website message from " + f.name.value) + "&body=" + encodeURIComponent(f.message.value + "\n\nFrom: " + f.name.value + " <" + f.email.value + ">");
  return false;
}
