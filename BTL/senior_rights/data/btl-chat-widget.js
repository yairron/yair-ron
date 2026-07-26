(function() {
    var CSS = `
        #btl-chat-toggle {
            position: fixed;
            bottom: 24px;
            left: 24px;
            height: 60px;
            padding: 0 20px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #2E5B8A, #4A90B5);
            color: white;
            border: none;
            font-size: 1.6rem;
            font-family: 'Assistant', 'Segoe UI', Tahoma, sans-serif;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: transform 0.2s;
        }
        #btl-chat-toggle:hover {
            transform: scale(1.08);
        }
        #btl-chat-toggle .btl-chat-toggle-label {
            font-size: 1rem;
            font-weight: 800;
            letter-spacing: 0.5px;
        }
        #btl-chat-panel {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            background: white;
            box-shadow: 0 12px 40px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 1000;
            font-family: 'Assistant', 'Segoe UI', Tahoma, sans-serif;
        }
        #btl-chat-panel.open {
            display: flex;
        }
        /* direction:rtl יושב על העטיפה הפנימית ולא על #btl-chat-panel עצמו בכוונה -
           ידית ה-resize של הדפדפן ממוקמת לפי direction, ובעברית (rtl) היא הייתה
           נוחתת בפינה השמאלית-תחתונה (קרוב לעוגן/לכפתור הפתיחה, מוסתרת/לא נוחה).
           השארת הפאנל עצמו ב-ltr (ברירת מחדל) מבטיחה שהידית תמיד בפינה
           הימנית-תחתונה, בעוד התוכן בפנים עדיין מוצג rtl כרגיל. */
        #btl-chat-inner {
            direction: rtl;
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }
        @media (min-width: 768px) {
            #btl-chat-panel {
                inset: auto;
                bottom: 96px;
                left: 24px;
                width: 50vw;
                height: 70vh;
                min-width: 320px;
                min-height: 400px;
                max-width: 95vw;
                max-height: 90vh;
                border-radius: 16px;
                resize: both;
                overflow: auto;
            }
        }
        #btl-chat-header {
            background: linear-gradient(135deg, #2E5B8A, #4A90B5);
            color: white;
            padding: 14px 16px;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        #btl-chat-header-actions {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        #btl-chat-clear,
        #btl-chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            line-height: 1;
        }
        #btl-chat-clear {
            font-size: 0.8rem;
            font-weight: 700;
            opacity: 0.85;
            text-decoration: underline;
        }
        #btl-chat-clear:hover {
            opacity: 1;
        }
        #btl-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #F5F9FC;
        }
        .btl-chat-msg {
            max-width: 92%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 0.92rem;
            line-height: 1.5;
        }
        .btl-chat-msg.user {
            align-self: flex-start;
            background: #2E5B8A;
            color: white;
            border-bottom-left-radius: 4px;
            white-space: pre-wrap;
        }
        .btl-chat-msg.bot {
            align-self: flex-end;
            background: #EAF1F8;
            color: #2C3E50;
            border-bottom-right-radius: 4px;
        }
        .btl-chat-msg.error {
            align-self: flex-end;
            background: #FBE7E7;
            color: #C62828;
            white-space: pre-wrap;
        }
        .btl-chat-msg.bot p {
            margin: 0 0 8px 0;
        }
        .btl-chat-msg.bot p:last-child {
            margin-bottom: 0;
        }
        .btl-chat-msg.bot h1,
        .btl-chat-msg.bot h2,
        .btl-chat-msg.bot h3,
        .btl-chat-msg.bot h4,
        .btl-chat-msg.bot h5,
        .btl-chat-msg.bot h6 {
            margin: 10px 0 6px 0;
            color: #2E5B8A;
            line-height: 1.3;
        }
        .btl-chat-msg.bot h1, .btl-chat-msg.bot h2 { font-size: 1.05rem; }
        .btl-chat-msg.bot h3, .btl-chat-msg.bot h4 { font-size: 1rem; }
        .btl-chat-msg.bot h5, .btl-chat-msg.bot h6 { font-size: 0.95rem; }
        .btl-chat-msg.bot ul {
            margin: 0 0 8px 0;
            padding-inline-start: 20px;
        }
        .btl-chat-msg.bot li {
            margin-bottom: 4px;
        }
        .btl-chat-msg.bot strong {
            color: #1A3A52;
        }
        .btl-chat-table-wrap {
            overflow-x: auto;
            margin: 0 0 8px 0;
        }
        .btl-chat-msg.bot table {
            border-collapse: collapse;
            width: 100%;
            font-size: 0.85rem;
        }
        .btl-chat-msg.bot th,
        .btl-chat-msg.bot td {
            border: 1px solid #c7d5e0;
            padding: 4px 8px;
            text-align: right;
            white-space: nowrap;
        }
        .btl-chat-msg.bot th {
            background: #DCE8F2;
        }
        .btl-chat-sources {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #c7d5e0;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .btl-chat-sources-label {
            font-size: 0.78rem;
            font-weight: 700;
            color: #5a7a94;
        }
        .btl-chat-sources a {
            font-size: 0.85rem;
            color: #2E5B8A;
            text-decoration: underline;
        }
        .btl-chat-disclaimer {
            font-size: 0.72rem;
            color: #8a97a3;
            font-style: italic;
            margin-top: 6px;
        }
        #btl-chat-form {
            display: flex;
            box-sizing: border-box;
            border-top: 1px solid #ddd;
            padding: 10px;
            gap: 8px;
            flex-shrink: 0;
        }
        #btl-chat-input {
            flex: 1;
            min-width: 0;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 8px 12px;
            font-family: inherit;
            font-size: 0.92rem;
            resize: none;
        }
        #btl-chat-send {
            flex-shrink: 0;
            box-sizing: border-box;
            background: #E8A840;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 0 16px;
            font-weight: 700;
            cursor: pointer;
        }
        #btl-chat-send:disabled {
            opacity: 0.6;
            cursor: default;
        }
        @media (max-width: 480px) {
            #btl-chat-form {
                flex-direction: column;
            }
            #btl-chat-send {
                width: 100%;
                padding: 10px 16px;
            }
        }
    `;

    var HTML = `
        <button id="btl-chat-toggle" aria-label="פתח צ'אט AI לשאלות">
            <span>🤖</span><span class="btl-chat-toggle-label">AI</span>
        </button>
        <div id="btl-chat-panel">
            <div id="btl-chat-inner">
                <div id="btl-chat-header">
                    <span>שאלו על זכויות אזרחים ותיקים</span>
                    <div id="btl-chat-header-actions">
                        <button id="btl-chat-clear" aria-label="נקה היסטוריה" title="נקה היסטוריה">נקה</button>
                        <button id="btl-chat-close" aria-label="סגור">✕</button>
                    </div>
                </div>
                <div id="btl-chat-messages"></div>
                <form id="btl-chat-form">
                    <textarea id="btl-chat-input" rows="1" maxlength="500" placeholder="הקלידו שאלה..."></textarea>
                    <button id="btl-chat-send" type="submit">שלח</button>
                </form>
            </div>
        </div>
    `;

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderInline(text) {
        return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }

    function isSeparatorRow(line) {
        return /^[\s|:\-]+$/.test(line) && line.includes('-');
    }

    function splitTableRow(line) {
        var cells = line.split('|').map(function(c) { return c.trim(); });
        if (cells.length && cells[0] === '') cells.shift();
        if (cells.length && cells[cells.length - 1] === '') cells.pop();
        return cells;
    }

    // ממיר Markdown בסיסי (כותרות, מודגש, רשימות, טבלאות, פסקאות) ל-HTML בטוח,
    // כי תשובות ה-AI כוללות לעיתים טבלאות/כותרות שצריך להציג מעוצב ולא כטקסט גולמי.
    function renderMarkdown(raw) {
        var lines = raw.replace(/\r\n/g, '\n').split('\n');
        var html = '';
        var i = 0;

        while (i < lines.length) {
            var line = lines[i];

            if (/^\s*$/.test(line)) { i++; continue; }

            var headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
            if (headerMatch) {
                var level = Math.min(headerMatch[1].length + 2, 6);
                html += '<h' + level + '>' + renderInline(headerMatch[2]) + '</h' + level + '>';
                i++;
                continue;
            }

            if (/^\s*[-*]\s+/.test(line)) {
                var items = [];
                while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                    items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
                    i++;
                }
                html += '<ul>' + items.map(function(it) {
                    return '<li>' + renderInline(it) + '</li>';
                }).join('') + '</ul>';
                continue;
            }

            if (line.indexOf('|') !== -1) {
                var tableLines = [];
                while (i < lines.length && lines[i].indexOf('|') !== -1) {
                    tableLines.push(lines[i]);
                    i++;
                }
                var rows = tableLines.filter(function(l) { return !isSeparatorRow(l); }).map(splitTableRow);
                if (rows.length) {
                    html += '<div class="btl-chat-table-wrap"><table><tbody>' + rows.map(function(cells, idx) {
                        var tag = idx === 0 ? 'th' : 'td';
                        return '<tr>' + cells.map(function(c) {
                            return '<' + tag + '>' + renderInline(c) + '</' + tag + '>';
                        }).join('') + '</tr>';
                    }).join('') + '</tbody></table></div>';
                }
                continue;
            }

            var paraLines = [line];
            i++;
            while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s+/.test(lines[i]) &&
                   !/^\s*[-*]\s+/.test(lines[i]) && lines[i].indexOf('|') === -1) {
                paraLines.push(lines[i]);
                i++;
            }
            html += '<p>' + paraLines.map(renderInline).join('<br>') + '</p>';
        }

        return html;
    }

    function init() {
        var style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        var wrapper = document.createElement('div');
        wrapper.innerHTML = HTML;
        document.body.appendChild(wrapper);

        var toggle = document.getElementById('btl-chat-toggle');
        var panel = document.getElementById('btl-chat-panel');
        var closeBtn = document.getElementById('btl-chat-close');
        var clearBtn = document.getElementById('btl-chat-clear');
        var form = document.getElementById('btl-chat-form');
        var input = document.getElementById('btl-chat-input');
        var sendBtn = document.getElementById('btl-chat-send');
        var messages = document.getElementById('btl-chat-messages');
        var WELCOME_TEXT = 'שלום! אפשר לשאול אותי כל שאלה על זכויות אזרחים ותיקים, קצבאות וביטוח לאומי, ואני אענה לפי המידע שבאתר. (אני עדיין בהרצה, וזוכר רק 3 שיחות אחורה)';
        var MAX_HISTORY_ITEMS = 3;
        var conversationHistory = [];

        function addMessage(text, cls, sources) {
            var div = document.createElement('div');
            div.className = 'btl-chat-msg ' + cls;
            if (cls === 'bot') {
                div.innerHTML = renderMarkdown(text);
                if (sources && sources.length) {
                    var sourcesDiv = document.createElement('div');
                    sourcesDiv.className = 'btl-chat-sources';
                    var label = document.createElement('div');
                    label.className = 'btl-chat-sources-label';
                    label.textContent = 'מקורות:';
                    sourcesDiv.appendChild(label);
                    sources.forEach(function(source) {
                        var link = document.createElement('a');
                        link.href = source.url;
                        link.target = '_blank';
                        link.rel = 'noopener';
                        link.textContent = source.title;
                        sourcesDiv.appendChild(link);
                    });
                    var disclaimer = document.createElement('div');
                    disclaimer.className = 'btl-chat-disclaimer';
                    disclaimer.textContent = 'אני רק AI ועלול לטעות. מומלץ לבדוק את המידע בקישורים המצורפים.';
                    sourcesDiv.appendChild(disclaimer);
                    div.appendChild(sourcesDiv);
                }
            } else {
                div.textContent = text;
            }
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            return div;
        }

        // מיישר את הודעת השאלה לראש חלון הצ'אט, כדי שהשאלה תישאר גלויה כשהתשובה
        // ארוכה - במקום שהגלילה האוטומטית לתחתית תדחוף את השאלה מעל לראש החלון.
        function scrollToMessageTop(el) {
            var containerRect = messages.getBoundingClientRect();
            var elRect = el.getBoundingClientRect();
            messages.scrollTop += elRect.top - containerRect.top;
        }

        toggle.addEventListener('click', function() {
            panel.classList.toggle('open');
            if (panel.classList.contains('open') && !messages.hasChildNodes()) {
                addMessage(WELCOME_TEXT, 'bot');
            }
        });
        closeBtn.addEventListener('click', function() {
            panel.classList.remove('open');
        });
        clearBtn.addEventListener('click', function() {
            messages.innerHTML = '';
            conversationHistory = [];
            addMessage(WELCOME_TEXT, 'bot');
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            var question = input.value.trim();
            if (!question) return;

            var questionDiv = addMessage(question, 'user');
            scrollToMessageTop(questionDiv);
            input.value = '';
            sendBtn.disabled = true;

            try {
                var res = await fetch('/api/btl-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: question, history: conversationHistory })
                });
                var data = await res.json();
                if (!res.ok) {
                    addMessage(data.error || 'אירעה שגיאה, נסו שוב.', 'error');
                } else {
                    addMessage(data.answer, 'bot', data.sources);
                    conversationHistory.push({ question: question, answer: data.answer });
                    if (conversationHistory.length > MAX_HISTORY_ITEMS) {
                        conversationHistory.shift();
                    }
                }
            } catch (err) {
                addMessage('שגיאת תקשורת, נסו שוב.', 'error');
            } finally {
                sendBtn.disabled = false;
                scrollToMessageTop(questionDiv);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
