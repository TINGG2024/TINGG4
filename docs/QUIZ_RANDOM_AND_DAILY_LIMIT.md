# 徽派文化趣味问答功能升级文档

## 升级概述

本次升级将徽派文化小问答功能从固定5道题升级为20道题库+随机抽题+每日答题次数限制，提升用户体验和答题趣味性。

## 核心功能

### 1. 题库扩展（5道 → 20道）

#### 题目分类
- **徽派建筑类**（7道题）：马头墙、天井、三雕、宏村、西递、八字门、三间两厢
- **徽菜美食类**（7道题）：臭鳜鱼、毛豆腐、一品锅、黄山烧饼、刀板香、黄山毛峰、问政山笋
- **徽州民俗类**（6道题）：黄梅戏、晒秋、婚俗、徽剧、徽墨、商字门

#### 题目结构
```typescript
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: 'architecture' | 'food' | 'culture' // 新增分类字段
}
```

### 2. 随机抽题算法

#### 抽题规则
- 每次答题随机抽取5道不重复题目
- 确保建筑、美食、民俗三大类各至少1道题
- 剩余2道题从所有题库中随机抽取
- 最后打乱题目顺序

#### 实现代码
```typescript
function getRandomQuestions(): QuizQuestion[] {
  // 1. 按分类筛选题目
  const architectureQuestions = QUIZ_QUESTIONS.filter((q) => q.category === 'architecture')
  const foodQuestions = QUIZ_QUESTIONS.filter((q) => q.category === 'food')
  const cultureQuestions = QUIZ_QUESTIONS.filter((q) => q.category === 'culture')

  // 2. 从每个分类中随机抽取至少1道
  const selectedQuestions: QuizQuestion[] = []
  selectedQuestions.push(architectureQuestions[Math.floor(Math.random() * architectureQuestions.length)])
  selectedQuestions.push(foodQuestions[Math.floor(Math.random() * foodQuestions.length)])
  selectedQuestions.push(cultureQuestions[Math.floor(Math.random() * cultureQuestions.length)])

  // 3. 从剩余题目中随机抽取2道
  const remainingQuestions = QUIZ_QUESTIONS.filter((q) => !selectedQuestions.find((sq) => sq.id === q.id))
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length)
    selectedQuestions.push(remainingQuestions[randomIndex])
    remainingQuestions.splice(randomIndex, 1)
  }

  // 4. 打乱顺序
  return selectedQuestions.sort(() => Math.random() - 0.5)
}
```

### 3. 每日答题次数限制

#### 限制规则
- 每人每天最多3次答题机会
- 每日0点自动重置次数
- 次数用尽后按钮禁用，提示"今日答题次数已用完，明天再来吧"

#### 数据结构
```typescript
interface DailyQuizRecord {
  date: string // 日期（YYYY-MM-DD）
  count: number // 当日答题次数
}
```

#### 核心函数

**获取今日日期**
```typescript
function getTodayDate(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}
```

**获取今日答题次数**
```typescript
function getDailyQuizCount(): number {
  const record: DailyQuizRecord = Taro.getStorageSync('dailyQuizRecord') || {date: '', count: 0}
  const today = getTodayDate()

  // 如果日期不是今天，重置次数
  if (record.date !== today) {
    return 0
  }

  return record.count
}
```

**增加答题次数**
```typescript
function incrementDailyQuizCount(): void {
  const today = getTodayDate()
  const record: DailyQuizRecord = Taro.getStorageSync('dailyQuizRecord') || {date: '', count: 0}

  // 如果日期不是今天，重置次数
  if (record.date !== today) {
    Taro.setStorageSync('dailyQuizRecord', {date: today, count: 1})
  } else {
    Taro.setStorageSync('dailyQuizRecord', {date: today, count: record.count + 1})
  }
}
```

### 4. UI界面优化

#### 今日剩余次数显示
```tsx
<View className="flex items-center justify-center mb-4">
  <Text className="text-sm text-muted-foreground">今日剩余次数：</Text>
  <Text className="text-xl font-bold text-hui-red mx-1">{remainingCount}</Text>
  <Text className="text-sm text-muted-foreground">/3</Text>
</View>
```

#### 开始答题按钮状态
```tsx
<Button
  className={`w-full py-4 rounded-xl break-keep text-base font-bold ${
    dailyQuizCount >= 3
      ? 'bg-muted text-muted-foreground opacity-50'
      : 'bg-hui-red text-white'
  }`}
  size="default"
  onClick={handleStartQuiz}
  disabled={dailyQuizCount >= 3}>
  {dailyQuizCount >= 3 ? '今日次数已用完' : '开始答题'}
</Button>
```

#### 说明文字更新
- **题目范围**：每次随机抽取5道题，涵盖徽菜美食、徽派建筑、徽州民俗等安徽特色文化
- **奖励机制**：答对4题及以上（正确率≥80%）可获得"徽文化达人"印章，每日最多3枚
- **答题次数**：每人每天最多3次答题机会，每日0点自动重置

#### 题库说明卡片
替换原有的题目预览卡片，改为题库说明卡片，展示三大类题目的概况：
- 徽派建筑：马头墙、天井、三雕等7道题
- 徽菜美食：臭鳜鱼、毛豆腐、一品锅等7道题
- 徽州民俗：黄梅戏、晒秋、徽墨等6道题

### 5. 奖励机制调整

#### 印章奖励规则
- 每次答题完成（无论正确率），消耗1次答题机会
- 只有正确率≥80%（答对4-5题），才能获得1枚"徽文化达人"印章
- 每日最多获得3枚印章（对应3次答题机会）

#### 实现逻辑
```typescript
// 答题完成后
const finalCorrectCount = isCorrect ? correctCount + 1 : correctCount

// 消耗1次答题机会
incrementDailyQuizCount()
setDailyQuizCount((prev) => prev + 1)

// 如果答对4题及以上（正确率≥80%），奖励印章
if (finalCorrectCount >= 4) {
  const badges = Taro.getStorageSync('badges') || []
  // 每次答对都添加一枚印章（每日最多3枚）
  badges.push('徽文化达人')
  Taro.setStorageSync('badges', badges)
  Taro.showToast({
    title: '获得"徽文化达人"印章！',
    icon: 'success',
    duration: 2000
  })
}
```

### 6. 视觉风格统一

#### 配色方案
- **次数提示文字**：徽派灰（text-muted-foreground）
- **次数数字**：徽派红（text-hui-red），字号xl，加粗
- **禁用按钮**：浅灰背景（bg-muted），浅灰文字（text-muted-foreground），50%透明度（opacity-50）
- **正常按钮**：徽派红背景（bg-hui-red），白色文字（text-white）

#### 图标使用
- 题目范围：书本图标（i-mdi-book-open-variant）
- 奖励机制：奖杯图标（i-mdi-trophy）
- 答题次数：日历时钟图标（i-mdi-calendar-clock）
- 题库说明：数据库图标（i-mdi-database）
- 徽派建筑：建筑图标（i-mdi-home-city）
- 徽菜美食：美食图标（i-mdi-food）
- 徽州民俗：戏剧面具图标（i-mdi-drama-masks）

## 技术实现细节

### 1. 状态管理
```typescript
const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]) // 当前答题的5道题
const [dailyQuizCount, setDailyQuizCount] = useState(0) // 今日答题次数
```

### 2. 页面显示时刷新次数
```typescript
useDidShow(() => {
  const count = getDailyQuizCount()
  setDailyQuizCount(count)
})
```

### 3. 开始答题逻辑
```typescript
const handleStartQuiz = () => {
  // 检查答题次数
  if (dailyQuizCount >= 3) {
    Taro.showToast({
      title: '今日答题次数已用完，明天再来吧',
      icon: 'none',
      duration: 2000
    })
    return
  }

  // 随机抽取5道题
  const randomQuestions = getRandomQuestions()
  setCurrentQuestions(randomQuestions)

  // 初始化答题状态
  setShowQuizModal(true)
  setCurrentQuestionIndex(0)
  setSelectedAnswer(null)
  setShowFeedback(false)
  setCorrectCount(0)
  setAnsweredQuestions([])
  setShowResult(false)
}
```

### 4. 重新答题逻辑
```typescript
const handleRetry = () => {
  // 检查答题次数
  if (dailyQuizCount >= 3) {
    Taro.showToast({
      title: '今日答题次数已用完，明天再来吧',
      icon: 'none',
      duration: 2000
    })
    handleCloseModal()
    return
  }

  // 随机抽取新的5道题
  const randomQuestions = getRandomQuestions()
  setCurrentQuestions(randomQuestions)

  // 重置答题状态
  setShowResult(false)
  setCurrentQuestionIndex(0)
  setSelectedAnswer(null)
  setShowFeedback(false)
  setCorrectCount(0)
  setAnsweredQuestions([])
}
```

## 数据存储

### 本地缓存结构

#### 每日答题记录
```typescript
// 存储键：dailyQuizRecord
{
  date: '2025-12-23', // 日期（YYYY-MM-DD）
  count: 2 // 当日答题次数
}
```

#### 答题历史记录
```typescript
// 存储键：quizRecords
[
  {
    date: '2025-12-23T10:30:00.000Z', // ISO时间戳
    correctCount: 4, // 答对题数
    totalCount: 5 // 总题数
  },
  // ...更多记录
]
```

#### 印章记录
```typescript
// 存储键：badges
['徽文化达人', '徽文化达人', '徽文化达人'] // 每日最多3枚
```

## 用户体验优化

### 1. 答题次数限制提示
- 次数用尽时，按钮变为灰色禁用状态
- 点击按钮时弹出Toast提示："今日答题次数已用完，明天再来吧"
- 次数显示清晰：今日剩余次数：X/3

### 2. 随机抽题体验
- 每次答题题目不同，增加趣味性
- 确保三大类题目均衡出现，避免偏科
- 题目顺序随机，避免记忆答案

### 3. 印章奖励激励
- 每日最多3枚印章，鼓励用户每天答题
- 正确率≥80%才能获得印章，保证答题质量
- 印章在"我的"页面展示，增强成就感

### 4. 缓存逻辑稳定性
- 切换页面后次数不丢失
- 重启小程序后次数保持
- 每日0点自动重置次数

## 测试要点

### 1. 随机抽题测试
- [ ] 每次答题题目不同
- [ ] 建筑、美食、民俗各至少1道
- [ ] 题目不重复
- [ ] 题目顺序随机

### 2. 答题次数限制测试
- [ ] 初始次数为3
- [ ] 每次答题消耗1次
- [ ] 次数用尽后按钮禁用
- [ ] 次数用尽后点击提示
- [ ] 每日0点自动重置

### 3. 印章奖励测试
- [ ] 答对4题及以上获得印章
- [ ] 答对3题及以下不获得印章
- [ ] 每日最多3枚印章
- [ ] 印章在"我的"页面正确显示

### 4. 缓存逻辑测试
- [ ] 切换页面后次数保持
- [ ] 重启小程序后次数保持
- [ ] 跨日期后次数重置

### 5. UI显示测试
- [ ] 次数显示正确
- [ ] 按钮状态正确
- [ ] 禁用样式正确
- [ ] 题库说明显示正确

## 后续优化方向

1. **题库扩展**：继续增加题目数量，丰富题库内容
2. **难度分级**：增加简单、中等、困难三个难度级别
3. **排行榜**：添加答题排行榜，增强竞争性
4. **答题记录详情**：展示每次答题的详细记录和错题回顾
5. **分享功能**：分享答题成绩到朋友圈，增加传播性
6. **印章系统扩展**：增加更多类型的印章，如"建筑大师"、"美食专家"、"民俗达人"等

## 文件修改清单

- `src/pages/quiz/index.tsx`：主要修改文件，包含所有新功能
- `src/pages/my/index.tsx`：印章显示逻辑已支持多枚印章
- `docs/QUIZ_RANDOM_AND_DAILY_LIMIT.md`：本文档

## 版本信息

- **版本号**：v2.0.0
- **更新日期**：2025-12-23
- **开发者**：秒哒AI助手
- **项目名称**：皖美视界 - 安徽介绍微信小程序
