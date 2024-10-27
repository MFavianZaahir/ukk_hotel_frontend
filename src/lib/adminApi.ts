import axios from 'axios'
import { User } from '../interfaces/admin'

const API_BASE_URL = process.env.NEXT_PUBLIC_baseURL

export async function getInitialUsers(): Promise<User[]> {
  const response = await axios.get(`${API_BASE_URL}/user`)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error('Failed to fetch users')
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const formData = new FormData()
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value as string | Blob)
    }
  })

  const response = await axios.post(
    `${API_BASE_URL}/user/register`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  )

  if (response.data.success) {
    return response.data.data
  }
  throw new Error('Failed to create user')
}

export async function updateUser(userData: User): Promise<User> {
  const formData = new FormData()
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value as string | Blob)
    }
  })

  const response = await axios.put(
    `${API_BASE_URL}/user/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  )

  if (response.data.success) {
    return response.data.data
  }
  throw new Error('Failed to update user')
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await axios.delete(`${API_BASE_URL}/user/${userId}`)
  if (!response.data.success) {
    throw new Error('Failed to delete user')
  }
}