document.addEventListener('DOMContentLoaded', () => {
    // 初始化事件页面
    const eventManager = new EventManager();
    eventManager.init();
});

class EventManager {
    constructor() {
        this.endpoints = {
            upcoming: '/api/events/upcoming',
            past: '/api/events/past'
        };
    }
    
    async init() {
        await this.loadUpcomingEvents();
        await this.loadPastEvents();
        this.setupNavScroll();
        this.setActiveNavItem();
    }
    
    async fetchEvents(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to load events: ${url}`, error);
            return [];
        }
    }
    
    async loadUpcomingEvents() {
        const events = await this.fetchEvents(this.endpoints.upcoming);
        if (events.length > 0) {
            this.renderUpcomingEvents(events);
        } else {
            this.showNoEventsMessage('upcoming');
        }
    }
    
    renderUpcomingEvents(events) {
        const grid = document.querySelector('.events-grid');
        
        events.forEach(event => {
            const card = document.createElement('article');
            card.className = 'event-card';
            card.innerHTML = `
                <img src="${event.image}" alt="${event.title}" class="event-image">
                <div class="event-content">
                    <div class="event-date">${event.date}</div>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <a href="${event.link}" class="event-button">Learn More</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    
    async loadPastEvents() {
        const events = await this.fetchEvents(this.endpoints.past);
        if (events.length > 0) {
            this.renderPastEvents(events);
        } else {
            this.showNoEventsMessage('past');
        }
    }
    
    renderPastEvents(events) {
        const timeline = document.querySelector('.events-timeline');
        
        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'timeline-event';
            item.innerHTML = `
                <div class="timeline-date">${event.date}</div>
                <h3 class="timeline-title">${event.title}</h3>
                <p>${event.description}</p>
                ${event.photos ? `<div class="event-photos">Photos: ${event.photos}</div>` : ''}
            `;
            timeline.appendChild(item);
        });
    }
    
    showNoEventsMessage(type) {
        const container = type === 'upcoming' 
            ? document.querySelector('.events-grid')
            : document.querySelector('.events-timeline');
        
        const message = document.createElement('div');
        message.className = 'no-events-message';
        message.textContent = type === 'upcoming'
            ? 'No upcoming events scheduled. Check back later!'
            : 'No past events to display.';
        
        container.appendChild(message);
    }
    
    setupNavScroll() {
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.global-nav');
            nav.style.background = window.scrollY > 50
                ? 'rgba(255,255,255,0.98)'
                : 'rgba(255,255,255,0.95)';
        });
    }
    
    setActiveNavItem() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.href === window.location.href) {
                item.classList.add('active');
            }
        });
    }
}