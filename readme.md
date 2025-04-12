# UOL-IEEE网站搭建

## 文件结构
```bash
uol-website/
├── 页面文件/
│   ├── index.html          # 首页
│   ├── about.html          # 关于我们页面
│   ├── calendar.html       # 日历页面
│   ├── collaboration.html  # 合作页面
│   └── events.html         # 活动页面
│
├── 资源文件/
│   ├── icon/               # 图标资源
│   │   ├── icons8-删除-36.png
│   │   ├── icons8-复选标记-24.png
│   │   ├── icons8-搜索-30.png
│   │   ├── icons8-日历-48.png
│   │   ├── icons8-添加-48.png
│   │   └── icons8-通知-48.png
│   │
│   └── image/              # 图片资源
│       ├── 7-140202222Q43P.png
│       ├── EasyEDA.png
│       ├── event1.jpg
│       ├── event2.jpg
│       ├── event3.png
│       ├── GIMO logo.png
│       └── ...(其他图片)
│
├── 脚本与样式/
│   ├── css/
│   │   ├── base/           # 基础样式
│   │   │   ├── reset.css
│   │   │   ├── typography.css
│   │   │   └── variables.css
│   │   │
│   │   ├── components/     # 组件样式
│   │   │   ├── buttons.css
│   │   │   ├── cards.css
│   │   │   ├── carousel.css
│   │   │   ├── grid.css
│   │   │   ├── modal.css
│   │   │   ├── nav.css
│   │   │   └── timeline.css
│   │   │
│   │   ├── layouts/        # 布局样式
│   │   │   ├── footer.css
│   │   │   ├── header.css
│   │   │   └── sections.css
│   │   │
│   │   ├── pages/          # 页面专用样式
│   │   │   ├── about.css
│   │   │   ├── calendar.css
│   │   │   ├── events.css
│   │   │   └── home.css
│   │   │
│   │   └── 旧/             # 旧版样式(待整理)
│   │       ├── about.css
│   │       ├── calendar.css
│   │       ├── events.css
│   │       └── main.css
│   │
│   ├── include/            # 公共HTML片段
│   │   ├── footer.html
│   │   └── navbar.html
│   │
│   └── js/                 # JavaScript文件
│       ├── calendar.js     # 日历功能
│       ├── events.js       # 活动功能
│       ├── main.js         # 主脚本
│       └── template-loader.js # 模板加载器
│
├── doc/                    # 文档目录
├── readme.md               # 项目说明文件
└── wps写代码太反人类了，推荐用github.txt # 开发工具建议
```
### 改动2025-4-9
1. 改了一下项目结构
2. Calendar里面的增删改暂时先ban了，等后端

### 改动2025-4-9
1. 用github pages做了网页托管，现在暂时只有静态页面，先用着。网址：https://1lancerz.github.io/

### 改动2025-4-5
1. 完善calendar页面，做了增删改功能
2. 其实还不够完善，现在所有人都能改，权限的话要等后端

### 改动2025-4-4
1. 整理了一下文件结构，方便开发
2. wps要冲会员，球球大家用github，仓库地址https://github.com/1lancerZ/UOI-IEEE
3. 首页新增轮播表轮播近期活动

