import axios from "axios";
const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export async function health() {
  try {
    const response = await axios.get(`${API_HOST}/health`);
    return { status: 'OK', message: response.data };
  } catch (error: unknown) {
    if (error instanceof Error) {
        return { status: 'ERROR', message: error.message };
    } else {
        console.error('An unknown error occurred');
    }
  }
}