// 内容类型定义

export type ContentCategory = 'food' | 'scenery' | 'culture' | 'economy'

export interface Content {
  id: string
  category: ContentCategory
  title: string
  subtitle: string | null
  description: string
  image_url: string | null
  likes_count: number
  favorites_count: number
  comments_count: number
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  content_id: string
  user_id: string
  created_at: string
}

export interface Favorite {
  id: string
  content_id: string
  user_id: string
  created_at: string
}

export interface Comment {
  id: string
  content_id: string
  user_id: string
  nickname: string
  comment_text: string
  created_at: string
}

// 分类信息
export interface CategoryInfo {
  key: ContentCategory
  name: string
  icon: string
  description: string
}
