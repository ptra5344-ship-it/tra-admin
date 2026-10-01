(function () {
  var id = localStorage.getItem("tra_id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("tra_id", id);
  }
  var bar = document.createElement("div");
  bar.style.cssText =
    "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99999;" +
    "background:rgba(0,0,0,.65);color:#fff;padding:4px 14px;border-radius:999px;" +
    "font:14px sans-serif;pointer-events:none";
  bar.innerHTML = '<span style="color:#4ade80">●</span> Online: <b id="tra-online">-</b>';
  document.body.appendChild(bar);
  function ping() {
    fetch("/api/ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.online !== undefined)
          document.getElementById("tra-online").textContent = d.online;
      })
      .catch(function () {});
  }
  ping();
  setInterval(ping, 30000);
})();
