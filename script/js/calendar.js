class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = JSON.parse(localStorage.getItem('calendarEvents')) || [
            { 
                id: 1,
                title: "技术研讨会", 
                date: "2025-04-12", 
                time: "14:00",
                location: "Room 301", 
                status: "completed",
                description: "关于最新技术趋势的研讨会"
            },
            { 
                id: 2,
                title: "AI讲座", 
                date: "2025-04-15", 
                time: "16:00",
                location: "Auditorium", 
                status: "pending",
                description: "人工智能在工程中的应用"
            },
            { 
                id: 3,
                title: "项目启动会", 
                date: "2025-05-03", 
                time: "09:30",
                location: "Conference Room", 
                status: "pending",
                description: "新项目启动会议"
            }
        ];
        
        this.initElements();
        this.initEventListeners();
        this.renderCalendar();
    }
    
    initElements() {
        this.monthYearElement = document.getElementById('monthYear');
        this.calendarBody = document.getElementById('calendarBody');
        this.prevMonthBtn = document.getElementById('prevMonthBtn');
        this.nextMonthBtn = document.getElementById('nextMonthBtn');
        this.addEventBtn = document.getElementById('addEventBtn');
        this.eventModal = document.getElementById('eventModal');
        this.closeBtn = document.querySelector('.close-btn');
        this.eventForm = document.getElementById('eventForm');
    }
    
    initEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        this.addEventBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.eventForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        window.addEventListener('click', (e) => {
            if (e.target === this.eventModal) {
                this.closeModal();
            }
        });
    }
    
    renderCalendar() {
        this.calendarBody.innerHTML = '';
        this.updateMonthYearDisplay();
        
        const firstDayOfMonth = new Date(
            this.currentDate.getFullYear(), 
            this.currentDate.getMonth(), 
            1
        );
        
        const lastDayOfMonth = new Date(
            this.currentDate.getFullYear(), 
            this.currentDate.getMonth() + 1, 
            0
        );
        
        const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
        const totalDays = lastDayOfMonth.getDate();
        
        let date = 1;
        for (let i = 0; i < 6; i++) {
            if (date > totalDays) break;
            
            const row = document.createElement('tr');
            
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                
                if (i === 0 && j < startDay) {
                    // 上个月的日期
                    const prevMonthDays = new Date(
                        this.currentDate.getFullYear(), 
                        this.currentDate.getMonth(), 
                        0
                    ).getDate();
                    
                    const prevDate = prevMonthDays - (startDay - j - 1);
                    cell.innerHTML = `<div class="calendar-day other-month">${prevDate}</div>`;
                    cell.classList.add('other-month-cell');
                } else if (date > totalDays) {
                    // 下个月的日期
                    const nextDate = date - totalDays;
                    cell.innerHTML = `<div class="calendar-day other-month">${nextDate}</div>`;
                    cell.classList.add('other-month-cell');
                    date++;
                } else {
                    // 当前月的日期
                    const currentDate = new Date(
                        this.currentDate.getFullYear(),
                        this.currentDate.getMonth(),
                        date
                    );
                    
                    cell.innerHTML = `
                        <div class="calendar-day">${date}</div>
                        ${this.renderEventsForDate(currentDate)}
                    `;
                    
                    // 高亮今天
                    const today = new Date();
                    if (currentDate.toDateString() === today.toDateString()) {
                        cell.classList.add('today');
                    }
                    
                    date++;
                }
                
                row.appendChild(cell);
            }
            
            this.calendarBody.appendChild(row);
        }
    }
    
    renderEventsForDate(date) {
        const dateStr = this.formatDate(date);
        const dayEvents = this.events.filter(event => event.date === dateStr);
        
        return dayEvents.map(event => `
            <div class="event event-${event.status}" data-id="${event.id}">
                <span class="event-marker"></span>
                ${event.title}
                <small>${event.time} @ ${event.location}</small>
            </div>
        `).join('');
    }
    
    updateMonthYearDisplay() {
        this.monthYearElement.textContent = this.currentDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long'
        });
    }
    
    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
    }
    
    openModal() {
        this.eventModal.style.display = 'block';
        // 设置默认日期为当前选择的月份
        document.getElementById('eventDate').value = this.formatDate(this.currentDate);
    }
    
    closeModal() {
        this.eventModal.style.display = 'none';
        this.eventForm.reset();
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const newEvent = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            status: 'pending'
        };
        
        this.events.push(newEvent);
        this.saveEvents();
        this.renderCalendar();
        this.closeModal();
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }
}

// 初始化日历
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});