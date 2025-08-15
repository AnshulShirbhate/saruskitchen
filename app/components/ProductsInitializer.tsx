"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "@/redux/productSlice";
import { checkIsLoggedIn } from "@/redux/userSlice";
import type { AppDispatch } from "@/redux/store";
import LoadingComponent from "./LoadingComponent";

export default function ProductsInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          dispatch(fetchProducts()),
          dispatch(checkIsLoggedIn()),
        ]);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <LoadingComponent loaderName=""/>
      </div>
    );
  }

  return <>{children}</>;
}
