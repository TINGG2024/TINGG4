# 徽文化小问答功能开发文档

## 功能概述

在"皖美视界"小程序首页新增"徽文化小问答"功能模块，通过趣味问答的形式帮助用户了解安徽文化，包括徽菜、徽派建筑、徽州民俗等内容。

---

## 一、功能入口与展示

### 1.1 首页入口

#### 位置
- 在首页"历史文化"按钮后面新增第四个按钮"徽文化小问答"
- 首页分类按钮布局从横向3个改为2行2列网格布局（grid-cols-2）

#### 按钮样式
- 图标：徽派书卷图标（`baidu_image_search_0d21dfd3-7586-4314-a3ad-578b6aac8fff.jpg`）
- 尺寸：70x70px
- 圆角：12px
- 文字：徽墨色"徽文化小问答"
- 点击动画：1.05倍缩放，0.3s过渡

#### 导航逻辑
```typescript
const navigateToCategory = (category: string) => {
  if (category === 'quiz') {
    Taro.navigateTo({url: '/pages/quiz/index'})
  } else {
    Taro.switchTab({url: `/pages/${category}/index`})
  }
}
```

### 1.2 问答页面主界面

#### 背景样式
- 背景：淡徽墨灰+宣纸纹理（`.xuan-paper-bg`类）
- 宣纸纹理透明度：3%

#### 标题区域
- 标题："徽派文化小问答"
- 字体：徽派书法体（`.hui-calligraphy-title`类）
- 字号：2xl（24px）
- 颜色：深徽墨色

#### 开始答题按钮
- 位置：标题右侧
- 样式：徽派红圆角按钮（`bg-hui-red text-white`）
- 圆角：8px（rounded-lg）
- 内边距：px-6 py-2
- 字号：text-sm（14px）

#### 说明文字卡片
- 背景：白色卡片（`bg-card`）
- 圆角：12px（rounded-xl）
- 内边距：16px（p-4）
- 内容：
  - 测测你对安徽文化的了解程度！
  - 共5道题，涵盖徽菜、徽派建筑、徽州民俗
  - 答对4题及以上可获得"徽文化达人"印章
  - 每题答完后会显示正确答案和解析

#### 题目预览列表
- 布局：垂直列表（space-y-3）
- 每个题目卡片：
  - 背景：白色卡片（`bg-card`）
  - 圆角：12px（rounded-xl）
  - 内边距：16px（p-4）
  - 题号：圆形徽墨灰背景（w-8 h-8，rounded-full）
  - 题目文字：text-sm
  - 已答标记：绿色对勾图标（`i-mdi-check-circle`）

---

## 二、答题核心逻辑

### 2.1 题库配置

#### 题目数量
- 默认5道题
- 涵盖徽菜、徽派建筑、徽州民俗三大类

#### 题目结构
```typescript
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number // 正确答案的索引（0-based）
  explanation: string
}
```

#### 示例题目
1. **马头墙最初的主要作用是？**
   - A. 美观
   - B. 防火（正确答案）
   - C. 防盗
   - 解析：马头墙又称防火墙，是徽派建筑的防火设计，可以有效阻止火势蔓延。

2. **臭鳜鱼的传统腌制时间约为？**
   - A. 1天
   - B. 7天（正确答案）
   - C. 15天
   - 解析：臭鳜鱼需要腌制约7天，让鱼肉发酵产生独特的臭味，这是徽菜的经典做法。

3. **黄梅戏的发源地是安徽哪个城市？**
   - A. 安庆（正确答案）
   - B. 黄山
   - C. 合肥
   - 解析：黄梅戏发源于安庆市，是中国五大戏曲剧种之一，被誉为"中国的乡村音乐剧"。

4. **徽州三雕指的是哪三种雕刻工艺？**
   - A. 木雕、石雕、砖雕（正确答案）
   - B. 木雕、玉雕、竹雕
   - C. 石雕、铜雕、泥雕
   - 解析：徽州三雕是指木雕、石雕、砖雕，是徽派建筑装饰的重要组成部分，工艺精湛。

5. **黄山四绝中不包括以下哪一项？**
   - A. 奇松
   - B. 怪石
   - C. 飞瀑（正确答案）
   - 解析：黄山四绝是指奇松、怪石、云海、温泉，飞瀑虽然也是黄山的特色，但不在四绝之列。

### 2.2 答题弹窗

#### 弹窗样式
- 全屏弹窗：`fixed inset-0 z-50`
- 背景遮罩：半透明黑色（`rgba(0,0,0,0.5)`）
- 内容背景：浅米黄宣纸纹理（`.xuan-paper-bg`）

#### 顶部装饰
- 徽派回纹装饰线（`.hui-pattern-line`）
- 题号显示：第 X 题
- 剩余题目：剩余题目：X/5

#### 题目显示区域
- 背景：白色卡片（`bg-card`）
- 圆角：12px（rounded-xl）
- 内边距：20px（p-5）
- 题目文字：text-base，leading-relaxed

#### 选项卡片样式
- 默认状态：
  - 背景：淡徽墨灰（`hsl(var(--hui-gray))`）
  - 边框：1px浅灰边框（`rgba(46, 75, 63, 0.15)`）
  - 圆角：8px
  - 内边距：16px
  - 过渡动画：0.3s ease

- 选中状态（`.quiz-option-selected`）：
  - 背景：徽派红（`hsl(var(--hui-red))`）
  - 边框：徽派红
  - 文字：白色

- 正确答案（`.quiz-option-correct`）：
  - 背景：徽派绿（`hsl(var(--hui-green))`）
  - 边框：徽派绿
  - 文字：白色
  - 图标：绿色对勾（`i-mdi-check-circle`）

- 错误答案（`.quiz-option-wrong`）：
  - 背景：徽派红（`hsl(var(--hui-red))`）
  - 边框：徽派红
  - 文字：白色
  - 图标：红色叉号（`i-mdi-close-circle`）

### 2.3 答题交互流程

#### 选择答案
```typescript
const handleSelectAnswer = (answerIndex: number) => {
  if (showFeedback) return // 已经显示反馈，不允许再选择

  setSelectedAnswer(answerIndex)
  setShowFeedback(true)

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const isCorrect = answerIndex === currentQuestion.correctAnswer

  if (isCorrect) {
    setCorrectCount((prev) => prev + 1)
  }

  setAnsweredQuestions((prev) => [...prev, currentQuestion.id])

  // 2秒后自动跳转到下一题或显示结果
  setTimeout(() => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      // 跳转到下一题
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      // 显示最终结果
      setShowResult(true)
    }
  }, 2000)
}
```

#### 即时反馈
- 选择答案后立即显示正确/错误提示
- 正确：
  - 绿色背景卡片（`.bg-hui-green-light`）
  - 绿色对勾图标+文字"回答正确！"
  - 显示解析文字
- 错误：
  - 红色背景卡片（`.bg-hui-red-light`）
  - 红色叉号图标+文字"回答错误"
  - 显示解析文字

#### 自动跳转
- 显示反馈2秒后自动跳转到下一题
- 无需手动点击"下一题"按钮
- 最后一题答完后自动显示结果页面

### 2.4 完成奖励

#### 结果页面
- 标题："答题完成！"（徽派书法体，3xl字号）
- 正确率卡片：
  - 背景：白色卡片（`bg-card`）
  - 圆角：12px（rounded-xl）
  - 内边距：32px（p-8）
  - 正确率：5xl字号，徽派红色
  - 计算公式：`Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)%`
  - 详细信息：答对 X 题，共 5 题

#### 印章奖励
- 条件：答对4题及以上
- 印章名称："徽文化达人"
- 显示样式：
  - 绿色背景卡片（`.bg-hui-green-light`）
  - 圆角：12px（rounded-xl）
  - 内边距：16px（p-4）
  - 印章图标：徽派印章图片（64x64px）
  - 提示文字："恭喜获得'徽文化达人'印章！"
  - 说明文字："已保存到个人中心的印章集"

#### 按钮操作
- 返回按钮：
  - 样式：浅灰色背景（`bg-muted text-muted-foreground`）
  - 功能：关闭弹窗，返回问答页面
- 再来一次按钮：
  - 样式：徽派红背景（`bg-hui-red text-white`）
  - 功能：重置所有状态，重新开始答题

---

## 三、数据存储

### 3.1 题库存储
- 当前方案：题库写死在前端（`QUIZ_QUESTIONS`常量）
- 后续优化：替换为接口获取，支持动态更新题库

### 3.2 答题记录存储

#### 存储位置
- 本地缓存：`Taro.setStorageSync('quizRecords', records)`

#### 数据结构
```typescript
interface QuizRecord {
  date: string // ISO格式时间戳
  correctCount: number // 答对题目数
  totalCount: number // 总题目数
}
```

#### 存储逻辑
```typescript
const quizRecord = {
  date: new Date().toISOString(),
  correctCount: isCorrect ? correctCount + 1 : correctCount,
  totalCount: QUIZ_QUESTIONS.length
}
const records = Taro.getStorageSync('quizRecords') || []
records.push(quizRecord)
Taro.setStorageSync('quizRecords', records)
```

### 3.3 印章记录存储

#### 存储位置
- 本地缓存：`Taro.setStorageSync('badges', badges)`

#### 数据结构
```typescript
type Badge = string // 印章名称数组
```

#### 存储逻辑
```typescript
if (quizRecord.correctCount >= 4) {
  const badges = Taro.getStorageSync('badges') || []
  if (!badges.includes('徽文化达人')) {
    badges.push('徽文化达人')
    Taro.setStorageSync('badges', badges)
    Taro.showToast({
      title: '获得"徽文化达人"印章！',
      icon: 'success',
      duration: 2000
    })
  }
}
```

---

## 四、视觉风格

### 4.1 配色方案

#### 徽派配色
- 徽墨灰：`#F1FAEE` / `hsl(60, 29%, 97%)`
- 徽派红：`#E63946` / `hsl(355, 78%, 57%)`
- 徽派绿：`#2E7D32` / `hsl(123, 38%, 32%)`
- 徽墨色：`hsl(0, 0%, 20%)`
- 浅米黄：`#FEFEFE`

#### 功能色
- 正确答案：徽派绿（`--hui-green`）
- 错误答案：徽派红（`--hui-red`）
- 选中状态：徽派红（`--hui-red`）
- 默认状态：淡徽墨灰（`--hui-gray`）

### 4.2 字体样式

#### 徽派书法体
- 字体族：`'STKaiti', 'KaiTi', 'SimKai', serif`
- 应用场景：标题、重要文字
- CSS类：`.hui-calligraphy-title`

#### 徽派行书体
- 字体族：`'STXingkai', 'STKaiti', 'KaiTi', 'SimKai', serif`
- 应用场景：提示文字、说明文字
- CSS类：`.hui-xingshu-text`

### 4.3 圆角设计
- 按钮圆角：8px（rounded-lg）
- 卡片圆角：12px（rounded-xl）
- 选项圆角：8px
- 题号圆角：50%（rounded-full）

### 4.4 阴影效果
- 卡片阴影：`0 2px 8px rgba(0, 0, 0, 0.04)`
- 按钮阴影：`0 2px 12px rgba(46, 75, 63, 0.15)`
- 选项阴影：无

---

## 五、兼容性与性能

### 5.1 微信小程序兼容性

#### 弹窗实现
- 使用固定定位（`fixed inset-0`）实现全屏弹窗
- 背景遮罩使用半透明黑色（`rgba(0,0,0,0.5)`）
- 弹窗内容使用flex布局（`flex flex-col`）

#### 动画过渡
- 选项卡片：`transition: all 0.3s ease`
- 按钮点击：`transform: scale(1.05)`
- 自动跳转：`setTimeout(() => {...}, 2000)`

#### 触摸交互
- 选项卡片：`onClick`事件
- 按钮：`onClick`事件
- 防止重复点击：`if (showFeedback) return`

### 5.2 性能优化

#### 状态管理
- 使用React Hooks管理状态
- 避免不必要的重渲染
- 使用`useState`和`useCallback`

#### 数据缓存
- 题库数据：常量存储，无需网络请求
- 答题记录：本地缓存，异步存储
- 印章记录：本地缓存，异步存储

#### 图片优化
- 图标图片：使用CDN加速
- 图片尺寸：合理控制，避免过大
- 图片格式：JPEG/PNG

### 5.3 适配不同手机尺寸

#### 布局适配
- 使用flex布局和grid布局
- 使用相对单位（%、vh、vw）
- 使用Tailwind CSS响应式类

#### 字体适配
- 使用rem/px单位
- 避免固定字号
- 保持合理的行高（leading-relaxed）

---

## 六、技术实现细节

### 6.1 文件结构
```
src/pages/quiz/
├── index.tsx          # 问答页面主文件
└── index.config.ts    # 页面配置文件
```

### 6.2 路由配置
```typescript
// src/app.config.ts
const pages = [
  'pages/home/index',
  'pages/food/index',
  'pages/scenery/index',
  'pages/culture/index',
  'pages/economy/index',
  'pages/detail/index',
  'pages/quiz/index',  // 新增问答页面路由
  'pages/my/index'
]
```

### 6.3 CSS样式类
```scss
// 问答选项卡片
.quiz-option {
  background: hsl(var(--hui-gray));
  border: 1px solid rgba(46, 75, 63, 0.15);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quiz-option-selected {
  background: hsl(var(--hui-red));
  border-color: hsl(var(--hui-red));
  color: white;
}

.quiz-option-correct {
  background: hsl(var(--hui-green));
  border-color: hsl(var(--hui-green));
  color: white;
}

.quiz-option-wrong {
  background: hsl(var(--hui-red));
  border-color: hsl(var(--hui-red));
  color: white;
}

// 徽派绿色（正确答案）
.bg-hui-green-light {
  background: rgba(46, 125, 50, 0.1);
}

.text-hui-green {
  color: #2E7D32;
}

// 徽派红色（错误答案）
.bg-hui-red-light {
  background: rgba(230, 57, 70, 0.1);
}
```

### 6.4 状态管理
```typescript
const [showQuizModal, setShowQuizModal] = useState(false) // 是否显示答题弹窗
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0) // 当前题目索引
const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null) // 选中的答案
const [showFeedback, setShowFeedback] = useState(false) // 是否显示反馈
const [correctCount, setCorrectCount] = useState(0) // 答对题目数
const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]) // 已答题目ID
const [showResult, setShowResult] = useState(false) // 是否显示结果页面
```

---

## 七、后续优化方向

### 7.1 题库管理
- 接入后端API，支持动态获取题库
- 支持题库分类（徽菜、建筑、民俗等）
- 支持题库难度分级（简单、中等、困难）
- 支持题库更新和版本管理

### 7.2 答题记录
- 在"我的"页面显示答题历史
- 显示答题统计（总答题次数、平均正确率）
- 显示印章集合和获得时间
- 支持分享答题成绩到朋友圈

### 7.3 社交功能
- 支持邀请好友一起答题
- 支持答题排行榜
- 支持答题挑战赛
- 支持答题成就系统

### 7.4 内容扩展
- 增加更多题目类型（判断题、多选题、填空题）
- 增加图片题（识别徽派建筑、徽菜等）
- 增加音频题（识别黄梅戏、徽剧等）
- 增加视频题（识别安徽风景、文化等）

---

## 八、测试要点

### 8.1 功能测试
- ✅ 首页按钮点击跳转到问答页面
- ✅ 问答页面显示题目预览列表
- ✅ 点击"开始答题"弹出答题弹窗
- ✅ 选择答案后显示正确/错误反馈
- ✅ 2秒后自动跳转到下一题
- ✅ 答完5题后显示结果页面
- ✅ 答对4题及以上获得印章
- ✅ 印章保存到本地缓存
- ✅ 答题记录保存到本地缓存
- ✅ 点击"返回"关闭弹窗
- ✅ 点击"再来一次"重新答题

### 8.2 样式测试
- ✅ 首页按钮2行2列布局正确
- ✅ 问答页面宣纸纹理背景显示正确
- ✅ 答题弹窗全屏显示正确
- ✅ 选项卡片样式正确（默认、选中、正确、错误）
- ✅ 反馈卡片样式正确（绿色、红色）
- ✅ 结果页面样式正确
- ✅ 印章奖励样式正确

### 8.3 兼容性测试
- ✅ 微信小程序环境正常运行
- ✅ H5环境正常运行
- ✅ 不同手机尺寸适配正确
- ✅ 触摸交互流畅
- ✅ 动画过渡流畅

---

## 九、总结

"徽文化小问答"功能模块成功集成到"皖美视界"小程序中，通过趣味问答的形式帮助用户了解安徽文化。功能完整，交互流畅，视觉风格与小程序整体风格统一，符合徽派雅致风格设计要求。

### 核心亮点
1. **徽派风格统一**：配色、字体、圆角、阴影等视觉元素与小程序整体风格完美融合
2. **交互流畅**：选择答案后立即反馈，2秒后自动跳转，无需手动操作
3. **奖励机制**：答对4题及以上获得"徽文化达人"印章，增强用户参与感
4. **数据持久化**：答题记录和印章记录保存到本地缓存，支持后续查看
5. **兼容性好**：支持微信小程序和H5环境，适配不同手机尺寸

### 技术特点
1. **React Hooks**：使用useState管理状态，代码简洁清晰
2. **Tailwind CSS**：使用Tailwind CSS实现响应式布局和样式
3. **Taro框架**：使用Taro框架实现跨平台开发
4. **本地缓存**：使用Taro.setStorageSync实现数据持久化
5. **TypeScript**：使用TypeScript提供类型安全

---

© 2025 皖美视界 · 徽文化小问答功能开发文档
