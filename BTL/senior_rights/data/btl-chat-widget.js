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
            bottom: 96px;
            left: 24px;
            width: min(360px, calc(100vw - 48px));
            max-height: min(500px, calc(100vh - 140px));
            background: white;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 1000;
            direction: rtl;
            font-family: 'Assistant', 'Segoe UI', Tahoma, sans-serif;
        }
        #btl-chat-panel.open {
            display: flex;
        }
        #btl-chat-header {
            background: linear-gradient(135deg, #2E5B8A, #4A90B5);
            color: white;
            padding: 14px 16px;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #btl-chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            line-height: 1;
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
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 0.92rem;
            line-height: 1.5;
            white-space: pre-wrap;
        }
        .btl-chat-msg.user {
            align-self: flex-start;
            background: #2E5B8A;
            color: white;
            border-bottom-left-radius: 4px;
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
        }
        #btl-chat-form {
            display: flex;
            border-top: 1px solid #ddd;
            padding: 10px;
            gap: 8px;
        }
        #btl-chat-input {
            flex: 1;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 8px 12px;
            font-family: inherit;
            font-size: 0.92rem;
            resize: none;
        }
        #btl-chat-send {
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
    `;

    var HTML = `
        <button id="btl-chat-toggle" aria-label="פתח צ'אט AI לשאלות">
            <span>🤖</span><span class="btl-chat-toggle-label">AI</span>
        </button>
        <div id="btl-chat-panel">
            <div id="btl-chat-header">
                <span>שאלו על זכויות אזרחים ותיקים</span>
                <button id="btl-chat-close" aria-label="סגור">✕</button>
            </div>
            <div id="btl-chat-messages"></div>
            <form id="btl-chat-form">
                <textarea id="btl-chat-input" rows="1" maxlength="500" placeholder="הקלידו שאלה..."></textarea>
                <button id="btl-chat-send" type="submit">שלח</button>
            </form>
        </div>
    `;

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
        var form = document.getElementById('btl-chat-form');
        var input = document.getElementById('btl-chat-input');
        var sendBtn = document.getElementById('btl-chat-send');
        var messages = document.getElementById('btl-chat-messages');

        function addMessage(text, cls) {
            var div = document.createElement('div');
            div.className = 'btl-chat-msg ' + cls;
            div.textContent = text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        toggle.addEventListener('click', function() {
            panel.classList.toggle('open');
            if (panel.classList.contains('open') && !messages.hasChildNodes()) {
                addMessage('שלום! אפשר לשאול אותי כל שאלה על זכויות אזרחים ותיקים, קצבאות וביטוח לאומי, ואני אענה לפי המידע שבאתר.', 'bot');
            }
        });
        closeBtn.addEventListener('click', function() {
            panel.classList.remove('open');
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            var question = input.value.trim();
            if (!question) return;

            addMessage(question, 'user');
            input.value = '';
            sendBtn.disabled = true;

            try {
                var res = await fetch('/api/btl-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: question })
                });
                var data = await res.json();
                if (!res.ok) {
                    addMessage(data.error || 'אירעה שגיאה, נסו שוב.', 'error');
                } else {
                    addMessage(data.answer, 'bot');
                }
            } catch (err) {
                addMessage('שגיאת תקשורת, נסו שוב.', 'error');
            } finally {
                sendBtn.disabled = false;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
