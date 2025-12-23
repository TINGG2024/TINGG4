/*
# 创建计数器RPC函数

## 功能说明
为contents表的likes_count、favorites_count、comments_count字段创建原子性的增减函数

## RPC函数列表
1. increment_likes_count - 增加点赞数
2. decrement_likes_count - 减少点赞数
3. increment_favorites_count - 增加收藏数
4. decrement_favorites_count - 减少收藏数
5. increment_comments_count - 增加评论数

## 安全策略
所有函数使用SECURITY DEFINER权限，确保计数器操作的原子性
*/

-- 增加点赞数
CREATE OR REPLACE FUNCTION increment_likes_count(content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE contents
  SET likes_count = likes_count + 1
  WHERE id = content_id;
END;
$$;

-- 减少点赞数
CREATE OR REPLACE FUNCTION decrement_likes_count(content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE contents
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = content_id;
END;
$$;

-- 增加收藏数
CREATE OR REPLACE FUNCTION increment_favorites_count(content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE contents
  SET favorites_count = favorites_count + 1
  WHERE id = content_id;
END;
$$;

-- 减少收藏数
CREATE OR REPLACE FUNCTION decrement_favorites_count(content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE contents
  SET favorites_count = GREATEST(favorites_count - 1, 0)
  WHERE id = content_id;
END;
$$;

-- 增加评论数
CREATE OR REPLACE FUNCTION increment_comments_count(content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE contents
  SET comments_count = comments_count + 1
  WHERE id = content_id;
END;
$$;