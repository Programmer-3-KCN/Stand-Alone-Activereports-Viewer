import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

if (!API_URL) {
  throw new Error("The API URL is not defined. Please check your environment variables.");
}

export const GETIsCetakDokumen = async (query: Record<string, string | undefined>, token: string | undefined): Promise<{ cnt: number }[]> => {
  const response = await axios.get<{ data: { cnt: number }[] }>(`${API_URL}/erp/is_cetak_dokumen`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    params: query,
  });

  return response.data.data;
};
