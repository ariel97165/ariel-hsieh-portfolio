(function () {
  var PALETTES = [["bottle-neon","Bottle + neon","#ffffff","#111111","#0E3D2C","#FF1F8F"],["babe","Babe — cherry + cream","#FFF8F0","#2B1C14","#7A1F2B","#FF4D5E"],["fay","Fay — sun + teal","#ffffff","#111111","#0B6E68","#FFC93C"],["lantern","Lantern — red + gold","#160D0D","#FBE9D9","#ffffff","#F4B740"],["encore","Encore — coral + turquoise","#ffffff","#111111","#0FB5AE","#FF6B4A"],["citruspop","Citrus Pop — orange + pink","#ffffff","#111111","#FF7A00","#FF3EA5"]]; var FONTSETS = [["oswald","Oswald"]];
  var KEYS = ["palette","font"];
  var root = document.documentElement;
  var state = {"palette":"babe","font":"oswald","hidden":true};
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
  function apply() {
    KEYS.forEach(function (k) { root.setAttribute("data-" + k, state[k]); });
    document.body.classList.toggle("draft-hidden", !!state.hidden);
    document.querySelectorAll("#draft-bar [data-k]").forEach(function (b) { b.classList.toggle("on", state[b.dataset.k] === b.dataset.v); });
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
