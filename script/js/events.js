document.addEventListener('DOMContentLoaded', () => {
    // 初始化事件页面
    const eventManager = new EventManager();
    eventManager.init();
});

class EventManager {
    constructor() {
        this.upcomingEventsData = [
        ];

        this.pastEventsData = [
            {
                date: 'April 1 - July 15, 2025',
                title: '2025 IEEE University of Leicester Student Branch Circuit Design Contest',
                description: 'Organized by the IEEE University of Leicester Student Branch Circuit Design Contest Executive Committee (CDCEC), the CDC’25 is an international competition fostering innovation and collaboration in circuit design. Co-sponsored by leading IEEE societies and industry partners, this contest invites undergraduate and postgraduate students worldwide to tackle real-world engineering challenges using electronics, embedded systems, and circuit design. Participants gain hands-on experience, expand their professional networks, and compete for prestigious awards.',
                link: 'event-detail/2025CDC.html'
            },
            {
                date: 'May 30, 2025',
                title: 'University of Leicester IEEE IAS/PELS Joint Student Branch Chapter Shines at Manchester Transport Electrification Workshop',
                description: 'The University of Leicester IEEE IAS/PELS Joint Student Branch Chapter showcased cutting-edge research and innovative activities at the Manchester Transport Electrification Workshop, highlighting its unique influence as an international academic community.',
                image: 'res/image/manchester_workshop.jpg',
                link: 'event-detail/manchester-workshop.html'
            },
            {
                date: 'May 2025',
                title: 'International Exchange',
                description: 'Online exchange event with Dalian University of Technology student branch.',
                photos: ''
            },
            {
                date: 'April 2025',
                title: 'Hardware Competition',
                description: 'Annual hardware design competition with over 30 participating teams.',
                photos: ''
            },
            {
                date: 'March 2025',
                title: 'Technical Seminar',
                description: 'Cutting-edge technology sharing session on AI applications in engineering.',
                photos: ''
            },
            {
                date: 'December 2024',
                title: 'IEEE Establishment',
                description: 'Official inauguration ceremony attended by professors and industry experts.',
                photos: ''
            }
        ];
    }
    
    async init() {
        this.loadUpcomingEvents();
        this.loadPastEvents();
        this.setupNavScroll();
        this.setActiveNavItem();
    }
    
    loadUpcomingEvents() {
        if (this.upcomingEventsData.length > 0) {
            this.renderUpcomingEvents(this.upcomingEventsData);
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
                <a href="${event.link}" class="event-card-link">
                    <div class="event-content">
                        <div class="event-date">${event.date}</div>
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-description">${event.description}</p>
                    </div>
                    <img src="${event.image}" alt="${event.title}" class="event-image">
                </a>
            `;
            grid.appendChild(card);
        });
    }
    
    loadPastEvents() {
        if (this.pastEventsData.length > 0) {
            this.renderPastEvents(this.pastEventsData);
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
                ${event.link ? `<a href="${event.link}" class="event-button">Learn More</a>` : ''}
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