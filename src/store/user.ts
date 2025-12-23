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
