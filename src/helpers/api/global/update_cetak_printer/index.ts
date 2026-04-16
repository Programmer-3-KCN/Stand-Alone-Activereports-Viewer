import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

if (!API_URL) {
  throw new Error("The API URL is not defined. Please check your environment variables.");
}

export const PATCHUpdateCetakPrinter = async (query: Record<string, string | undefined>, token: string | undefined): Promise<{ message: string }> => {
  const response = await axios.patch<{ message: string }>(`${API_URL}/erp/update_cetak_printer`, null, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    params: query,
  });

  return response.data;
};
