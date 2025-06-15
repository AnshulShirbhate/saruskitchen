"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchProducts } from "@/redux/productSlice";
import type { AppDispatch } from "@/redux/store"

export default function ProductInitializer() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return null // invisible component that only triggers fetch
}