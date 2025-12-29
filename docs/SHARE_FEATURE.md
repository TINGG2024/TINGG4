# 微信分享功能实现文档

## 功能概述

为"皖美视界"安徽介绍微信小程序实现完整的微信分享功能，支持分享到聊天和朋友圈，提升小程序传播力和用户参与度。

## 分享类型

### 1. 分享到聊天（Share to Chat）
- 用户可以将小程序页面分享给微信好友或群聊
- 支持自定义分享标题和路径
- 通过右上角菜单或页面内分享按钮触发

### 2. 分享到朋友圈（Share to Timeline）
- 用户可以将小程序页面分享到微信朋友圈
- 支持自定义分享标题
- 只能通过右上角菜单触发（微信限制）

## 技术实现

### 核心API

#### useShareAppMessage（分享到聊天）
```typescript
import { useShareAppMessage } from '@tarojs/taro'

useShareAppMessage(() => ({
  title: '分享标题',
  path: '/pages/xxx/index?param=value'
}))
```

#### useShareTimeline（分享到朋友圈）
```typescript
import { useShareTimeline } from '@tarojs/taro'

useShareTimeline(() => ({
  title: '分享标题'
}))
```

### 分享按钮实现

#### 微信小程序环境
```tsx
<Button openType="share">分享</Button>
```

#### H5环境兼容
```tsx
import { getEnv, showToast } from '@tarojs/taro'

const handleShare = () => {
  showToast({
    title: '分享功能仅在微信小程序中可用',
    icon: 'none',
    duration: 2000
  })
}

const isWeApp = getEnv() === 'WEAPP'

<Button {...(isWeApp ? { openType: 'share' } : { onClick: handleShare })}>
  分享
</Button>
```

## 各页面分享配置

### 1. 首页（/pages/home/index.tsx）

#### 分享内容
- **标题**：皖美视界 · 一脚踏进徽州，一眼看尽江淮
- **路径**：/pages/home/index
- **场景**：用户想要分享整个小程序给朋友

#### 分享按钮位置
- 顶部Banner右上角
- 半透明白色背景，毛玻璃效果
- 图标+文字组合

#### 实现代码
```tsx
// 分享配置
useShareAppMessage(() => ({
  title: '皖美视界 · 一脚踏进徽州，一眼看尽江淮',
  path: '/pages/home/index'
}))

useShareTimeline(() => ({
  title: '皖美视界 · 一脚踏进徽州，一眼看尽江淮'
}))

// 分享按钮
<View className="absolute top-4 right-4 z-10">
  <Button
    className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center break-keep text-sm"
    size="mini"
    {...(isWeApp ? {openType: 'share'} : {onClick: handleShare})}>
    <View className="i-mdi-share-variant text-lg mr-1" />
    <Text>分享</Text>
  </Button>
</View>
```

### 2. 详情页（/pages/detail/index.tsx）

#### 分享内容
- **标题**：皖美 · {内容标题}
- **路径**：/pages/detail/index?id={contentId}
- **场景**：用户想要分享具体的美食、风景或文化内容

#### 分享按钮位置
- 底部操作栏（与点赞、收藏、评论并列）
- 图标+文字垂直布局
- 浅灰色图标和文字

#### 实现代码
```tsx
// 分享配置
useShareAppMessage(() => ({
  title: content ? `皖美 · ${content.title}` : '皖美',
  path: `/pages/detail/index?id=${contentId}`
}))

useShareTimeline(() => ({
  title: content ? `皖美 · ${content.title}` : '皖美'
}))

// 分享按钮
<Button
  className="flex flex-col items-center bg-transparent border-none p-0 m-0 break-keep text-xs"
  size="mini"
  {...(isWeApp ? {openType: 'share'} : {onClick: handleShare})}>
  <View className="i-mdi-share-variant text-2xl text-muted-foreground" />
  <Text className="text-xs mt-1 text-muted-foreground">分享</Text>
</Button>
```

### 3. 我的页面（/pages/my/index.tsx）

#### 分享内容
- **标题**：我在皖美视界收藏了{收藏数}个内容，获得了{印章数}枚印章！
- **路径**：/pages/home/index
- **场景**：用户想要炫耀自己的成就

#### 分享按钮位置
- 头部右上角
- 半透明白色背景，毛玻璃效果
- 图标+文字组合

#### 实现代码
```tsx
// 分享配置
useShareAppMessage(() => ({
  title: `我在皖美视界收藏了${favorites.length}个内容，获得了${badges.length}枚印章！`,
  path: '/pages/home/index'
}))

useShareTimeline(() => ({
  title: `我在皖美视界收藏了${favorites.length}个内容，获得了${badges.length}枚印章！`
}))

// 分享按钮
<View className="absolute top-4 right-4 z-20">
  <Button
    className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center break-keep text-xs"
    size="mini"
    {...(isWeApp ? {openType: 'share'} : {onClick: handleShare})}>
    <View className="i-mdi-share-variant text-base mr-1" />
    <Text>分享</Text>
  </Button>
</View>
```

### 4. 其他页面

以下页面已配置基础分享功能（通过右上角菜单触发）：

#### 美食文化页面（/pages/food/index.tsx）
- **标题**：皖美 · 徽菜美食
- **路径**：/pages/food/index

#### 自然风景页面（/pages/scenery/index.tsx）
- **标题**：皖美 · 自然风景
- **路径**：/pages/scenery/index

#### 历史文化页面（/pages/culture/index.tsx）
- **标题**：皖美 · 历史文化
- **路径**：/pages/culture/index

#### 经济发展页面（/pages/economy/index.tsx）
- **标题**：皖美 · 经济发展
- **路径**：/pages/economy/index

#### 问答页面（/pages/quiz/index.tsx）
- **标题**：徽派文化小问答 · 测测你对安徽文化的了解
- **路径**：/pages/quiz/index

## 视觉设计

### 分享按钮样式

#### 顶部Banner分享按钮（首页、我的页面）
```css
/* 半透明白色背景 */
bg-white bg-opacity-20

/* 毛玻璃效果 */
backdrop-blur-sm

/* 白色文字 */
text-white

/* 圆角胶囊形状 */
rounded-full

/* 内边距 */
px-4 py-2 (首页)
px-3 py-1.5 (我的页面)

/* 字体大小 */
text-sm (首页)
text-xs (我的页面)

/* 图标大小 */
text-lg (首页)
text-base (我的页面)
```

#### 底部操作栏分享按钮（详情页）
```css
/* 透明背景 */
bg-transparent

/* 无边框 */
border-none

/* 垂直布局 */
flex flex-col items-center

/* 浅灰色图标和文字 */
text-muted-foreground

/* 图标大小 */
text-2xl

/* 字体大小 */
text-xs
```

### 图标使用
- **分享图标**：i-mdi-share-variant
- **Material Design Icons**：统一使用MDI图标库

## 用户体验优化

### 1. 环境兼容性
- **微信小程序环境**：使用`openType="share"`触发原生分享
- **H5环境**：点击按钮显示Toast提示"分享功能仅在微信小程序中可用"

### 2. 分享内容优化
- **动态标题**：根据页面内容动态生成分享标题
- **带参数路径**：分享路径包含必要参数（如内容ID），确保接收者能直达目标页面
- **成就炫耀**：我的页面分享包含用户成就数据，增强分享动机

### 3. 视觉反馈
- **按钮状态**：分享按钮有明确的视觉样式，易于识别
- **位置合理**：分享按钮位于用户习惯的位置（右上角或底部操作栏）
- **图标清晰**：使用通用的分享图标，用户一眼就能识别

### 4. 分享场景设计

#### 场景1：用户发现有趣内容
- 在详情页底部操作栏点击分享按钮
- 分享给好友或群聊
- 好友点击后直达该内容详情页

#### 场景2：用户想推荐小程序
- 在首页右上角点击分享按钮
- 分享到朋友圈或好友
- 好友点击后进入首页，浏览所有内容

#### 场景3：用户炫耀成就
- 在我的页面右上角点击分享按钮
- 分享标题包含收藏数和印章数
- 好友看到成就后也想尝试

## 技术细节

### 1. 环境判断
```typescript
import { getEnv } from '@tarojs/taro'

const isWeApp = getEnv() === 'WEAPP'
```

### 2. 条件属性传递
```tsx
// 使用展开运算符根据环境传递不同属性
<Button
  {...(isWeApp ? { openType: 'share' } : { onClick: handleShare })}
>
  分享
</Button>
```

### 3. Toast提示
```typescript
import { showToast } from '@tarojs/taro'

const handleShare = () => {
  showToast({
    title: '分享功能仅在微信小程序中可用',
    icon: 'none',
    duration: 2000
  })
}
```

### 4. 动态分享内容
```typescript
// 根据页面数据动态生成分享标题
useShareAppMessage(() => ({
  title: content ? `皖美 · ${content.title}` : '皖美',
  path: `/pages/detail/index?id=${contentId}`
}))
```

## 测试要点

### 1. 微信小程序环境测试
- [ ] 点击分享按钮能正常触发分享面板
- [ ] 分享到聊天后，好友能正常打开
- [ ] 分享到朋友圈后，能正常显示
- [ ] 分享标题和路径正确
- [ ] 带参数的分享路径能正确跳转

### 2. H5环境测试
- [ ] 点击分享按钮显示Toast提示
- [ ] Toast提示文字正确
- [ ] 不会报错或崩溃

### 3. 视觉测试
- [ ] 分享按钮位置合理
- [ ] 分享按钮样式美观
- [ ] 图标清晰可见
- [ ] 文字易于阅读

### 4. 交互测试
- [ ] 分享按钮点击响应灵敏
- [ ] 分享面板能正常关闭
- [ ] 分享后返回小程序正常

### 5. 数据测试
- [ ] 详情页分享包含正确的内容ID
- [ ] 我的页面分享包含正确的收藏数和印章数
- [ ] 动态标题生成正确

## 数据统计建议

### 分享数据追踪
1. **分享次数统计**：记录每个页面的分享次数
2. **分享来源追踪**：通过路径参数追踪分享来源
3. **分享转化率**：统计分享后的新用户数量
4. **热门分享内容**：统计哪些内容被分享最多

### 实现方式
```typescript
// 在分享配置中添加来源参数
useShareAppMessage(() => ({
  title: '皖美视界',
  path: `/pages/home/index?from=share&userId=${userId}`
}))

// 在页面加载时记录分享来源
useDidShow(() => {
  const { from, userId } = router.params
  if (from === 'share') {
    // 记录分享转化数据
    trackShareConversion(userId)
  }
})
```

## 后续优化方向

### 1. 分享海报生成
- 生成精美的分享海报图片
- 包含二维码和关键信息
- 用户可以保存到相册后分享

### 2. 分享奖励机制
- 分享后获得积分或印章
- 好友通过分享链接注册后获得奖励
- 增加分享动力

### 3. 分享内容优化
- 根据用户行为智能推荐分享内容
- 自动生成吸引人的分享标题
- 添加分享图片（imageUrl参数）

### 4. 分享统计面板
- 在我的页面显示分享统计
- 展示分享次数、转化人数等数据
- 增强用户成就感

## 注意事项

### 1. 微信限制
- 分享到朋友圈只能通过右上角菜单触发
- 分享到朋友圈后会进入"单页模式"，功能受限
- 分享图片需要符合微信规范（大小、格式）

### 2. 路径参数
- 分享路径必须是小程序已注册的页面
- 路径参数不能过长（微信有长度限制）
- 特殊字符需要URL编码

### 3. 标题长度
- 分享标题不宜过长（建议20字以内）
- 标题要吸引人，激发点击欲望
- 避免使用敏感词汇

### 4. 用户体验
- 分享按钮不要过于突兀
- 不要强制用户分享
- 分享后给予正面反馈

## 文件修改清单

- `src/pages/home/index.tsx`：添加首页分享按钮
- `src/pages/detail/index.tsx`：添加详情页分享按钮
- `src/pages/my/index.tsx`：添加我的页面分享按钮，优化分享标题
- `docs/SHARE_FEATURE.md`：本文档

## 版本信息

- **版本号**：v1.0.0
- **更新日期**：2025-12-23
- **开发者**：秒哒AI助手
- **项目名称**：皖美视界 - 安徽介绍微信小程序

## 总结

微信分享功能是小程序传播的核心功能之一。通过在关键页面添加分享按钮，优化分享内容，提升用户分享意愿，可以有效提高小程序的传播力和用户增长。本次实现覆盖了首页、详情页、我的页面三个核心页面，其他页面也配置了基础分享功能，为小程序的传播打下了坚实基础。
