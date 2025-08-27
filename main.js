class DigitalTasbih {
    constructor() {
        this.currentPhrase = 'subhanallah';
        this.counter = 0;
        this.sessionCount = 0;
        this.totalCount = 0;
        this.target = 33;

        this.initializeElements();
        this.bindEvents();
        this.loadFromStorage();
        this.updateDisplay();
    }

    initializeElements() {
        this.phraseButtons = document.querySelectorAll('.phrase-btn');
        this.currentPhraseDisplay = document.querySelector('.current-phrase');
        this.counterDisplay = document.getElementById('counter');
        this.progressBar = document.getElementById('progressBar');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        this.totalCountDisplay = document.getElementById('totalCount');
        this.incrementBtn = document.getElementById('incrementBtn');
        this.resetSessionBtn = document.getElementById('resetSession');
        this.resetAllBtn = document.getElementById('resetAll');
        this.celebrationEl = document.getElementById('celebration');

        // Accessibility
        this.incrementBtn.setAttribute('aria-label', 'Increment count');
    }

    bindEvents() {
        this.phraseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectPhrase(btn));
        });

        // Click + visual feedback, with suppression after long-press
        let pressTimer;
        let pressHoldTimer;
        let autoStarted = false;
        let suppressNextClick = false;

        this.incrementBtn.addEventListener('click', () => {
            if (suppressNextClick) {
                suppressNextClick = false;
                return;
            }
            this.increment();
            this.incrementBtn.classList.add('clicked');
            setTimeout(() => this.incrementBtn.classList.remove('clicked'), 200);
        });

        // Long-press auto-increment (starts after short hold)
        const beginPress = () => {
            clearTimeout(pressHoldTimer);
            pressHoldTimer = setTimeout(() => {
                autoStarted = true;
                suppressNextClick = true; // prevent the click after long-press
                this.increment();
                pressTimer = setInterval(() => this.increment(), 150);
            }, 300);
        };
        const endPress = () => {
            clearTimeout(pressHoldTimer);
            if (autoStarted) {
                clearInterval(pressTimer);
                pressTimer = null;
                autoStarted = false;
            }
        };
        this.incrementBtn.addEventListener('mousedown', beginPress);
        this.incrementBtn.addEventListener('touchstart', beginPress, { passive: true });
        ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => {
            this.incrementBtn.addEventListener(evt, endPress);
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.key === '+') {
                e.preventDefault();
                this.increment();
            } else if (e.key === 'r') {
                this.resetSession();
            }
        });
        this.resetSessionBtn.addEventListener('click', () => this.resetSession());
        this.resetAllBtn.addEventListener('click', () => this.resetAll());
    }

    selectPhrase(selectedBtn) {
        // Remove active class from all buttons
        this.phraseButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to selected button
        selectedBtn.classList.add('active');

        // Update current phrase
        this.currentPhrase = selectedBtn.dataset.phrase;

        // Update current phrase display
        const arabicText = selectedBtn.querySelector('.arabic').textContent;
        const englishText = selectedBtn.querySelector('.english').textContent;

        this.currentPhraseDisplay.querySelector('.arabic').textContent = arabicText;
        this.currentPhraseDisplay.querySelector('.english').textContent = englishText;

        // Reset counter for new phrase
        this.counter = 0;
        this.updateDisplay();
    }

    increment() {
        this.counter++;
        this.sessionCount++;
        this.totalCount++;

        if (this.counter >= this.target) {
            this.counter = 0;
            this.showCompletionMessage();
        }

        // Haptic (mobile)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        this.updateDisplay();
        this.saveToStorage();
    }

    resetSession() {
        this.counter = 0;
        this.sessionCount = 0;
        this.updateDisplay();
        this.saveToStorage();
    }

    resetAll() {
        if (confirm('Are you sure you want to reset all counts?')) {
            this.counter = 0;
            this.sessionCount = 0;
            this.totalCount = 0;
            this.updateDisplay();
            this.saveToStorage();
        }
    }

    updateDisplay() {
        this.counterDisplay.textContent = this.counter;
        this.sessionCountDisplay.textContent = this.sessionCount;
        this.totalCountDisplay.textContent = this.totalCount;
        if (this.progressBar) {
            const pct = Math.min(100, Math.round((this.counter / this.target) * 100));
            this.progressBar.style.width = pct + '%';
        }
    }

    showCompletionMessage() {
        const message = `Completed ${this.target} ${this.currentPhrase}!`;
        this.launchConfetti();
        try { new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQgAAA==').play(); } catch (e) { }
        setTimeout(() => {
            // Non-intrusive toast-like alert
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = 'rgba(0,0,0,0.8)';
            toast.style.color = '#fff';
            toast.style.padding = '10px 16px';
            toast.style.borderRadius = '8px';
            toast.style.zIndex = '2000';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }, 50);
    }

    launchConfetti() {
        if (!this.celebrationEl) return;
        const count = 40;
        const colors = ['#FFD700', '#4CAF50', '#45a049', '#2c5530'];
        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.background = colors[i % colors.length];
            piece.style.width = piece.style.height = (8 + Math.random() * 6) + 'px';
            piece.style.animationDelay = (Math.random() * 0.5) + 's';
            this.celebrationEl.appendChild(piece);
            setTimeout(() => piece.remove(), 3500);
        }
    }

    saveToStorage() {
        const data = {
            totalCount: this.totalCount,
            lastPhrase: this.currentPhrase
        };
        localStorage.setItem('digitalTasbih', JSON.stringify(data));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('digitalTasbih');
        if (saved) {
            const data = JSON.parse(saved);
            this.totalCount = data.totalCount || 0;
            this.currentPhrase = data.lastPhrase || 'subhanallah';

            // Update phrase selection if different
            if (this.currentPhrase !== 'subhanallah') {
                const targetBtn = document.querySelector(`[data-phrase="${this.currentPhrase}"]`);
                if (targetBtn) {
                    this.selectPhrase(targetBtn);
                }
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalTasbih();
});
