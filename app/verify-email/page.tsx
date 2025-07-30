"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

export default function VerifyEmail() {
  const params = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("Verification token missing.");
      return;
    }

    const fetchResponse = async () => {
      try {
        const response = await fetch(`/api/verifyemail?token=${token}`);
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message, {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setTimeout(()=>{
              window.location.href='/';
          }, 2000)
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong!",
          {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );
      }
    };
    fetchResponse();
  }, [params]);

  return <p className="text-center mt-20 text-lg">{message}</p>;
}
