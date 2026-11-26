// route_km_markers.js
// ===================
// סימוני קילומטרים לאורך קו מסלול על המפה: עיגול בצבע המסלול עם מספר הק"מ מתחילת
// המסלול (נוסף 26.11.2026, לבקשת המשתמש). נטען אחרי leaflet.js.
//
// - רק לקו שנוצר עם { kmMarkers: true } (לא לקווי רשת/גבולות אזור).
// - מוצג כברירת מחדל. הדלקה/כיבוי לכל קו בנפרד: RouteKmMarkers.toggle(line) -
//   מחובר ללחיצה על אורך המסלול: במקרא (catalog.html), בכרטיס הקובץ
//   (gps_upload.html), ובשדה "מרחק" שמעל המפה (gpx_cleaner.html).
// - המרווח משתנה לפי הזום (1/2/5/10/20/50/100 ק"מ) כך שהסימנים לא נערמים,
//   ומצוירים רק בתחום הנראה - כמו חיצי הכיוון ב-route_arrows.js.
// - המרחק המצטבר מחושב בנוסחת haversine על כל נקודות הקובץ - אותה שיטה כמו
//   gpx_analyzer.py, כך שהסימון האחרון תואם לאורך שמוצג במקרא. בקובץ עם כמה
//   מקטעים המרחק ממשיך להצטבר, והקפיצה בין סוף מקטע לתחילת הבא לא נספרת.
(function () {
  if (!window.L) return;

  var STEPS_KM = [1, 2, 5, 10, 20, 50, 100];
  var MIN_GAP_PX = 70;      // מרווח מינימלי על המסך בין שני סימנים
  var MAX_MARKERS = 600;
  var R_KM = 6371.0088;

  var css = document.createElement('style');
  css.textContent =
    '.route-km-marker{background:none;border:none}' +
    '.route-km-marker span{position:absolute;left:0;top:0;transform:translate(-50%,-50%);' +
      'min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:10px;' +
      'border:2px solid #fff;color:#fff;font:700 11px/16px Assistant,Arial,sans-serif;' +
      'text-align:center;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.45)}';
  document.head.appendChild(css);

  function haversineKm(a, b) {
    var toRad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * toRad, dLon = (b.lng - a.lng) * toRad;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(a.lat * toRad) * Math.cos(b.lat * toRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R_KM * Math.asin(Math.min(1, Math.sqrt(s)));
  }

  function kmIcon(color, km) {
    return L.divIcon({
      className: 'route-km-marker',
      iconSize: [0, 0],
      html: '<span style="background:' + color + '">' + km + '</span>'
    });
  }

  var KmLayer = L.LayerGroup.extend({
    initialize: function (line) {
      L.LayerGroup.prototype.initialize.call(this);
      this._line = line;
      this._segs = null;   // [{pts:[LatLng], cum:[km]}] - מחושב פעם אחת
    },
    onAdd: function (map) {
      L.LayerGroup.prototype.onAdd.call(this, map);
      map.on('moveend', this._redraw, this);
      this._redraw();
    },
    onRemove: function (map) {
      map.off('moveend', this._redraw, this);
      L.LayerGroup.prototype.onRemove.call(this, map);
    },
    _prepare: function () {
      var segs = this._line.getLatLngs();
      if (segs.length && segs[0] instanceof L.LatLng) segs = [segs];
      var total = 0;
      this._segs = segs.map(function (pts) {
        var cum = [total];
        for (var i = 1; i < pts.length; i++) {
          total += haversineKm(pts[i - 1], pts[i]);
          cum.push(total);
        }
        return { pts: pts, cum: cum };
      });
    },
    _step: function (map) {
      // ק"מ אחד בפיקסלים, בזום הנוכחי ובקו הרוחב של מרכז המפה
      var lat = map.getCenter().lat * Math.PI / 180;
      var metersPerPx = 40075016.686 * Math.cos(lat) / Math.pow(2, map.getZoom() + 8);
      var pxPerKm = 1000 / metersPerPx;
      for (var i = 0; i < STEPS_KM.length; i++) {
        if (STEPS_KM[i] * pxPerKm >= MIN_GAP_PX) return STEPS_KM[i];
      }
      return STEPS_KM[STEPS_KM.length - 1];
    },
    _redraw: function () {
      var map = this._map;
      if (!map) return;
      this.clearLayers();
      if (!this._segs) this._prepare();
      var color = this._line.options.color || '#3388ff';
      var step = this._step(map);
      var view = map.getBounds().pad(0.2);
      var count = 0;
      var next = step;
      for (var s = 0; s < this._segs.length && count < MAX_MARKERS; s++) {
        var pts = this._segs[s].pts, cum = this._segs[s].cum;
        for (var i = 1; i < pts.length && count < MAX_MARKERS; i++) {
          var d0 = cum[i - 1], d1 = cum[i];
          while (next <= d1 && count < MAX_MARKERS) {
            var t = d1 > d0 ? (next - d0) / (d1 - d0) : 0;
            var p = L.latLng(pts[i - 1].lat + (pts[i].lat - pts[i - 1].lat) * t,
                             pts[i - 1].lng + (pts[i].lng - pts[i - 1].lng) * t);
            if (view.contains(p)) {
              this.addLayer(L.marker(p, {
                icon: kmIcon(color, next), interactive: false, keyboard: false, zIndexOffset: 500
              }));
              count++;
            }
            next += step;
          }
        }
      }
    }
  });

  function show(line) { if (line._map && !line._kmLayer._map) line._map.addLayer(line._kmLayer); }
  function hide(line) { if (line._kmLayer._map) line._kmLayer._map.removeLayer(line._kmLayer); }

  L.Polyline.addInitHook(function () {
    if (this instanceof L.Polygon || !this.options.kmMarkers) return;
    this._kmLayer = new KmLayer(this);
    this._kmOn = true;   // ברירת מחדל: מוצג
    this.on('add', function () { if (this._kmOn) show(this); });
    this.on('remove', function () { hide(this); });
  });

  window.RouteKmMarkers = {
    // מדליק/מכבה את סימוני הק"מ של קו אחד; מחזיר את המצב החדש
    toggle: function (line) {
      if (!line || !line._kmLayer) return false;
      line._kmOn = !line._kmOn;
      if (line._kmOn) show(line); else hide(line);
      return line._kmOn;
    },
    isOn: function (line) { return !!(line && line._kmLayer && line._kmOn); }
  };
})();
