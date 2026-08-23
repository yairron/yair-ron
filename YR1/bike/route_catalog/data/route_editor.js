// route_editor.js
// ==============
// כלי משותף למיזוג "שטוח" של כמה מסלולים לקובץ אחד, ולחיתוך אינטראקטיבי של
// מקטע חדש מתוך בריכת נקודות משותפת (בחירת נקודות בקליק על מפה). ברירת
// המחדל היא להעתיק נקודות מקוריות בלבד - אבל כשהלחיצה קרובה רק ל**קו**
// המחבר בין שתי נקודות עוקבות (לא לאף נקודה עצמה, בד"כ בגלל פער גדול בין
// נקודות מוקלטות), נוצרת נקודה **אחת** אינטרפולציה בדיוק על הקו במיקום
// הסמן (שונה 23.08.2026, ראו resolveClick) - כדי שנקודת הבחירה תשקף איפה
// המשתמש באמת לחץ, לא תקפוץ לקצה רחוק של פער. בשימוש
// גם ב-YR1/bike/route_catalog/catalog.html (תצוגת "מסלולים על המפה") וגם
// ב-YR1/bike/gps_upload/gps_upload.html (מסלולים שהועלו מהמחשב) - נוצר
// 22.08.2026 כדי לא לשכפל את הלוגיקה בין שני העמודים.
//
// עקרונות שסוכמו עם המשתמש (22.08.2026):
//  - כל פעולת עריכה (מיזוג/חיתוך) היא פעולת **תכנון**, לא הקלטה - הנקודות
//    בקובץ הפלט הן **בלי תגי <time> בכלל** (לא רק "בלי זמן תקין" - נמחקות
//    לחלוטין). זה גם עקבי עם איך שהאתר כבר מתייחס למסלולי "תכנון מסלול"
//    הקיימים (gpx_analyzer.py מדלג על ניקוי-קפיצות מבוסס-מהירות לסוג הזה).
//  - סדר חיבור המסלולים במיזוג לא משנה - אותו אזור גיאוגרפי יכול "להופיע"
//    בכמה מקומות בבריכה המשותפת אם כמה מסלולים חופפים גיאוגרפית, וזה תקין.
//  - בצומת/חפיפה (כשכמה נקודות בבריכה נמצאות ממש קרוב זו לזו) - לא משנה איזו
//    "מופע" נבחר בלחיצה על הצומת עצמו, כי ההמשך (הלחיצה הבאה) חייב להישאר
//    קרוב באינדקס לנקודה הנוכחית כדי לא "לקפוץ" למופע הלא-קשור באמצע הבריכה.
//  - סף הבחירה הוא **מרחק בפיקסלים על המסך, לא מטרים גיאוגרפיים** (שונה
//    22.08.2026) - סף גיאוגרפי קבוע "מרגיש" שונה לגמרי בין זום קרוב לרחוק
//    (10 מטר יכולים להיות בלתי-ניתנים-ללחיצה בזום רחוק, או רחבים מדי בזום
//    קרוב). הבחירה בפועל (קליק) ורמז העכבר (ריחוף) משתמשים **באותו** סף
//    פיקסלים בדיוק - כדי שמה שנראה ניתן-ללחיצה (הסמן הופך ל"אצבע") יהיה
//    תמיד באמת ניתן-ללחיצה, כולל נקודת ההתחלה עצמה. הפיכת lat/lon למיקום
//    פיקסלים על המסך תלויה במופע המפה (pan/zoom) - ולכן חייבת לקרות בעמוד
//    הקורא (יש לו את מופע ה-Leaflet), לא כאן במודול המשותף.
var RouteEditor = (function () {
  var SNAP_THRESHOLD_PX = 15;

  function euclidean(x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // הטלת נקודה (px,py) על **הקטע** בין (ax,ay) ל-(bx,by) - לא על הקו האינסופי
  // שהוא חלק ממנו (t מוגבל ל-[0,1]). מחזיר גם את t (מיקום יחסי על הקטע, 0=A
  // עד 1=B) וגם את המרחק - t נחוץ כדי למקם נקודה חדשה **בדיוק על הקו במיקום
  // הסמן** (ראו resolveClick), לא רק לבדוק קרבה כמו pointSegmentDistance.
  function projectOnSegment(px, py, ax, ay, bx, by) {
    var abx = bx - ax, aby = by - ay;
    var abLenSq = abx * abx + aby * aby;
    var t = abLenSq > 0 ? ((px - ax) * abx + (py - ay) * aby) / abLenSq : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    return { t: t, dist: euclidean(px, py, ax + t * abx, ay + t * aby) };
  }

  // מרחק מנקודה (px,py) אל **הקטע** בין (ax,ay) ל-(bx,by) - ראו projectOnSegment.
  // בשימוש לבדיקת קרבה בלבד (isNearPool), בלי צורך במיקום המדויק על הקטע.
  function pointSegmentDistance(px, py, ax, ay, bx, by) {
    return projectOnSegment(px, py, ax, ay, bx, by).dist;
  }

  // בריכה משותפת אחת (מערך שטוח) מכמה מסלולים בבת אחת - סדר חיבור לא משנה
  // (ראו הסבר למעלה). routesPoints: מערך של מערכי נקודות, כל נקודה {lat,lon,ele}.
  // כל נקודה בבריכה מתויגת גם ב-routeIdx (האינדקס של המסלול המקורי שלה בתוך
  // routesPoints) - נחוץ כדי לזהות מעבר בין מסלול למסלול באמצע בניית מסלול
  // (ראו createRouteBuilder/addFromPool למטה), לא רק להליכה בתוך אותו מסלול.
  function buildPool(routesPoints) {
    var pool = [];
    routesPoints.forEach(function (pts, routeIdx) {
      pts.forEach(function (p) { pool.push({ lat: p.lat, lon: p.lon, ele: p.ele, routeIdx: routeIdx }); });
    });
    return pool;
  }

  // כמה שרתי-מראה (mirrors) ציבוריים של Overpass, לא שרת יחיד - ראו הסבר
  // ב-fetchOsmPathsPool למטה. סדר = סדר ניסיון (הראשון הוא הפופולרי ביותר,
  // ולכן גם הכי סביר להיות עמוס).
  var OVERPASS_URLS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter'
  ];
  var OVERPASS_HIGHWAY_TYPES = 'path|track|footway|cycleway|bridleway|steps|pedestrian|living_street|residential|unclassified|service|tertiary|tertiary_link|secondary|secondary_link|primary|primary_link|trunk|trunk_link';
  var OVERPASS_MAX_BBOX_DEG2 = 0.03; // ~ אזור עירוני-אזורי בזום סביר; מעבר לזה - מבקשים להתקרב, השאילתה עלולה להיות איטית/כבדה מדי
  var OVERPASS_TIMEOUT_MS = 15000; // לכל שרת בנפרד - עד 3 שרתים ברצף (ראו fetchOsmPathsPool), אז worst-case כ-45 שניות אם כולם איטיים/למטה

  // שליפה מ-URL יחיד של Overpass - נכשל (Promise נדחה) בכל אחד מהמצבים:
  // timeout, שגיאת רשת, סטטוס לא-תקין. לא בודק את תוכן התשובה עצמו (ways/
  // בריכה) - זו אחריות fetchOsmPathsPool, כדי שהפונקציה הזו תישאר כללית לכל
  // שרת-מראה, גם אם התוצאה הסופית זהה מכולם.
  function fetchOneOverpass(url, query) {
    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function () { controller.abort(); }, OVERPASS_TIMEOUT_MS) : null;
    return fetch(url, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller ? controller.signal : undefined
    }).then(function (resp) {
      if (timeoutId) clearTimeout(timeoutId);
      if (!resp.ok) throw new Error('שרת הנתיבים הגיב בשגיאה (' + resp.status + ')');
      return resp.json();
    }).catch(function (err) {
      if (timeoutId) clearTimeout(timeoutId);
      if (err && err.name === 'AbortError') throw new Error('שליפת הנתיבים ארכה יותר מדי זמן');
      throw err;
    });
  }

  // שולף מ-Overpass API (נתוני OpenStreetMap חיים) את כל דרכי/שבילי ה"highway"
  // בתוך גבולות המפה הנוכחיים, ובונה מהם בריכה (buildPool) - כל "way" של OSM
  // נחשב "מסלול" נפרד (routeIdx נפרד), כך שכל מנגנון ה-snap הקיים (נקודה/קו,
  // מעבר בין מסלולים בצומת) עובד עליה בלי שינוי, בדיוק כמו על בריכת GPX.
  // bounds: {south,west,north,east}. מחזיר Promise<pool> - נדחה עם שגיאה
  // קריאה בעברית אם השטח גדול מדי, או שכל שרתי המראה נכשלו (רשת/timeout/עומס).
  // **תלות חיה בשירות חיצוני ציבורי** - הוסכם עם המשתמש (23.08.2026) שזו
  // האפשרות היחידה המעשית להצמדה לנתיב אמיתי, כי אריחי IHN הם תמונות (לא
  // נתוני וקטור) - אין נתונים לוקאליים להצמיד אליהם בלעדיה.
  // **תוקן 23.08.2026 אחרי כישלון אמיתי בפועל** (504 משרת overpass-api.de,
  // עמוס - נצפה בפועל, לא הנחה): במקום שרת יחיד, מנסה את OVERPASS_URLS ברצף
  // (tryUrls) ועוברת אוטומטית לשרת הבא אם הנוכחי נכשל - נכשלת סופית רק אם
  // כולם נכשלו.
  function fetchOsmPathsPool(bounds) {
    var area = Math.abs(bounds.north - bounds.south) * Math.abs(bounds.east - bounds.west);
    if (area > OVERPASS_MAX_BBOX_DEG2) {
      return Promise.reject(new Error('השטח המוצג במפה גדול מדי לשליפת נתיבים - יש להתקרב (זום) ולנסות שוב'));
    }
    var bbox = bounds.south + ',' + bounds.west + ',' + bounds.north + ',' + bounds.east;
    var query = '[out:json][timeout:20];(way["highway"~"^(' + OVERPASS_HIGHWAY_TYPES + ')$"](' + bbox + '););out geom;';

    function tryUrls(urls, lastErr) {
      if (!urls.length) {
        var reason = lastErr ? lastErr.message : 'לא ניתן להתחבר';
        return Promise.reject(new Error('כל שרתי הנתיבים (Overpass) עמוסים/לא זמינים כרגע (' + reason + ') - נסה שוב בעוד רגע'));
      }
      return fetchOneOverpass(urls[0], query).catch(function (err) {
        return tryUrls(urls.slice(1), err);
      });
    }

    return tryUrls(OVERPASS_URLS.slice()).then(function (data) {
      var ways = (data.elements || []).filter(function (el) { return el.type === 'way' && el.geometry && el.geometry.length >= 2; });
      if (!ways.length) throw new Error('לא נמצאו נתיבים/דרכים באזור המוצג במפה');
      var routesPoints = ways.map(function (w) {
        return w.geometry.map(function (g) { return { lat: g.lat, lon: g.lon, ele: null }; });
      });
      return buildPool(routesPoints);
    });
  }

  // פותר קליק/ריחוף ל"עוגן" בבריכה, **במרחב פיקסלים** - poolScreenPoints הוא
  // מערך {x,y} מקביל 1:1 לבריכה (אינדקסים תואמים), מחושב מחדש בעמוד הקורא
  // בכל בדיקה (map.latLngToContainerPoint על כל נקודה) כי מיקומי הפיקסלים
  // משתנים עם כל pan/zoom. עוגן הוא אחד משני סוגים:
  //  - אמיתי: { real:true, index, point, virtualPos:index } - נקודה ממש
  //    מהקובץ המקורי, בטווח הסף מהקליק. **קדימות מלאה** לנקודות אמיתיות -
  //    אם יש ולו אחת בטווח, לא נבדקים קטעים בכלל.
  //  - סינתטי: { real:false, segStart, t, point, virtualPos:segStart+t } -
  //    רק כשאין אף נקודה אמיתית בטווח אבל הקליק קרוב לקטע (קו) בין שתי
  //    נקודות עוקבות **מאותו מסלול מקורי**. הנקודה ממוקמת **בדיוק על הקו
  //    במיקום הסמן** (הטלה אנכית, ראו projectOnSegment) - לא קופצת לקצה
  //    הרחוק של הקטע. תוקן 23.08.2026: קודם נבחר הקצה הקרוב יותר (נקודה
  //    אמיתית), אבל זה יכול "לקפוץ" עשרות מטרים מהמיקום שבו המשתמש באמת
  //    לחץ כשהפער בין הנקודות גדול (ראו הסבר בכותרת הקובץ). הגובה (ele) גם
  //    הוא אינטרפולציה לינארית בין שתי הנקודות, null אם לאחת מהן אין גובה.
  // מתוך כל המועמדים - אם יש כמה (צומת/חפיפה/כמה קטעים חופפים) - נבחר
  // הקרוב ביותר ב**מיקום וירטואלי** ל-lastAnchor (לא הקרוב פיקסלית ביותר!).
  // null אם אין אף מועמד בטווח. lastAnchor=null עבור נקודת ההתחלה עצמה (אין
  // "קודם" להשוות אליו) - אז בוחרים את הקרוב פיקסלית ביותר מבין המועמדים.
  function resolveClick(pool, poolScreenPoints, clickX, clickY, lastAnchor, thresholdPx) {
    thresholdPx = thresholdPx || SNAP_THRESHOLD_PX;
    var lastVirtualPos = lastAnchor ? lastAnchor.virtualPos : null;

    var chooseBy = function (candidates) {
      if (lastVirtualPos === null) {
        var best = candidates[0];
        candidates.forEach(function (c) { if (c.dist < best.dist) best = c; });
        return best;
      }
      var chosen = candidates[0];
      candidates.forEach(function (c) {
        if (Math.abs(c.virtualPos - lastVirtualPos) < Math.abs(chosen.virtualPos - lastVirtualPos)) chosen = c;
      });
      return chosen;
    };

    var pointCandidates = [];
    for (var i = 0; i < poolScreenPoints.length; i++) {
      var d = euclidean(clickX, clickY, poolScreenPoints[i].x, poolScreenPoints[i].y);
      if (d <= thresholdPx) pointCandidates.push({ real: true, index: i, point: pool[i], virtualPos: i, dist: d });
    }
    if (pointCandidates.length) return chooseBy(pointCandidates);

    var segCandidates = [];
    for (var j = 0; j < pool.length - 1; j++) {
      if (pool[j].routeIdx !== pool[j + 1].routeIdx) continue;
      var a = poolScreenPoints[j], b = poolScreenPoints[j + 1];
      var proj = projectOnSegment(clickX, clickY, a.x, a.y, b.x, b.y);
      if (proj.dist > thresholdPx) continue;
      var pa = pool[j], pb = pool[j + 1];
      var eleOk = pa.ele !== null && pa.ele !== undefined && !isNaN(pa.ele) && pb.ele !== null && pb.ele !== undefined && !isNaN(pb.ele);
      var interp = {
        lat: pa.lat + (pb.lat - pa.lat) * proj.t,
        lon: pa.lon + (pb.lon - pa.lon) * proj.t,
        ele: eleOk ? (pa.ele + (pb.ele - pa.ele) * proj.t) : null,
        routeIdx: pa.routeIdx
      };
      segCandidates.push({ real: false, segStart: j, t: proj.t, point: interp, virtualPos: j + proj.t, dist: proj.dist });
    }
    if (segCandidates.length) return chooseBy(segCandidates);

    return null;
  }

  // בדיקה קלה בלבד (יש/אין, בלי לבחור מועמד סופי) - האם יש נקודה **או קטע
  // בין שתי נקודות עוקבות מאותו מסלול** בטווח הסף (פיקסלים) מהמיקום הנתון.
  // יוצא מוקדם בהתאמה הראשונה. נועד לרמז ויזואלי (סמן עכבר) בזמן ריחוף מעל
  // המפה - אותו חישוב קרבה בדיוק כמו resolveClick(), כדי שהרמז תמיד יהיה נכון.
  function isNearPool(pool, poolScreenPoints, x, y, thresholdPx) {
    thresholdPx = thresholdPx || SNAP_THRESHOLD_PX;
    for (var i = 0; i < poolScreenPoints.length; i++) {
      if (euclidean(x, y, poolScreenPoints[i].x, poolScreenPoints[i].y) <= thresholdPx) return true;
    }
    for (var j = 0; j < pool.length - 1; j++) {
      if (pool[j].routeIdx !== pool[j + 1].routeIdx) continue;
      var a = poolScreenPoints[j], b = poolScreenPoints[j + 1];
      if (pointSegmentDistance(x, y, a.x, a.y, b.x, b.y) <= thresholdPx) return true;
    }
    return false;
  }

  // מרחק גיאוגרפי אמיתי (ק"מ) - **לא** קשור לסף בחירת הקליקים (שם, בפיקסלים,
  // ראו למעלה) - נחוץ רק לחישוב מרחק/טיפוס/ירידה אמיתיים של המקטע הנבנה,
  // לתצוגת מסגרת המידע בזמן חיתוך.
  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371, toRad = function (d) { return d * Math.PI / 180; };
    var dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    var la1 = toRad(lat1), la2 = toRad(lat2);
    var h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // מוצא בתוך הבריכה את הנקודה הקרובה ביותר גיאוגרפית ל-(refLat,refLon) מתוך
  // הנקודות ששייכות ל-routeIdx נתון בלבד - "נקודת הכניסה" למסלול חדש בזמן
  // מעבר בין מסלול למסלול (ראו addPoint למטה). null אם למסלול הזה אין נקודות
  // כלל בבריכה (לא אמור לקרות בפועל).
  function findNearestInRoute(pool, routeIdx, refLat, refLon) {
    var bestI = null, bestD = Infinity;
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].routeIdx !== routeIdx) continue;
      var d = haversineKm(refLat, refLon, pool[i].lat, pool[i].lon);
      if (d < bestD) { bestD = d; bestI = i; }
    }
    return bestI;
  }

  // מחזיר את הנקודות שיש להוסיף ל-newPoints כדי לעבור מ-fromAnchor ל-toAnchor
  // **בתוך אותו מסלול מקורי** (routeIdx זהה) - לא כולל את הנקודה של fromAnchor
  // עצמו (כבר קיימת ב-newPoints מהקריאה הקודמת), כולל את הנקודה של toAnchor
  // (בסוף המערך המוחזר, גם אם היא סינתטית). fromAnchor/toAnchor הם עוגנים מ-
  // resolveClick - אמיתיים (real:true, index) או סינתטיים (real:false,
  // segStart, t) שנוצרו מלחיצה על קו בין שתי נקודות (ראו שם). הכיוון (קדימה/
  // אחורה בבריכה) נקבע לפי virtualPos - אינדקס שלם לעוגן אמיתי, שבר
  // (segStart+t) לסינתטי - כדי שהשוואת כיוון תעבוד נכון גם כשאחד הצדדים
  // (או שניהם) סינתטי.
  function pointsBetweenAnchors(pool, fromAnchor, toAnchor) {
    var forward = fromAnchor.virtualPos <= toAnchor.virtualPos;
    var realStart = fromAnchor.real
      ? (forward ? fromAnchor.index + 1 : fromAnchor.index - 1)
      : (forward ? fromAnchor.segStart + 1 : fromAnchor.segStart);
    var realEnd = toAnchor.real
      ? toAnchor.index
      : (forward ? toAnchor.segStart : toAnchor.segStart + 1);

    var seg = [];
    if (forward) {
      for (var i = realStart; i <= realEnd; i++) seg.push(pool[i]);
    } else {
      for (var j = realStart; j >= realEnd; j--) seg.push(pool[j]);
    }
    if (!toAnchor.real) seg.push(toAnchor.point);
    return seg;
  }

  // מרחק/טיפוס/ירידה מצטברים לרשימת נקודות - בשימוש למסגרת המידע החיה בזמן
  // חיתוך מקטע (נוסף 22.08.2026). נקודות בלי גובה תקין פשוט לא תורמות
  // לטיפוס/ירידה (לא זורקות שגיאה) - עדיין תורמות למרחק.
  function computeStats(points) {
    var distanceKm = 0, climbM = 0, descentM = 0;
    for (var i = 1; i < points.length; i++) {
      distanceKm += haversineKm(points[i - 1].lat, points[i - 1].lon, points[i].lat, points[i].lon);
      var a = points[i - 1].ele, b = points[i].ele;
      if (a !== null && a !== undefined && !isNaN(a) && b !== null && b !== undefined && !isNaN(b)) {
        var diff = b - a;
        if (diff > 0) climbM += diff; else descentM += -diff;
      }
    }
    return { distanceKm: distanceKm, climbM: Math.round(climbM), descentM: Math.round(descentM) };
  }

  // מנהל מצב אינטראקטיבי לבניית מסלול חדש בקליקים עוקבים על המפה, **בלי
  // תלות בבריכה בודדת** - נבנה 23.08.2026 כדי לתמוך בהחלפת "מצב עריכה" תוך
  // כדי בניית אותו מסלול (כפתור "עריכת מסלול" בעמוד הקורא): 1) חיתוך מקטע
  // מתוך מסלול/ים טעונים, 2) הוספת נקודות עם הצמדה לנתיב אמיתי על המפה
  // (בריכת OSM/Overpass, ראו fetchOsmPathsPool), 3) הוספת נקודות חופשי, בלי
  // הצמדה, בדיוק במיקום הקליק. אובייקט נפרד לכל הפעלה (לא global יחיד) - כך
  // גם catalog.html וגם gps_upload.html (ואפילו כמה הפעלות באותו עמוד) לא
  // מתנגשים זה בזה.
  //  - addFromPool(...): מוסיף נקודה מתוך בריכה נתונה (GPX או OSM - אותה
  //    שיטה בדיוק, ראו resolveClick). אם הנקודה הקודמת **גם היא** הגיעה
  //    מאותה בריכה בדיוק (==) - מפעילים את מנגנון "הליכה על הנתיב" הרגיל
  //    (pointsBetweenAnchors/מעבר-מסלול, מעתיק את כל הנקודות שביניהן). אם
  //    הבריכה הקודמת שונה (כולל "אין" - נקודה חופשית או תחילת מסלול) - אין
  //    שום "טווח" משותף בין שתי בריכות שונות, אז פשוט מחברים בקו ישר לנקודה
  //    היחידה שנפתרה כרגע (בדיוק כמו נקודה חופשית).
  //  - addFreehand(lat, lon): נקודה בדיוק במיקום הנתון, בלי הצמדה בכלל -
  //    ele תמיד null (אין מקור גובה לנקודה שהומצאה).
  function createRouteBuilder() {
    var newPoints = [];
    var lastAnchor = null; // עוגן אחרון (ראו resolveClick), רק אם הנקודה האחרונה הגיעה מבריכה
    var lastPool = null;   // הבריכה שממנה הגיע lastAnchor - null אם הנקודה האחרונה הייתה חופשית/אין נקודות עדיין
    var history = []; // כל איבר: {pointsLen, lastAnchor, lastPool} - למחיקה עם UNDO

    function routeIdxOf(pool, anchor) {
      return anchor.real ? pool[anchor.index].routeIdx : pool[anchor.segStart].routeIdx;
    }

    function addFromPool(clickX, clickY, poolScreenPoints, pool, thresholdPx) {
      var sameSourceAsLast = lastPool === pool;
      var anchor = resolveClick(pool, poolScreenPoints, clickX, clickY, sameSourceAsLast ? lastAnchor : null, thresholdPx);
      if (anchor === null) {
        return { ok: false, error: 'הנקודה רחוקה מדי מהמסלול/נתיב' };
      }
      history.push({ pointsLen: newPoints.length, lastAnchor: lastAnchor, lastPool: lastPool });

      if (!newPoints.length) {
        newPoints = [anchor.point];
      } else if (sameSourceAsLast && routeIdxOf(pool, anchor) === routeIdxOf(pool, lastAnchor)) {
        newPoints = newPoints.concat(pointsBetweenAnchors(pool, lastAnchor, anchor));
      } else if (sameSourceAsLast) {
        // מעבר בין מסלול/דרך למסלול/דרך אחרים **בתוך אותה בריכה** (למשל
        // בצומת) - לא חותכים "ישר" בבריכה השטוחה, ראו הסבר מפורט בהיסטוריה
        // (findNearestInRoute). מוצאים נקודת כניסה למסלול/דרך החדשים.
        var entryIdx = findNearestInRoute(pool, routeIdxOf(pool, anchor), lastAnchor.point.lat, lastAnchor.point.lon);
        if (entryIdx === null) {
          newPoints = newPoints.concat(pointsBetweenAnchors(pool, lastAnchor, anchor));
        } else {
          var entryAnchor = { real: true, index: entryIdx, point: pool[entryIdx], virtualPos: entryIdx };
          newPoints = newPoints.concat([entryAnchor.point]).concat(pointsBetweenAnchors(pool, entryAnchor, anchor));
        }
      } else {
        // הנקודה הקודמת הגיעה מבריכה אחרת (או הייתה חופשית, או שאין עדיין
        // נקודות) - אין "טווח" משותף בין שתי בריכות שונות (למשל מעבר ממצב
        // חיתוך למצב הצמדה-לנתיב-מפה) - רק מחברים בקו ישר לנקודה שנפתרה.
        newPoints = newPoints.concat([anchor.point]);
      }
      lastAnchor = anchor;
      lastPool = pool;
      return { ok: true, point: anchor.point };
    }

    function addFreehand(lat, lon) {
      var point = { lat: lat, lon: lon, ele: null };
      history.push({ pointsLen: newPoints.length, lastAnchor: lastAnchor, lastPool: lastPool });
      newPoints = newPoints.concat([point]);
      lastAnchor = null;
      lastPool = null;
      return { ok: true, point: point };
    }

    function undo() {
      if (!history.length) return false;
      var prev = history.pop();
      newPoints = newPoints.slice(0, prev.pointsLen);
      lastAnchor = prev.lastAnchor;
      lastPool = prev.lastPool;
      return true;
    }

    function reset() {
      newPoints = [];
      lastAnchor = null;
      lastPool = null;
      history = [];
    }

    function getPoints() { return newPoints.slice(); }
    function hasStarted() { return newPoints.length > 0; }

    return { addFromPool: addFromPool, addFreehand: addFreehand, undo: undo, reset: reset, getPoints: getPoints, hasStarted: hasStarted };
  }

  // GPX תקני מרשימת נקודות - **בלי** תגי <time> בכלל (פעולת תכנון, לא
  // הקלטה - ראו הסבר למעלה). כולל <ele> אם קיים ותקין.
  function buildGpxText(points, trackName) {
    var esc = function (s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    var trkpts = points.map(function (p) {
      var eleTag = (p.ele !== null && p.ele !== undefined && !isNaN(p.ele)) ? ('<ele>' + Number(p.ele).toFixed(1) + '</ele>') : '';
      return '<trkpt lat="' + p.lat.toFixed(6) + '" lon="' + p.lon.toFixed(6) + '">' + eleTag + '</trkpt>';
    }).join('\n      ');
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<gpx version="1.1" creator="yairron.com route editor" xmlns="http://www.topografix.com/GPX/1/1">\n' +
      '  <trk>\n' +
      '    <name>' + esc(trackName || 'מסלול מתוכנן') + '</name>\n' +
      '    <trkseg>\n      ' + trkpts + '\n    </trkseg>\n' +
      '  </trk>\n' +
      '</gpx>\n';
  }

  function downloadGpx(points, fileName, trackName) {
    var text = buildGpxText(points, trackName);
    var blob = new Blob([text], { type: 'application/gpx+xml' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }

  return {
    SNAP_THRESHOLD_PX: SNAP_THRESHOLD_PX,
    buildPool: buildPool,
    fetchOsmPathsPool: fetchOsmPathsPool,
    resolveClick: resolveClick,
    isNearPool: isNearPool,
    createRouteBuilder: createRouteBuilder,
    computeStats: computeStats,
    buildGpxText: buildGpxText,
    downloadGpx: downloadGpx
  };
})();
