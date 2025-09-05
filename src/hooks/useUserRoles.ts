import { useEffect, useState } from "react";
import axios from "axios";
import type { IUserRole } from "../types";

export const useUserRoles = () => {
  const [roles, setRoles] = useState<IUserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<IUserRole[]>(`${import.meta.env.VITE_API_BASE_URL}/user-roles/find-all`);
        setRoles(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
};
