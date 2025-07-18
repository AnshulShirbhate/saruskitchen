"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchProducts } from "@/redux/productSlice";
import type { AppDispatch } from "@/redux/store"
import { checkIsAdmin } from "@/redux/adminSlice";
import { checkIsLoggedIn } from "@/redux/userSlice";

export default function ProductInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(checkIsLoggedIn());
    dispatch(checkIsAdmin());
  }, [dispatch])

  return null;
}