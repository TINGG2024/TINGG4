import {supabase} from '@/client/supabase'
import type {Comment, Content, ContentCategory} from '@/types/content'

// ==================== 内容相关 ====================

/**
 * 获取指定分类的内容列表
 */
export async function getContentsByCategory(category: ContentCategory): Promise<Content[]> {
  const {data, error} = await supabase
    .from('contents')
    .select('*')
    .eq('category', category)
    .order('created_at', {ascending: false})

  if (error) {
    console.error('获取内容列表失败:', error)
    return []
  }

  return data || []
}

/**
 * 获取内容详情
 */
export async function getContentById(id: string): Promise<Content | null> {
  const {data, error} = await supabase.from('contents').select('*').eq('id', id).single()

  if (error) {
    console.error('获取内容详情失败:', error)
    return null
  }

  return data
}

/**
 * 获取所有内容（用于首页展示）
 */
export async function getAllContents(): Promise<Content[]> {
  const {data, error} = await supabase.from('contents').select('*').order('created_at', {ascending: false})

  if (error) {
    console.error('获取所有内容失败:', error)
    return []
  }

  return data || []
}

// ==================== 点赞相关 ====================

/**
 * 检查用户是否已点赞
 */
export async function checkUserLiked(contentId: string, userId: string): Promise<boolean> {
  const {data, error} = await supabase.from('likes').select('id').eq('content_id', contentId).eq('user_id', userId)

  if (error) {
    console.error('检查点赞状态失败:', error)
    return false
  }

  return data && data.length > 0
}

/**
 * 点赞
 */
export async function likeContent(contentId: string, userId: string): Promise<boolean> {
  // 插入点赞记录
  const {error: likeError} = await supabase.from('likes').insert({content_id: contentId, user_id: userId})

  if (likeError) {
    console.error('点赞失败:', likeError)
    return false
  }

  // 更新点赞数
  const {error: updateError} = await supabase.rpc('increment_likes_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新点赞数失败:', updateError)
  }

  return true
}

/**
 * 取消点赞
 */
export async function unlikeContent(contentId: string, userId: string): Promise<boolean> {
  // 删除点赞记录
  const {error: unlikeError} = await supabase.from('likes').delete().eq('content_id', contentId).eq('user_id', userId)

  if (unlikeError) {
    console.error('取消点赞失败:', unlikeError)
    return false
  }

  // 更新点赞数
  const {error: updateError} = await supabase.rpc('decrement_likes_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新点赞数失败:', updateError)
  }

  return true
}

// ==================== 收藏相关 ====================

/**
 * 检查用户是否已收藏
 */
export async function checkUserFavorited(contentId: string, userId: string): Promise<boolean> {
  const {data, error} = await supabase.from('favorites').select('id').eq('content_id', contentId).eq('user_id', userId)

  if (error) {
    console.error('检查收藏状态失败:', error)
    return false
  }

  return data && data.length > 0
}

/**
 * 收藏
 */
export async function favoriteContent(contentId: string, userId: string): Promise<boolean> {
  // 插入收藏记录
  const {error: favoriteError} = await supabase.from('favorites').insert({content_id: contentId, user_id: userId})

  if (favoriteError) {
    console.error('收藏失败:', favoriteError)
    return false
  }

  // 更新收藏数
  const {error: updateError} = await supabase.rpc('increment_favorites_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新收藏数失败:', updateError)
  }

  return true
}

/**
 * 取消收藏
 */
export async function unfavoriteContent(contentId: string, userId: string): Promise<boolean> {
  // 删除收藏记录
  const {error: unfavoriteError} = await supabase
    .from('favorites')
    .delete()
    .eq('content_id', contentId)
    .eq('user_id', userId)

  if (unfavoriteError) {
    console.error('取消收藏失败:', unfavoriteError)
    return false
  }

  // 更新收藏数
  const {error: updateError} = await supabase.rpc('decrement_favorites_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新收藏数失败:', updateError)
  }

  return true
}

/**
 * 获取用户收藏的内容列表
 */
export async function getUserFavorites(userId: string): Promise<Content[]> {
  const {data, error} = await supabase
    .from('favorites')
    .select('content_id, contents(*)')
    .eq('user_id', userId)
    .order('created_at', {ascending: false})

  if (error) {
    console.error('获取收藏列表失败:', error)
    return []
  }

  // 提取内容数据
  const contents = data?.map((item: any) => item.contents).filter(Boolean) || []
  return contents
}

// ==================== 评论相关 ====================

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
    console.error('获取评论列表失败:', error)
    return []
  }

  return data || []
}

/**
 * 添加评论
 */
export async function addComment(
  contentId: string,
  userId: string,
  nickname: string,
  commentText: string
): Promise<boolean> {
  // 插入评论
  const {error: commentError} = await supabase.from('comments').insert({
    content_id: contentId,
    user_id: userId,
    nickname,
    comment_text: commentText
  })

  if (commentError) {
    console.error('添加评论失败:', commentError)
    return false
  }

  // 更新评论数
  const {error: updateError} = await supabase.rpc('increment_comments_count', {
    content_id: contentId
  })

  if (updateError) {
    console.error('更新评论数失败:', updateError)
  }

  return true
}

// ==================== 题库管理相关 ====================

export interface QuizQuestion {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  correct_answer: string
  explanation: string | null
  created_at: string
  updated_at: string
}

/**
 * 获取所有题目
 */
export async function getAllQuizQuestions(): Promise<QuizQuestion[]> {
  const {data, error} = await supabase.from('quiz_questions').select('*').order('id', {ascending: true})

  if (error) {
    console.error('获取题目列表失败:', error)
    return []
  }

  return data || []
}

/**
 * 获取题目详情
 */
export async function getQuizQuestionById(id: number): Promise<QuizQuestion | null> {
  const {data, error} = await supabase.from('quiz_questions').select('*').eq('id', id).single()

  if (error) {
    console.error('获取题目详情失败:', error)
    return null
  }

  return data
}

/**
 * 创建新题目
 */
export async function createQuizQuestion(
  question: Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>
): Promise<QuizQuestion | null> {
  const {data, error} = await supabase.from('quiz_questions').insert(question).select().single()

  if (error) {
    console.error('创建题目失败:', error)
    return null
  }

  return data
}

/**
 * 更新题目
 */
export async function updateQuizQuestion(
  id: number,
  question: Partial<Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const {error} = await supabase.from('quiz_questions').update(question).eq('id', id)

  if (error) {
    console.error('更新题目失败:', error)
    return false
  }

  return true
}

/**
 * 删除题目
 */
export async function deleteQuizQuestion(id: number): Promise<boolean> {
  const {error} = await supabase.from('quiz_questions').delete().eq('id', id)

  if (error) {
    console.error('删除题目失败:', error)
    return false
  }

  return true
}

// ==================== 内容管理相关 ====================

/**
 * 更新内容
 */
export async function updateContent(
  id: string,
  content: Partial<Omit<Content, 'id' | 'created_at'>>
): Promise<boolean> {
  const {error} = await supabase.from('contents').update(content).eq('id', id)

  if (error) {
    console.error('更新内容失败:', error)
    return false
  }

  return true
}
