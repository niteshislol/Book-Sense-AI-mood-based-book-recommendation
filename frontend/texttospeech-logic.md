# **text to speech logic**

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text to Speech (Zira Only)</title>
    <style>
        :root {
            --primary: #0f172a;
            --primary-foreground: #f8fafc;
            --background: #ffffff;
            --muted: #f1f5f9;
            --muted-foreground: #64748b;
            --border: #e2e8f0;
            --radius: 0.5rem;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .card {
            background: var(--background);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            width: 100%;
            max-width: 600px;
            overflow: hidden;
        }

        .card-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .char-count {
            font-size: 0.75rem;
            font-weight: normal;
            color: var(--muted-foreground);
            background: var(--muted);
            padding: 2px 8px;
            border-radius: 999px;
        }

        select {
            width: 100%;
            padding: 0.5rem;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            background-color: var(--muted);
            color: var(--primary);
            font-size: 0.9rem;
            outline: none;
            cursor: pointer;
            font-weight: 600; /* Bolding it to make it clear */
        }

        .card-content {
            padding: 1.5rem;
        }

        textarea {
            width: 100%;
            min-height: 300px;
            padding: 1rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 1rem;
            line-height: 1.6;
            color: var(--primary);
            background-color: rgba(241, 245, 249, 0.5);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            resize: vertical;
            box-sizing: border-box;
            outline: none;
            transition: background-color 0.2s, border-color 0.2s;
        }

        textarea:focus {
            background-color: var(--background);
            border-color: var(--primary);
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius);
            font-weight: 500;
            height: 40px;
            width: 40px;
            cursor: pointer;
            border: none;
            background: transparent;
            color: var(--primary);
            transition: background-color 0.2s;
        }

        .btn:hover {
            background-color: var(--muted);
        }

        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            color: #2563eb; 
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
    </style>
</head>
<body>

    <div class="card">
        <div class="card-header">
            <div class="header-top">
                <h2 class="card-title">
                    Text to Speech
                    <span id="charCount" class="char-count">0 chars</span>
                </h2>
                
                <button id="speakBtn" class="btn" title="Read Aloud">
                    <svg id="iconVolume" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                    <svg id="iconStop" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                </button>
            </div>

            <select id="voiceSelect">
                <option>Searching for Microsoft Zira...</option>
            </select>
        </div>
        
        <div class="card-content">
            <textarea id="textInput" placeholder="Type text here..."></textarea>
        </div>
    </div>

    <script>
        const speakBtn = document.getElementById('speakBtn');
        const textInput = document.getElementById('textInput');
        const charCount = document.getElementById('charCount');
        const iconVolume = document.getElementById('iconVolume');
        const iconStop = document.getElementById('iconStop');
        const voiceSelect = document.getElementById('voiceSelect');

        let isSpeaking = false;
        let allVoices = [];
        let targetVoice = null;

        // 1. STRICT FILTER: Only load Microsoft Zira
        function loadVoices() {
            allVoices = window.speechSynthesis.getVoices();
            voiceSelect.innerHTML = '';

            // Search specifically for "Microsoft Zira"
            // We use .includes() because the name might be "Microsoft Zira Desktop" or just "Microsoft Zira"
            targetVoice = allVoices.find(v => v.name.includes("Microsoft Zira"));

            if (targetVoice) {
                // If found, add ONLY this option
                const option = document.createElement('option');
                option.textContent = targetVoice.name; // e.g., "Microsoft Zira - English (United States)"
                option.value = "zira";
                voiceSelect.appendChild(option);
            } else {
                // If NOT found (e.g., on Mac/Android)
                const option = document.createElement('option');
                option.textContent = "Error: 'Microsoft Zira' voice not found on this device.";
                voiceSelect.appendChild(option);
                voiceSelect.disabled = true;
            }
        }

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        // 2. Speak Function
        function speak(text) {
            window.speechSynthesis.cancel();
            
            const utter = new SpeechSynthesisUtterance(text);
            
            // Force the voice to be Zira if we found it
            if (targetVoice) {
                utter.voice = targetVoice;
            } else {
                alert("Microsoft Zira is not installed. Speech may fail or use default.");
                return;
            }

            // Standard Zira settings
            utter.rate = 1;
            utter.pitch = 1;

            utter.onstart = () => updateUI(true);
            utter.onend = () => updateUI(false);
            utter.onerror = () => updateUI(false);

            window.speechSynthesis.speak(utter);
        }

        function updateUI(active) {
            isSpeaking = active;
            if (active) {
                speakBtn.classList.add('animate-pulse');
                iconVolume.style.display = 'none';
                iconStop.style.display = 'block';
                speakBtn.title = "Stop Reading";
            } else {
                speakBtn.classList.remove('animate-pulse');
                iconVolume.style.display = 'block';
                iconStop.style.display = 'none';
                speakBtn.title = "Read Aloud";
            }
        }

        textInput.addEventListener('input', (e) => {
            charCount.textContent = `${e.target.value.length} chars`;
        });

        speakBtn.addEventListener('click', () => {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                updateUI(false);
            } else {
                const text = textInput.value;
                if (text.trim()) {
                    speak(text);
                }
            }
        });

        window.addEventListener('beforeunload', () => {
            window.speechSynthesis.cancel();
        });
    </script>
</body>
</html>
