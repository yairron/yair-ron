// מפות הרקע של עמודי האופניים (נוסף 21.11.2026) - מקור אמת יחיד לכתובות האריחים.
// כל עמוד עם מפה קורא ל-BikeBaseMaps.addTo(map) במקום L.tileLayer(...) משלו:
// מוסיף את מפת הרקע שנבחרה + כפתור בחירה (L.control.layers) בפינת המפה.
// הבחירה נשמרת בדפדפן של הצופה (localStorage) ומשותפת לכל העמודים.
//
// ברירת המחדל: CyclOSM (שכבת אופניים של OpenStreetMap, בלי מפתח API - שרתי OSM
// צרפת, שימוש הוגן). להחזרת ברירת המחדל למפה הקודמת - לשנות את DEFAULT_ID
// ל-'israelhiking'. הערה: GPX_files/scripts/thumbnail_template.html (יצירת התמונות
// הממוזערות בבניית הקטלוג) לא משתמש בקובץ הזה ונשאר על Israel Hiking Map בכוונה.
var BikeBaseMaps = (function () {
  var STORAGE_KEY = 'bikeBaseMap';
  var DEFAULT_ID = 'cyclosm';
  var MAX_ZOOM = 18;

  var MAPS = {
    cyclosm: {
      name: '🚲 CyclOSM',
      url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      options: {
        subdomains: 'abc',
        maxZoom: MAX_ZOOM,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://www.cyclosm.org">CyclOSM</a>'
      }
    },
    israelhiking: {
      name: '🥾 Israel Hiking Map',
      url: 'https://israelhiking.osm.org.il/Tiles/{z}/{x}/{y}.png',
      options: {
        // השרת מגיש אריחים רק בזום 7-16: minNativeZoom - בלי זה מסלול ארוך (כל
        // הארץ) מוצג על רקע אפור; maxNativeZoom - מעל 16 האריחים מוגדלים, כדי
        // שמעבר מ-CyclOSM בזום 17-18 לא ישאיר מפה ריקה
        minNativeZoom: 7,
        maxNativeZoom: 16,
        maxZoom: MAX_ZOOM,
        attribution: '© <a href="https://israelhiking.osm.org.il">Israel Hiking Map</a>'
      }
    }
  };

  function savedId() {
    try {
      var id = localStorage.getItem(STORAGE_KEY);
      return MAPS[id] ? id : DEFAULT_ID;
    } catch (e) {
      return DEFAULT_ID;
    }
  }

  function save(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* בלי אחסון - הבחירה פשוט לא נזכרת */ }
  }

  // מוסיף למפה את מפת הרקע השמורה ואת כפתור הבחירה. מחזיר את שכבת הרקע הפעילה.
  function addTo(map) {
    var layers = {}, byName = {}, active = savedId(), activeLayer = null;
    Object.keys(MAPS).forEach(function (id) {
      var layer = L.tileLayer(MAPS[id].url, MAPS[id].options);
      layers[MAPS[id].name] = layer;
      byName[MAPS[id].name] = id;
      if (id === active) activeLayer = layer;
    });
    activeLayer.addTo(map);
    L.control.layers(layers, null, { position: 'topright' }).addTo(map);
    map.on('baselayerchange', function (e) {
      if (byName[e.name]) save(byName[e.name]);
    });
    return activeLayer;
  }

  return { addTo: addTo, MAPS: MAPS };
})();
