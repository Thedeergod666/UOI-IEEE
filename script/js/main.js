class ContentLoader {
    constructor() {
        this.endpoints = {
            timeline: '/api/timeline',
            partners: '/api/partners'
        };
    }

    async init() {
        await Promise.all([
            this.loadTimeline(),
            this.loadPartners()
        ]);
        
        this.setupScrollBehavior();
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to load: ${url}`, error);
            return null;
        }
    }

    async loadTimeline() {
        const data = await this.fetchData(this.endpoints.timeline);
        if (data) this.renderTimeline(data);
    }

    renderTimeline(events) {
        const container = document.querySelector('.timeline-column');
        events.forEach(event => {
            const node = document.createElement('div');
            node.className = 'timeline-node';
            node.innerHTML = `
                <div class="timeline-marker"></div>
                <h3>${event.date}</h3>
                <p>${event.title}</p>
            `;
            container.appendChild(node);
        });
    }

    async loadPartners() {
        const data = await this.fetchData(this.endpoints.partners);
        if (data) this.renderPartners(data);
    }

    renderPartners(partners) {
        const grid = document.querySelector('.partners-grid');
        partners.forEach(partner => {
            const card = document.createElement('div');
            card.className = 'partner-card';
            card.style.backgroundImage = `url(${partner.image})`;
            card.innerHTML = `
                <div class="partner-overlay">
                    <h3>${partner.name}</h3>
                    <p>${partner.location}</p>
                    <a href="${partner.url}" target="_blank" class="footer-link">Visit Website</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    setupScrollBehavior() {
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.global-nav');
            nav.style.background = window.scrollY > 50
                ? 'rgba(255,255,255,0.98)'
                : 'rgba(255,255,255,0.95)';
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const loader = new ContentLoader();
    loader.init();
});