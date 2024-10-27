import axios from 'axios'

export async function getRoomTypes() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/room-type`)
    if (response.data.data) {
      return response.data.data
    } else {
      throw new Error("Failed to fetch room types")
    }
  } catch (error) {
    console.error("Error fetching room types:", error)
    throw error
  }
}