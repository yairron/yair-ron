// route_arrows.js
// ==============
// חיצי כיוון זעירים לאורך כל קו מסלול על המפה (נוסף 30.10.2026, לבקשת המשתמש:
// "בכל תצוגת מסלולים על מפה"). נטען אחרי leaflet.js בכל עמודי YR1/bike שמציגים
// מסלולים - catalog.html, gps_upload.html, add_route.html, gpx_cleaner.html.
//
// עובד דרך init hook על L.Polyline - כל קו שנוצר מקבל חיצים אוטומטית, בלי לשנות
// את הקוד שיוצר אותו, ונעלמים יחד איתו כשהוא מוסר מהמפה. לא חל על L.Polygon/
// L.rectangle (גבול אזור, לא מסלול). כדי לוותר על חיצים לקו מסוים: { arrows: false }.
//
// המרווח בפיקסלים על המסך (לא במטרים) - כך הצפיפות נראית זהה בכל זום. מחושבים
// מחדש בכל הזזה/זום, ורק בתוך התחום הנראה (עם שוליים) - מסלול של מאות ק"מ בזום
// קרוב היה מייצר אחרת אלפי סמנים.
(function () {
  if (!window.L) return;

  var SPACING_PX = 90;
  var SIZE_PX = 10;
  var MAX_ARROWS = 1500;

  function arrowIcon(color, angleDeg) {
    var path = 'M3,1.5 L7.5,5 L3,8.5';
    return L.divIcon({
      className: 'route-arrow',
      iconSize: [SIZE_PX, SIZE_PX],
      iconAnchor: [SIZE_PX / 2, SIZE_PX / 2],
      html: '<svg width="' + SIZE_PX + '" height="' + SIZE_PX + '" viewBox="0 0 10 10" ' +
            'style="display:block;transform:rotate(' + angleDeg.toFixed(1) + 'deg)">' +
            '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="' + path + '" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>'
    });
  }

  var ArrowLayer = L.LayerGroup.extend({
    initialize: function (line) {
      L.LayerGroup.prototype.initialize.call(this);
      this._line = line;
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
    _redraw: function () {
      var map = this._map;
      if (!map) return;
      this.clearLayers();
      var segs = this._line.getLatLngs();
      if (!segs.length) return;
      if (segs[0] instanceof L.LatLng) segs = [segs];
      var color = this._line.options.color || '#3388ff';
      var view = map.getPixelBounds().pad(0.2);
      var count = 0;
      for (var s = 0; s < segs.length && count < MAX_ARROWS; s++) {
        var seg = segs[s];
        var next = SPACING_PX / 2;   // מרחק (בפיקסלים) מתחילת הקטע הנוכחי עד החץ הבא
        var a = seg.length ? map.project(seg[0]) : null;
        for (var i = 1; i < seg.length && count < MAX_ARROWS; i++) {
          var b = map.project(seg[i]);
          var dx = b.x - a.x, dy = b.y - a.y;
          var len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            var angle = Math.atan2(dy, dx) * 180 / Math.PI;
            for (; next <= len && count < MAX_ARROWS; next += SPACING_PX) {
              var p = L.point(a.x + dx * next / len, a.y + dy * next / len);
              if (!view.contains(p)) continue;
              this.addLayer(L.marker(map.unproject(p), {
                icon: arrowIcon(color, angle), interactive: false, keyboard: false
              }));
              count++;
            }
            next -= len;
          }
          a = b;
        }
      }
    }
  });

  L.Polyline.addInitHook(function () {
    if (this instanceof L.Polygon || this.options.arrows === false) return;
    var arrows = new ArrowLayer(this);
    this.on('add', function () { this._map.addLayer(arrows); });
    this.on('remove', function () { if (arrows._map) arrows._map.removeLayer(arrows); });
  });
})();
