# 「皖美」微信小程序 - 作业报告材料

## 一、完整目录结构

```plaintext
wanmei-anhui-miniprogram/
├── src/                           # 源代码目录
│   ├── pages/                     # 页面目录
│   │   ├── home/                  # 首页（沉浸式Banner + 徽派分类入口）
│   │   │   ├── index.tsx          # 首页主文件
│   │   │   └── index.config.ts    # 首页配置
│   │   ├── food/                  # 美食页（徽菜美食列表）
│   │   │   ├── index.tsx          # 美食列表页
│   │   │   └── index.config.ts    # 页面配置
│   │   ├── scenery/               # 风景页（自然风景列表）
│   │   │   ├── index.tsx          # 风景列表页
│   │   │   └── index.config.ts    # 页面配置
│   │   ├── culture/               # 文化页（历史文化列表）
│   │   │   ├── index.tsx          # 文化列表页
│   │   │   └── index.config.ts    # 页面配置
│   │   ├── detail/                # 详情页（内容详情+点赞收藏评论）
│   │   │   ├── index.tsx          # 详情页主文件
│   │   │   └── index.config.ts    # 页面配置
│   │   ├── quiz/                  # 徽文化小问答页（随机题目+印章收集）
│   │   │   ├── index.tsx          # 问答页主文件
│   │   │   └── index.config.ts    # 页面配置
│   │   ├── my/                    # 个人中心页（收藏+印章+昵称编辑）
│   │   │   ├── index.tsx          # 个人中心主文件
│   │   │   └── index.config.ts    # 页面配置
│   │   └── admin/                 # 内容管理模块（全员可编辑）
│   │       ├── index.tsx          # 内容管理总页（4个模块入口）
│   │       ├── index.config.ts    # 页面配置
│   │       ├── quiz/              # 题库管理
│   │       │   ├── index.tsx      # 题库列表页
│   │       │   ├── index.config.ts
│   │       │   ├── edit.tsx       # 题库编辑页
│   │       │   └── edit.config.ts
│   │       └── content/           # 内容管理（景点/美食/文化）
│   │           ├── index.tsx      # 内容列表页
│   │           ├── index.config.ts
│   │           ├── edit.tsx       # 内容编辑页
│   │           └── edit.config.ts
│   ├── db/                        # 数据库操作层
│   │   ├── api.ts                 # 数据库API封装（内容/点赞/收藏/评论/题库）
│   │   └── README.md              # 数据库使用说明
│   ├── client/                    # 客户端配置
│   │   └── supabase.ts            # Supabase客户端初始化
│   ├── store/                     # 状态管理
│   │   ├── user.ts                # 用户状态管理（Zustand）
│   │   └── README.md              # 状态管理说明
│   ├── types/                     # TypeScript类型定义
│   │   ├── content.ts             # 内容相关类型（Content/Comment）
│   │   └── global.d.ts            # 全局类型声明
│   ├── hooks/                     # 自定义Hooks
│   │   └── useTabBarPageClass.ts  # TabBar页面样式Hook
│   ├── assets/                    # 静态资源
│   │   └── images/                # 图片资源
│   │       ├── selected/          # TabBar选中态图标
│   │       │   ├── home.png       # 首页图标（选中）
│   │       │   ├── food.png       # 美食图标（选中）
│   │       │   ├── scenery.png    # 风景图标（选中）
│   │       │   ├── culture.png    # 文化图标（选中）
│   │       │   └── my.png         # 我的图标（选中）
│   │       └── unselected/        # TabBar未选中态图标
│   │           ├── home.png       # 首页图标（未选中）
│   │           ├── food.png       # 美食图标（未选中）
│   │           ├── scenery.png    # 风景图标（未选中）
│   │           ├── culture.png    # 文化图标（未选中）
│   │           └── my.png         # 我的图标（未选中）
│   ├── styles/                    # 样式文件
│   │   └── overrides.scss         # 样式覆盖
│   ├── app.tsx                    # 应用入口文件
│   ├── app.config.ts              # 应用全局配置（路由/TabBar）
│   ├── app.scss                   # 应用全局样式（徽派配色/渐变/阴影）
│   ├── utils.ts                   # 工具函数
│   └── index.html                 # H5入口HTML
├── supabase/                      # Supabase后端配置
│   └── migrations/                # 数据库迁移文件
│       ├── 00001_create_anhui_content_tables.sql      # 创建内容表
│       ├── 00002_create_counter_rpc_functions.sql     # 创建计数器RPC函数
│       ├── 00003_create_quiz_questions_table.sql      # 创建题库表
│       └── 00004_remove_economy_category.sql          # 删除经济分类
├── config/                        # 构建配置
│   ├── index.ts                   # 主配置文件
│   ├── dev.ts                     # 开发环境配置
│   ├── prod.ts                    # 生产环境配置
│   └── lint.ts                    # 代码检查配置
├── scripts/                       # 脚本文件
│   ├── checkAuth.sh               # 检查认证配置
│   ├── checkNavigation.sh         # 检查导航配置
│   ├── checkIconPath.sh           # 检查图标路径
│   └── testBuild.sh               # 测试构建
├── docs/                          # 项目文档
│   ├── DEPLOYMENT_GUIDE.md        # 部署指南
│   ├── QUIZ_FEATURE.md            # 问答功能文档
│   ├── SHARE_FEATURE.md           # 分享功能文档
│   └── ...                        # 其他设计文档
├── .env                           # 环境变量（Supabase配置）
├── .env.example                   # 环境变量模板
├── .gitignore                     # Git忽略配置
├── package.json                   # 项目依赖配置
├── pnpm-lock.yaml                 # 依赖锁定文件
├── tsconfig.json                  # TypeScript配置
├── tailwind.config.js             # Tailwind CSS配置
├── babel.config.js                # Babel配置
├── postcss.config.js              # PostCSS配置
├── project.config.json            # 微信小程序项目配置
├── README.md                      # 项目说明文档
├── GITHUB_UPLOAD_GUIDE.md         # GitHub上传指南
└── TODO.md                        # 任务清单
```

## 二、核心代码文件示例

### 1. 应用全局配置 (src/app.config.ts)

```typescript
const pages = [
  'pages/home/index',           // 首页
  'pages/food/index',           // 美食页
  'pages/scenery/index',        // 风景页
  'pages/culture/index',        // 文化页
  'pages/detail/index',         // 详情页
  'pages/quiz/index',           // 问答页
  'pages/my/index',             // 我的页面
  'pages/admin/index',          // 内容管理总页
  'pages/admin/quiz/index',     // 题库管理
  'pages/admin/quiz/edit',      // 题库编辑
  'pages/admin/content/index',  // 内容管理
  'pages/admin/content/edit'    // 内容编辑
]

export default defineAppConfig({
  pages,
  tabBar: {
    color: '#666666',
    selectedColor: '#4A90E2',  // 安徽山水蓝
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/images/unselected/home.png',
        selectedIconPath: './assets/images/selected/home.png'
      },
      {
        pagePath: 'pages/food/index',
        text: '美食',
        iconPath: './assets/images/unselected/food.png',
        selectedIconPath: './assets/images/selected/food.png'
      },
      {
        pagePath: 'pages/scenery/index',
        text: '风景',
        iconPath: './assets/images/unselected/scenery.png',
        selectedIconPath: './assets/images/selected/scenery.png'
      },
      {
        pagePath: 'pages/culture/index',
        text: '文化',
        iconPath: './assets/images/unselected/culture.png',
        selectedIconPath: './assets/images/selected/culture.png'
      },
      {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: './assets/images/unselected/my.png',
        selectedIconPath: './assets/images/selected/my.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1D3557',  // 徽墨色导航栏
    navigationBarTitleText: '皖美视界',
    navigationBarTextStyle: 'white'
  }
})
```

### 2. 全局样式配置 (src/app.scss)

```scss
/* 徽派配色系统 */
:root {
  /* 主色调 - 安徽山水蓝 */
  --primary: 203 65% 58%;           /* #4A90E2 */
  --primary-foreground: 0 0% 100%;
  --primary-glow: 203 65% 75%;
  
  /* 辅助色 - 古徽州墨绿 */
  --secondary: 155 24% 24%;         /* #2E4B3F */
  --secondary-foreground: 0 0% 100%;
  
  /* 徽派红 */
  --hui-red: 355 78% 58%;           /* #E63946 */
  
  /* 徽墨色系 */
  --huimo: 0 0% 20%;                /* #333333 深徽墨 */
  --huimo-light: 0 0% 45%;          /* #737373 浅徽墨 */
  --hui-gray: 60 29% 97%;           /* #F1FAEE 徽墨灰 */
  
  /* 背景色 */
  --background: 0 0% 100%;
  --foreground: 0 0% 20%;
  
  /* 卡片和边框 */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 20%;
  --border: 0 0% 90%;
  
  /* 渐变定义 */
  --gradient-primary: linear-gradient(135deg, 
    hsl(var(--primary)), 
    hsl(var(--primary-glow)));
  --gradient-secondary: linear-gradient(135deg, 
    hsl(var(--secondary)), 
    hsl(155 24% 35%));
  --gradient-huimo: linear-gradient(135deg, 
    hsl(var(--huimo)), 
    hsl(var(--huimo-light)));
  
  /* 阴影效果 */
  --shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.3);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 工具类 */
@layer utilities {
  /* 渐变文字 */
  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* 渐变背景 */
  .bg-gradient-primary {
    background: var(--gradient-primary);
  }
  
  .bg-gradient-secondary {
    background: var(--gradient-secondary);
  }
  
  .bg-gradient-huimo {
    background: var(--gradient-huimo);
  }
  
  /* 徽州窗棂纹理背景 */
  .bg-huizhou-lattice {
    background-color: hsl(var(--hui-gray));
    background-image: 
      /* 横向窗棂 */
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 35px,
        hsl(var(--huimo-light) / 0.08) 35px,
        hsl(var(--huimo-light) / 0.08) 37px
      ),
      /* 竖向窗棂 */
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 35px,
        hsl(var(--huimo-light) / 0.08) 35px,
        hsl(var(--huimo-light) / 0.08) 37px
      ),
      /* 对角线纹理 */
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 70px,
        hsl(var(--huimo-light) / 0.03) 70px,
        hsl(var(--huimo-light) / 0.03) 71px
      );
  }
  
  /* 阴影效果 */
  .shadow-elegant {
    box-shadow: var(--shadow-elegant);
  }
  
  .shadow-card {
    box-shadow: var(--shadow-card);
  }
  
  /* 卡片悬浮效果 */
  .card-scale {
    transition: transform 0.2s ease;
  }
  
  .card-scale:active {
    transform: scale(0.98);
  }
  
  /* 徽派红色文字 */
  .text-hui-red {
    color: hsl(var(--hui-red));
  }
  
  /* 徽墨色文字 */
  .text-huimo {
    color: hsl(var(--huimo));
  }
  
  .text-huimo-light {
    color: hsl(var(--huimo-light));
  }
}
```

### 3. 数据库API封装 (src/db/api.ts 核心函数)

```typescript
import {supabase} from '@/client/supabase'
import type {Comment, Content} from '@/types/content'

// ==================== 内容管理 ====================

/**
 * 获取所有内容
 */
export async function getAllContents(): Promise<Content[]> {
  const {data, error} = await supabase
    .from('contents')
    .select('*')
    .order('created_at', {ascending: false})

  if (error) {
    console.error('获取内容失败:', error)
    return []
  }

  return data || []
}

/**
 * 根据分类获取内容
 */
export async function getContentsByCategory(category: string): Promise<Content[]> {
  const {data, error} = await supabase
    .from('contents')
    .select('*')
    .eq('category', category)
    .order('created_at', {ascending: false})

  if (error) {
    console.error('获取分类内容失败:', error)
    return []
  }

  return data || []
}

/**
 * 根据ID获取内容详情
 */
export async function getContentById(id: string): Promise<Content | null> {
  const {data, error} = await supabase
    .from('contents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('获取内容详情失败:', error)
    return null
  }

  return data
}

// ==================== 点赞功能 ====================

/**
 * 点赞内容
 */
export async function likeContent(contentId: string, userId: string): Promise<boolean> {
  // 1. 插入点赞记录
  const {error: insertError} = await supabase
    .from('user_likes')
    .insert({content_id: contentId, user_id: userId})

  if (insertError) {
    console.error('点赞失败:', insertError)
    return false
  }

  // 2. 增加点赞计数
  const {error: updateError} = await supabase.rpc('increment_likes_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新点赞数失败:', updateError)
    return false
  }

  return true
}

/**
 * 取消点赞
 */
export async function unlikeContent(contentId: string, userId: string): Promise<boolean> {
  // 1. 删除点赞记录
  const {error: deleteError} = await supabase
    .from('user_likes')
    .delete()
    .eq('content_id', contentId)
    .eq('user_id', userId)

  if (deleteError) {
    console.error('取消点赞失败:', deleteError)
    return false
  }

  // 2. 减少点赞计数
  const {error: updateError} = await supabase.rpc('decrement_likes_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新点赞数失败:', updateError)
    return false
  }

  return true
}

// ==================== 收藏功能 ====================

/**
 * 收藏内容
 */
export async function favoriteContent(contentId: string, userId: string): Promise<boolean> {
  const {error: insertError} = await supabase
    .from('user_favorites')
    .insert({content_id: contentId, user_id: userId})

  if (insertError) {
    console.error('收藏失败:', insertError)
    return false
  }

  const {error: updateError} = await supabase.rpc('increment_favorites_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新收藏数失败:', updateError)
    return false
  }

  return true
}

/**
 * 取消收藏
 */
export async function unfavoriteContent(contentId: string, userId: string): Promise<boolean> {
  const {error: deleteError} = await supabase
    .from('user_favorites')
    .delete()
    .eq('content_id', contentId)
    .eq('user_id', userId)

  if (deleteError) {
    console.error('取消收藏失败:', deleteError)
    return false
  }

  const {error: updateError} = await supabase.rpc('decrement_favorites_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新收藏数失败:', updateError)
    return false
  }

  return true
}

// ==================== 评论功能 ====================

/**
 * 添加评论
 */
export async function addComment(
  contentId: string,
  userId: string,
  nickname: string,
  content: string
): Promise<boolean> {
  const {error} = await supabase.from('comments').insert({
    content_id: contentId,
    user_id: userId,
    nickname: nickname,
    content: content
  })

  if (error) {
    console.error('添加评论失败:', error)
    return false
  }

  return true
}

/**
 * 获取内容的评论列表
 */
export async function getCommentsByContentId(contentId: string): Promise<Comment[]> {
  const {data, error} = await supabase
    .from('comments')
    .select('*')
    .eq('content_id', contentId)
    .order('created_at', {ascending: false})

  if (error) {
    console.error('获取评论失败:', error)
    return []
  }

  return data || []
}

// ==================== 题库管理 ====================

/**
 * 获取所有题目
 */
export async function getAllQuizQuestions() {
  const {data, error} = await supabase
    .from('quiz_questions')
    .select('*')
    .order('created_at', {ascending: false})

  if (error) {
    console.error('获取题目失败:', error)
    return []
  }

  return data || []
}

/**
 * 随机获取一道题目
 */
export async function getRandomQuizQuestion() {
  const {data, error} = await supabase
    .from('quiz_questions')
    .select('*')

  if (error) {
    console.error('获取题目失败:', error)
    return null
  }

  if (!data || data.length === 0) {
    return null
  }

  // 随机选择一道题
  const randomIndex = Math.floor(Math.random() * data.length)
  return data[randomIndex]
}

/**
 * 新增题目
 */
export async function createQuizQuestion(question: {
  question: string
  option_a: string
  option_b: string
  option_c: string
  correct_answer: string
  explanation: string
}) {
  const {data, error} = await supabase
    .from('quiz_questions')
    .insert(question)
    .select()
    .maybeSingle()

  if (error) {
    console.error('新增题目失败:', error)
    return null
  }

  return data
}

/**
 * 更新题目
 */
export async function updateQuizQuestion(id: string, updates: Partial<{
  question: string
  option_a: string
  option_b: string
  option_c: string
  correct_answer: string
  explanation: string
}>) {
  const {data, error} = await supabase
    .from('quiz_questions')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('更新题目失败:', error)
    return null
  }

  return data
}

/**
 * 删除题目
 */
export async function deleteQuizQuestion(id: string): Promise<boolean> {
  const {error} = await supabase
    .from('quiz_questions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('删除题目失败:', error)
    return false
  }

  return true
}
```

### 4. 用户状态管理 (src/store/user.ts)

```typescript
import Taro from '@tarojs/taro'
import {create} from 'zustand'

interface UserStore {
  userId: string
  nickname: string
  setUserId: (id: string) => void
  setNickname: (name: string) => void
  initUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  userId: '',
  nickname: '游客',

  setUserId: (id: string) => {
    set({userId: id})
    Taro.setStorageSync('userId', id)
  },

  setNickname: (name: string) => {
    set({nickname: name})
    Taro.setStorageSync('nickname', name)
  },

  initUser: () => {
    // 从本地存储获取用户ID，如果不存在则生成新的UUID
    let userId = Taro.getStorageSync('userId')
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      Taro.setStorageSync('userId', userId)
    }

    // 获取昵称
    const nickname = Taro.getStorageSync('nickname') || '游客'

    set({userId, nickname})
  }
}))
```

### 5. TypeScript 类型定义 (src/types/content.ts)

```typescript
/**
 * 内容类型
 */
export interface Content {
  id: string
  category: 'food' | 'scenery' | 'culture'
  title: string
  subtitle: string
  description: string
  image_url: string
  likes_count: number
  favorites_count: number
  created_at: string
  updated_at: string
}

/**
 * 评论类型
 */
export interface Comment {
  id: string
  content_id: string
  user_id: string
  nickname: string
  content: string
  created_at: string
}

/**
 * 题目类型
 */
export interface QuizQuestion {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  correct_answer: 'A' | 'B' | 'C'
  explanation: string
  created_at: string
}
```

### 6. 数据库迁移文件示例 (supabase/migrations/00001_create_anhui_content_tables.sql)

```sql
/*
# 创建安徽内容展示表

## 1. 新建表

### contents（内容表）
存储所有展示内容（美食、风景、文化）

- `id` (uuid, 主键)
- `category` (text, 分类: food/scenery/culture)
- `title` (text, 标题)
- `subtitle` (text, 副标题)
- `description` (text, 详细描述)
- `image_url` (text, 图片URL)
- `likes_count` (integer, 点赞数, 默认0)
- `favorites_count` (integer, 收藏数, 默认0)
- `created_at` (timestamptz, 创建时间)
- `updated_at` (timestamptz, 更新时间)

### user_likes（用户点赞表）
- `user_id` (text, 用户ID)
- `content_id` (uuid, 内容ID)
- `created_at` (timestamptz, 点赞时间)

### user_favorites（用户收藏表）
- `user_id` (text, 用户ID)
- `content_id` (uuid, 内容ID)
- `created_at` (timestamptz, 收藏时间)

### comments（评论表）
- `id` (uuid, 主键)
- `content_id` (uuid, 内容ID)
- `user_id` (text, 用户ID)
- `nickname` (text, 昵称)
- `content` (text, 评论内容)
- `created_at` (timestamptz, 评论时间)

## 2. 安全策略
- 所有表不启用RLS，允许公开访问
- 通过应用层控制数据访问权限
*/

-- 创建内容表
CREATE TABLE IF NOT EXISTS contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('food', 'scenery', 'culture')),
  title text NOT NULL,
  subtitle text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  likes_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建用户点赞表
CREATE TABLE IF NOT EXISTS user_likes (
  user_id text NOT NULL,
  content_id uuid NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, content_id)
);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id text NOT NULL,
  content_id uuid NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, content_id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  nickname text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category);
CREATE INDEX IF NOT EXISTS idx_user_likes_content ON user_likes(content_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_content ON user_favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_id);

-- 插入初始内容数据（美食）
INSERT INTO contents (category, title, subtitle, description, image_url) VALUES
('food', '徽州毛豆腐', '徽州传统名菜', '徽州毛豆腐是安徽徽州地区的传统名菜，因表面长有寸许白色茸毛（白色菌丝）而得名。毛豆腐是通过人工发酵，使豆腐表面生长出一层白色茸毛，这层茸毛是植物蛋白转化成多种氨基酸的过程。经过发酵的毛豆腐，蛋白质分解成多种氨基酸，味道较一般豆腐鲜美。毛豆腐可以油煎、清蒸、红烧，其中以油煎最为常见，煎至两面金黄，配以辣椒酱食用，外酥里嫩，味道鲜美。', 'https://miaoda-image.cdn.bcebos.com/img/corpus/235fe99f283c4b3eb4014f6e6d9e7c5a.jpg'),
('food', '臭鳜鱼', '徽州经典名菜', '臭鳜鱼又称臭桂鱼、桶鲜鱼，是徽州传统名菜，也是徽菜的代表之一。制作臭鳜鱼选用新鲜鳜鱼，用淡盐水腌渍在室温25℃左右的环境中，用木桶腌制六七天，使其散发出似臭非臭的特殊气味，然后经过传统烹饪方法烹制而成。成菜后鱼肉鲜嫩、醇滑爽口，保持了鳜鱼的本味原汁，肉质醇厚入味，同时骨刺与鱼肉分离，肉成块状。臭鳜鱼闻起来臭，吃起来香，肉质鲜嫩、醇滑爽口，是徽菜中的经典。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f4e1f8e3-c8e9-4f0c-8e5e-0e5e5e5e5e5e.jpg'),
('food', '黄山烧饼', '徽州特色小吃', '黄山烧饼又名"蟹壳黄烧饼"、"救驾烧饼"，是徽州传统名吃，盛行于古徽州地区及周边部分地区。黄山烧饼以上等精面粉、净肥膘肉、梅干菜、芝麻、精盐、菜油等手工分别制作皮、馅，经泡面、揉面、搓酥、摘坯、制皮、包馅、收口、擀饼、刷饴、撒麻、烘烤等10余道工序精制而成。因经木炭火焙烤后，形如螃蟹背壳，色如蟹黄，故得此名。刚出炉的黄山烧饼色泽金黄，香脆可口，油而不腻，令人回味无穷。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg'),
('food', '绩溪挞馃', '徽州传统小吃', '绩溪挞馃是安徽绩溪县的传统小吃，有着悠久的历史。挞馃是用米粉做成的薄饼，包裹着各种馅料，如韭菜、豆腐干、笋干、肉丝等，然后在平底锅上煎至两面金黄。挞馃外皮酥脆，内馅鲜美，是绩溪人早餐的首选。制作挞馃需要精湛的技艺，米粉的调配、馅料的搭配、火候的掌握都很讲究。一个好的挞馃，外皮薄而不破，馅料丰富而不腻，吃起来香脆可口，回味无穷。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_12345678-90ab-cdef-1234-567890abcdef.jpg');

-- 插入初始内容数据（风景）
INSERT INTO contents (category, title, subtitle, description, image_url) VALUES
('scenery', '黄山', '天下第一奇山', '黄山位于安徽省南部黄山市境内，是世界文化与自然双重遗产，世界地质公园，国家5A级旅游景区。黄山以奇松、怪石、云海、温泉、冬雪"五绝"著称于世，被誉为"天下第一奇山"。黄山有72峰，主峰莲花峰海拔1864米。黄山风景区内有名松200多棵，其中最著名的有迎客松、送客松、蒲团松等。黄山怪石以奇取胜，以多著称，已被命名的怪石有120多处。黄山云海波澜壮阔，变幻莫测，是黄山第一奇观。黄山温泉水质优良，可饮可浴。黄山冬雪景观独特，雪后的黄山银装素裹，分外妖娆。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_6231976e-1a42-431f-a9ae-c609db47144a.jpg'),
('scenery', '宏村', '中国画里的乡村', '宏村位于安徽省黄山市黟县，是徽派古村落的代表，被誉为"中国画里的乡村"。宏村始建于南宋绍兴年间，距今已有900多年历史。全村现保存完好的明清古建筑有140余幢，主要景点有南湖、月沼、承志堂等。宏村的建筑布局独具匠心，村落选址、规划和建筑都体现了人与自然的和谐统一。村中的水系是宏村的一大特色，引西溪水入村，形成"牛形村落"的独特格局。宏村的徽派建筑以白墙黛瓦、马头墙为特色，建筑雕刻精美，是徽派建筑艺术的杰出代表。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_537fad72-237f-47d3-a771-91243bfeb5d5.jpg'),
('scenery', '九华山', '中国佛教四大名山', '九华山位于安徽省池州市青阳县境内，是中国佛教四大名山之一，是地藏菩萨的道场。九华山古称陵阳山、九子山，因有九峰形似莲花而得名。九华山有99峰，主峰十王峰海拔1342米。九华山是国家5A级旅游景区，世界地质公园。九华山佛教文化源远流长，有"东南第一山"、"莲花佛国"之称。山上寺庙众多，现有寺庙90余座，僧尼600余人。九华山风景秀丽，有"秀甲江南"之誉。九华山四季景色各异，春天山花烂漫，夏天清凉宜人，秋天层林尽染，冬天银装素裹。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_abcdef12-3456-7890-abcd-ef1234567890.jpg'),
('scenery', '天柱山', '古南岳', '天柱山位于安徽省安庆市潜山市境内，因主峰如"擎天一柱"而得名。天柱山又名潜山、皖山、皖公山，古称南岳。天柱山是国家5A级旅游景区，世界地质公园。天柱山以其雄、奇、灵、秀而著称，有"天柱一峰擎日月，洞门千仞锁云雷"之誉。天柱山主峰海拔1489.8米，山上有42座山峰，17处岩洞，86处怪石，18处瀑布。天柱山是道教名山，有"白岳"之称。天柱山风景优美，四季皆宜游览，春天山花烂漫，夏天清凉避暑，秋天层林尽染，冬天雾凇冰挂。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fedcba09-8765-4321-fedc-ba0987654321.jpg');

-- 插入初始内容数据（文化）
INSERT INTO contents (category, title, subtitle, description, image_url) VALUES
('culture', '徽文化', '中国三大地域文化之一', '徽文化是中国三大地域文化之一，指古徽州一府六县（歙县、黟县、休宁、祁门、绩溪、婺源）的物质文明和精神文明的总和。徽文化内涵丰富，在各个层面、各个领域都形成了独特的流派和风格。徽文化主要包括徽商、徽剧、徽菜、徽派建筑、徽派盆景、徽州三雕（木雕、石雕、砖雕）、徽州版画、徽墨、歙砚、徽州漆器、徽州竹编、徽州剪纸等。徽文化是中华文化的重要组成部分，对中国文化的发展产生了深远影响。徽商曾是中国十大商帮之首，"无徽不成镇"的说法流传至今。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ae49543e-b595-45d7-831e-7b485d0f8a10.jpg'),
('culture', '徽墨', '文房四宝之一', '徽墨是中国传统制墨技艺中的珍品，因产于古徽州府而得名，是"文房四宝"之一。徽墨始于南唐，创制于奚超、奚廷父子，距今已有1000多年历史。徽墨以松烟、桐油烟、漆烟、胶为主要原料，经过点烟、和料、杵捣、成型、晾干、描金等十几道工序精制而成。徽墨具有色泽黑润、坚而有光、入纸不晕、经久不褪、馨香浓郁等特点，素有"落纸如漆，万载存真"之誉。徽墨不仅是书写工具，更是艺术品，许多徽墨上雕刻有精美的图案和文字，具有很高的收藏价值。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_11111111-2222-3333-4444-555555555555.jpg'),
('culture', '宣纸', '纸中之王', '宣纸产于安徽省宣城市泾县，因古时属宣州府管辖而得名。宣纸始于唐代，距今已有1500多年历史，被誉为"纸中之王"、"千年寿纸"。宣纸以青檀树皮和沙田稻草为主要原料，经过浸泡、蒸煮、漂白、打浆、抄纸、晒纸、剪纸等108道工序手工制作而成。宣纸具有"韧而能润、光而不滑、洁白稠密、纹理纯净、搓折无损、润墨性强"等特点，有"轻似蝉翼白如雪，抖似细绸不闻声"之誉。宣纸是中国传统书画的最佳用纸，被列入世界非物质文化遗产名录。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_22222222-3333-4444-5555-666666666666.jpg'),
('culture', '黄梅戏', '中国五大戏曲剧种之一', '黄梅戏是中国五大戏曲剧种之一，原名"黄梅调"或"采茶戏"，起源于湖北黄梅，发展壮大于安徽安庆。黄梅戏唱腔淳朴流畅，以明快抒情见长，具有丰富的表现力。黄梅戏的表演质朴细致，以真实活泼著称。黄梅戏的代表作有《天仙配》、《女驸马》、《牛郎织女》等，其中《天仙配》中的"树上的鸟儿成双对"唱段家喻户晓。黄梅戏名家辈出，严凤英、王少舫、马兰、韩再芬等都是黄梅戏的杰出代表。黄梅戏被列入国家级非物质文化遗产名录，是安徽文化的重要名片。', 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_33333333-4444-5555-6666-777777777777.jpg');
```

---

## 说明

1. **目录结构**：完整展示了「皖美」小程序的项目组织方式，包括页面、组件、数据库、状态管理等模块。

2. **核心代码**：提供了6个关键文件的完整代码示例：
   - 应用配置（路由和TabBar）
   - 全局样式（徽派配色系统）
   - 数据库API（内容/点赞/收藏/评论/题库）
   - 状态管理（用户信息）
   - 类型定义（TypeScript接口）
   - 数据库迁移（表结构和初始数据）

3. **技术特点**：
   - 采用 Taro + React + TypeScript 技术栈
   - 使用 Tailwind CSS 实现徽派设计风格
   - Supabase 提供后端数据库服务
   - Zustand 进行轻量级状态管理
   - 完整的类型定义保证代码质量

4. **功能模块**：
   - 内容展示（美食/风景/文化）
   - 用户互动（点赞/收藏/评论）
   - 徽文化小问答（随机题目/印章收集）
   - 内容管理（全员可编辑）
   - 个人中心（收藏管理/昵称设置）
