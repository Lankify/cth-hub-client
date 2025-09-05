import { useEffect, useState } from "react";
import axios from "axios";
import type { IItemCategory } from "../types";

export const useInventoryCategories = () => {
  const [inventoryCategories, setInventoryCategories] = useState<IItemCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<IItemCategory[]>(
          `${import.meta.env.VITE_API_BASE_URL}/inventory/find-all-categories`,
        );
        setInventoryCategories(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching inventory categories");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryCategories();
  }, []);

  return { inventoryCategories, loading, error };
};
