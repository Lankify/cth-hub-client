import { useEffect, useState } from "react";
import axios from "axios";
import type { IStaff } from "../types";

export const useStaff = () => {
  const [staff, setStaff] = useState<IStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<IStaff[]>(`${import.meta.env.VITE_API_BASE_URL}/staff/find-all`);
        setStaff(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching staff");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return { staff, loading, error };
};
