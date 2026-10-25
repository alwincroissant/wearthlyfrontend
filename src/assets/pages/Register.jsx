import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import registerSchema from "../schema/registerSchema.js";
import { LOGIN_SUCCESS } from "../../constants/userConstants";

const API = import.meta.env.VITE_API;

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema), mode: "onTouched" });

  const onSubmit = async (data) => {
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const { data: response } = await axios.post(`${API}/register`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      dispatch({ type: LOGIN_SUCCESS, payload: { ...response.user, address: response.address } });
      toast.success("Account created successfully.");
      navigate("/");
    } catch (error) {
      setSubmitError(error?.response?.data?.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (name, label, type = "text") => (
    <div>
      <label className="block text-xs font-medium text-zinc-700 mb-1">{label}</label>
      <input type={type} {...register(name)} className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900"}`} />
      {errors[name] && <p className="text-[11px] text-red-600 mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logowearthly.png" alt="Wearthly" className="h-7 w-auto object-contain" />
            <span className="text-sm font-bold tracking-wider uppercase">Wearthly</span>
          </Link>
          <Link to="/login" className="text-xs text-emerald-700 hover:underline">Sign in</Link>
        </div>
        <div className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6">
          <h1 className="text-xl font-semibold tracking-tight">Create your Wearthly account</h1>
          <p className="text-xs text-zinc-500 mt-1">Create a simple account to manage your orders and delivery details.</p>
          {submitError && <p className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">{submitError}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("firstName", "First name")}
              {field("lastName", "Last name")}
            </div>
            {field("contactNumber", "Mobile number", "tel")}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("street", "Street address")}
              {field("barangay", "Barangay")}
              {field("city", "City / Municipality")}
              {field("postalCode", "Postal code")}
            </div>
            {field("email", "Email address", "email")}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("password", "Password", "password")}
              {field("confirmPassword", "Confirm password", "password")}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-60">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
