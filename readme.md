# UOL-IEEE网站搭建

## 文件结构
```bash
UOL-website/
├── doc/                          # 项目文档
│   ├── 开发说明.docx             # 原"如图所示..."文件重命名
│   ├── 文本描述.docx             # 通用内容文档
│   └── 首页文本描述.docx         # 首页内容规范
├── readme.md                     # 项目说明
├── res/                          # 静态资源
│   ├── icon/                     # 图标(已提供具体文件)
│   └── image/                    # 图片(含设计稿)
└── script/                       # 前端代码
    ├── css/
    │   ├── main.css              # 全局样式
    │   ├── calendar.css          # 日历页样式
    │   └── events.css            # 活动页样式
    ├── html/
    │   ├── index.html            # 首页
    │   ├── calendar.html         # 日历页
    │   └── events.html           # 活动页
    └── js/
        ├── main.js               # 全局脚本
        ├── calendar.js           # 日历功能
        └── events.js             # 活动功能
```

### 改动2025-4-4
1. 整理了一下文件结构，方便开发。
2. wps要冲会员，球球大家用github