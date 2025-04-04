/**
 * 模板加载系统 - 自动加载公共模板片段
 * 功能：
 * 1. 加载导航栏(navbar.html)和页脚(footer.html)
 * 2. 自动高亮当前页面菜单项
 * 3. 处理本地文件系统和服务器环境的路径差异
 * 4. 提供错误回退机制
 */

class TemplateLoader {
  constructor() {
    // 模板文件配置
    this.templates = {
      navbar: {
        path: '../include/navbar.html',
        container: 'header', // 插入到<body>开头的<header>标签中
        fallback: this.createFallbackNav()
      },
      footer: {
        path: '../include/footer.html',
        container: 'footer', // 插入到<body>末尾的<footer>标签中
        fallback: this.createFallbackFooter()
      }
    };
    
    // 路径基准（自动检测环境）
    this.basePath = this.detectBasePath();
  }

  // 检测运行环境并返回基准路径
  detectBasePath() {
    if (window.location.protocol === 'file:') {
      // 本地文件系统模式
      const pathSegments = window.location.pathname.split('/');
      pathSegments.pop(); // 移除当前文件名
      return 'file://' + pathSegments.join('/') + '/';
    } else {
      // 服务器环境
      return window.location.origin + '/';
    }
  }

  // 加载所有模板
  async loadAllTemplates() {
    try {
      await Promise.all([
        this.loadTemplate('navbar'),
        this.loadTemplate('footer')
      ]);
      this.highlightCurrentPage();
    } catch (error) {
      console.error('模板加载失败:', error);
    }
  }

  // 加载单个模板
  async loadTemplate(templateName) {
    const config = this.templates[templateName];
    if (!config) return;

    try {
      // 构建完整路径
      const fullPath = new URL(config.path, this.basePath).href;
      
      // 获取模板内容
      const response = await fetch(fullPath);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      this.insertTemplate(templateName, html);
    } catch (error) {
      console.error(`加载${templateName}失败:`, error);
      this.insertTemplate(templateName, config.fallback);
    }
  }

  // 插入模板到DOM
  insertTemplate(templateName, content) {
    const config = this.templates[templateName];
    let container = document.querySelector(config.container);
    
    if (!container) {
      container = document.createElement(config.container);
      if (templateName === 'navbar') {
        document.body.prepend(container);
      } else {
        document.body.appendChild(container);
      }
    }
    
    container.innerHTML = content;
  }

  // 高亮当前页面菜单项
  highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
      const itemPage = item.getAttribute('href').split('/').pop();
      if (currentPage === itemPage) {
        item.classList.add('active');
      }
    });
  }

  // 导航栏回退内容
  createFallbackNav() {
    return `
    <nav class="global-nav">
    <img src="../../res/image/IEEE学生会logo.jpg" alt="IEEE Logo" class="nav-logo">
    <div class="nav-menu">
        <a href="index.html" class="nav-item">Home</a>
        <a href="events.html" class="nav-item">Events</a>
        <a href="calendar.html" class="nav-item">Calendar</a>
        <a href="collaboration.html" class="nav-item">Collaboration</a>
        <a href="committee.html" class="nav-item">Committee</a>
        <a href="about.html" class="nav-item">About Us</a>
    </div>
    <a href="#join" class="nav-item join-button">Join IEEE</a>
</nav>
    `;
  }

  // 页脚回退内容
  createFallbackFooter() {
    return `
    <footer class="global-footer">
    <div class="footer-container">
        <div class="footer-branding">
            <img src="../../res/image/GIMO logo.png" alt="GIMO Logo" class="footer-logo">
            <div>
                <p>University of Leicester</p>
                <p>IEEE Student Branch</p>
            </div>
        </div>
        <div class="footer-meta">
            <p><a href="mailto:GIMO118@outlook.com" class="footer-link">GIMO118@outlook.com</a></p>
            <p><a href="https://ieee.le.ac.uk" class="footer-link">https://ieee.le.ac.uk</a></p>
            <p>&copy; 2024 GIMO Group</p>
        </div>
    </div>
</footer>
    `;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const loader = new TemplateLoader();
  loader.loadAllTemplates();
  
  // 添加加载完成标记（用于CSS过渡）
  setTimeout(() => {
    document.body.classList.add('templates-loaded');
  }, 100);
});