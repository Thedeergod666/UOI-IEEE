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




// 轮播功能实现
document.addEventListener('DOMContentLoaded', function() {
    const carousel = {
      items: document.querySelectorAll('.carousel-item'),
      indicators: document.querySelectorAll('.indicator'),
      prevBtn: document.querySelector('.carousel-control.prev'),
      nextBtn: document.querySelector('.carousel-control.next'),
      currentIndex: 0,
      interval: null,
      intervalTime: 5000, // 轮播间隔时间
      isTransitioning: false, // 防止快速点击导致动画混乱
      
      init: function() {
        // 检查元素是否存在
        if (this.items.length === 0 || !this.prevBtn || !this.nextBtn) return;
        
        // 初始化显示第一项
        this.showItem(this.currentIndex);
        
        // 设置自动轮播
        this.startAutoPlay();
        
        // 绑定事件
        this.bindEvents();
      },
      
      showItem: function(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        // 隐藏所有项
        this.items.forEach(item => item.classList.remove('active'));
        this.indicators.forEach(ind => ind.classList.remove('active'));
        
        // 显示当前项
        this.items[index].classList.add('active');
        this.indicators[index].classList.add('active');
        this.currentIndex = index;
        
        // 重置过渡状态
        setTimeout(() => {
          this.isTransitioning = false;
        }, 500); // 与CSS过渡时间保持一致
      },
      
      next: function() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.showItem(nextIndex);
      },
      
      prev: function() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.showItem(prevIndex);
      },
      
      startAutoPlay: function() {
        this.stopAutoPlay(); // 先停止现有的自动播放
        this.interval = setInterval(() => this.next(), this.intervalTime);
      },
      
      stopAutoPlay: function() {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
      },
      
      bindEvents: function() {
        // 左右箭头控制
        this.nextBtn.addEventListener('click', () => {
          this.stopAutoPlay();
          this.next();
          this.startAutoPlay();
        });
        
        this.prevBtn.addEventListener('click', () => {
          this.stopAutoPlay();
          this.prev();
          this.startAutoPlay();
        });
        
        // 指示器点击
        this.indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', () => {
            if (index !== this.currentIndex) {
              this.stopAutoPlay();
              this.showItem(index);
              this.startAutoPlay();
            }
          });
        });
        
        // 鼠标悬停暂停
        const carouselContainer = document.querySelector('.hero-carousel');
        if (carouselContainer) {
          carouselContainer.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
          });
          
          carouselContainer.addEventListener('mouseleave', () => {
            this.startAutoPlay();
          });
        }
        
        // 触摸事件支持
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselContainer.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
          this.stopAutoPlay();
        }, {passive: true});
        
        carouselContainer.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          this.handleSwipe();
          this.startAutoPlay();
        }, {passive: true});
      },
      
      handleSwipe: function() {
        const SWIPE_THRESHOLD = 50; // 滑动阈值
        
        if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
          this.next(); // 向左滑动，下一张
        } else if (touchEndX - touchStartX > SWIPE_THRESHOLD) {
          this.prev(); // 向右滑动，上一张
        }
      }
    };
    
    // 初始化轮播
    carousel.init();
});

document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const nav = document.getElementById('carouselNav');
    const slides = document.querySelectorAll('.carousel-slide');
    
    // 计算可见幻灯片数量
    function getVisibleSlides() {
        const containerWidth = document.querySelector('.carousel-container').offsetWidth;
        const slideWidth = slides[0].offsetWidth + 16; // 包括gap
        return Math.floor(containerWidth / slideWidth);
    }
    
    // 创建导航点
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.dataset.index = index;
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        nav.appendChild(dot);
    });
    
    // 初始化第一个导航点为active
    nav.children[0].classList.add('active');
    
    // 跳转到指定幻灯片
    function goToSlide(index) {
        const visibleSlides = getVisibleSlides();
        const slideWidth = slides[0].offsetWidth + 16;
        const newPosition = -index * slideWidth;
        
        track.style.transform = `translateX(${newPosition}px)`;
        
        // 更新导航点状态
        Array.from(nav.children).forEach(dot => {
            dot.classList.remove('active');
        });
        nav.children[index].classList.add('active');
    }
    
    // 自动轮播
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    function autoPlay() {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
    }
    
    let interval = setInterval(autoPlay, 5000);
    
    // 鼠标悬停暂停
    document.querySelector('.multi-carousel').addEventListener('mouseenter', () => {
        clearInterval(interval);
    });
    
    document.querySelector('.multi-carousel').addEventListener('mouseleave', () => {
        interval = setInterval(autoPlay, 5000);
    });
    
    // 响应式调整
    window.addEventListener('resize', function() {
        goToSlide(currentIndex);
    });
});