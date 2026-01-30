const KOREAN_HOLIDAYS = {
    "2026-01-01": "신정", // New Year's Day
    "2026-03-01": "삼일절", // Independence Movement Day
    "2026-05-05": "어린이날", // Children's Day
    "2026-06-06": "현충일", // Memorial Day
    "2026-08-15": "광복절", // Liberation Day
    "2026-10-03": "개천절", // National Foundation Day
    "2026-10-09": "한글날", // Hangul Day
    "2026-12-25": "크리스마스", // Christmas Day

    "2027-01-01": "신정",
    "2027-03-01": "삼일절",
    "2027-05-05": "어린이날",
    "2027-06-06": "현충일",
    "2027-08-15": "광복절",
    "2027-10-03": "개천절",
    "2027-10-09": "한글날",
    "2027-12-25": "크리스마스",

    "2028-01-01": "신정",
    "2028-03-01": "삼일절",
    "2028-05-05": "어린이날",
    "2028-06-06": "현충일",
    "2028-08-15": "광복절",
    "2028-10-03": "개천절",
    "2028-10-09": "한글날",
    "2028-12-25": "크리스마스",
};

class TodoCalendar {
    constructor(selector) {
        this.app = document.querySelector(selector);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.notes = this.loadNotes();
        this.loadTheme(); // Load theme on initialization
        this.render();
    }

    render() {
        this.app.innerHTML = `
            <div class="calendar-header">
                <button class="nav-button" id="prev-month">&lt;</button>
                <h2 id="current-month-year"></h2>
                <button class="theme-toggle-button" id="theme-toggle"><span></span></button> <!-- New toggle button -->
                <button class="nav-button" id="next-month">&gt;</button>
            </div>
            <div class="calendar-grid" id="calendar-grid"></div>
            <div id="note-modal">
                <div class="modal-content">
                    <h3 id="modal-title"></h3>
                    <textarea id="note-textarea"></textarea>
                    <div class="modal-buttons">
                        <button class="modal-button save-button" id="save-note">Save</button>
                        <button class="modal-button delete-button" id="delete-note">Delete</button>
                        <button class="modal-button cancel-button" id="cancel-note">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        this.renderCalendarGrid();
        this.addEventListeners();
        this.updateThemeToggleButton();
    }

    renderCalendarGrid() {
        const grid = this.app.querySelector('#calendar-grid');
        const header = this.app.querySelector('#current-month-year');
        grid.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        header.textContent = `${this.currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Days of week headers
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('day-header');
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });

        // Blank cells for days before the first of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day-cell', 'not-current-month');
            grid.appendChild(emptyCell);
        }

        // Day cells for the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            const dateString = new Date(year, month, day).toISOString().split('T')[0];
            dayCell.dataset.date = dateString;

            const dayNumber = document.createElement('div');
            dayNumber.classList.add('day-number');
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);

            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('today');
            }

            // Check for holidays
            const holidayName = KOREAN_HOLIDAYS[dateString];
            if (holidayName) {
                dayCell.classList.add('holiday');
                const holidayText = document.createElement('div');
                holidayText.classList.add('holiday-name');
                holidayText.textContent = holidayName;
                dayCell.appendChild(holidayText);
            }

            const note = this.notes[dayCell.dataset.date];
            if (note) {
                const noteIndicator = document.createElement('div');
                noteIndicator.classList.add('note-indicator');
                dayCell.appendChild(noteIndicator);

                const todoItem = document.createElement('div');
                todoItem.classList.add('todo-item');
                todoItem.textContent = note;
                dayCell.appendChild(todoItem);
            }

            grid.appendChild(dayCell);
        }
    }

    addEventListeners() {
        // Month navigation
        this.app.querySelector('#prev-month').addEventListener('click', () => this.changeMonth(-1));
        this.app.querySelector('#next-month').addEventListener('click', () => this.changeMonth(1));

        // Day click
        this.app.querySelector('#calendar-grid').addEventListener('click', (e) => {
            const dayCell = e.target.closest('.day-cell');
            if (dayCell && dayCell.dataset.date) {
                this.selectedDate = dayCell.dataset.date;
                this.showNoteModal();
            }
        });

        // Modal buttons
        this.app.querySelector('#save-note').addEventListener('click', () => this.saveNote());
        this.app.querySelector('#delete-note').addEventListener('click', () => this.deleteNote());
        this.app.querySelector('#cancel-note').addEventListener('click', () => this.hideNoteModal());
        this.app.querySelector('#note-modal').addEventListener('click', (e) => {
            if (e.target.id === 'note-modal') {
                this.hideNoteModal();
            }
        });

        // Theme toggle
        this.app.querySelector('#theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.render();
    }

    showNoteModal() {
        const modal = this.app.querySelector('#note-modal');
        const textarea = this.app.querySelector('#note-textarea');
        const modalTitle = this.app.querySelector('#modal-title');

        modalTitle.textContent = new Date(this.selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        textarea.value = this.notes[this.selectedDate] || '';
        modal.classList.add('show');
        textarea.focus();
    }

    hideNoteModal() {
        const modal = this.app.querySelector('#note-modal');
        modal.classList.remove('show');
        this.selectedDate = null;
    }

    saveNote() {
        const textarea = this.app.querySelector('#note-textarea');
        const noteText = textarea.value.trim();

        if (noteText) {
            this.notes[this.selectedDate] = noteText;
        } else {
            delete this.notes[this.selectedDate];
        }

        this.saveNotesToStorage();
        this.hideNoteModal();
        this.renderCalendarGrid();
    }

    deleteNote() {
        delete this.notes[this.selectedDate];
        this.saveNotesToStorage();
        this.hideNoteModal();
        this.renderCalendarGrid();
    }

    loadNotes() {
        return JSON.parse(localStorage.getItem('todo-calendar-notes')) || {};
    }

    saveNotesToStorage() {
        localStorage.setItem('todo-calendar-notes', JSON.stringify(this.notes));
    }

    // Theme methods
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        } else {
            // Default to dark theme if no preference is saved
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeToggleButton();
    }

    updateThemeToggleButton() {
        const toggleButton = this.app.querySelector('#theme-toggle');
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            toggleButton.innerHTML = '☀️'; // Sun icon for light mode
        } else {
            toggleButton.innerHTML = '🌙'; // Moon icon for dark mode
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoCalendar('#app');
});
