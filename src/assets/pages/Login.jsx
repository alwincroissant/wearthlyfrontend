import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { clearErrors, login } from "../../actions/userActions";

const loginSchema = yup.object({
  identifier: yup.string().trim().required("Email or contact number is required"),
  password: yup.string().required("Password is required"),
});

export const Login = () => {
  const { isAuthenticated, user, error, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const lastAlertMessage = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const redirect = new URLSearchParams(location.search).get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const defaultTarget = user?.role === "admin" ? "/admin/dashboard" : "/";
    navigate(redirect ? (redirect.startsWith("/") ? redirect : `/${redirect}`) : defaultTarget);
  }, [isAuthenticated, navigate, redirect, user]);

  useEffect(() => {
    if (!error || lastAlertMessage.current === error) return;
    lastAlertMessage.current = error;
    Swal.fire({
      icon: error.toLowerCase().includes("deactivated") ? "warning" : "error",
      title: error.toLowerCase().includes("deactivated") ? "Account deactivated" : "Unable to sign in",
      text: error,
      confirmButtonText: "Close",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-xl border border-zinc-200 shadow-xl",
        title: "text-base font-bold text-zinc-900",
        htmlContainer: "text-sm text-zinc-600",
        confirmButton: "rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800",
      },
    }).then(() => dispatch(clearErrors()));
  }, [dispatch, error]);

  const onSubmit = (data) => {
    if (error) dispatch(clearErrors());
    dispatch(login(data.identifier, data.password));
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col justify-center items-center px-4 py-8 antialiased">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logowearthly.png" alt="Wearthly" className="h-7 w-auto object-contain" />
            <span className="text-sm font-bold tracking-wider text-zinc-900 uppercase">Wearthly</span>
          </Link>
          <span className="text-xs text-zinc-500">Account Portal</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Sign in to your account</h1>
          <p className="text-xs text-zinc-500 mt-1">Use your Wearthly email or mobile number.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Email or mobile number</label>
              <input
                type="text"
                {...register("identifier")}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${errors.identifier ? "border-red-500 focus:ring-red-500" : "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900"}`}
              />
              {errors.identifier && <p className="text-[11px] text-red-600 mt-1">{errors.identifier.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-700">Password</label>
                <span className="text-[11px] text-zinc-400">Keep it secure</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full px-3 py-2 pr-16 text-sm border rounded-md focus:outline-none focus:ring-1 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900"}`}
                />
                <button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-zinc-500 hover:text-zinc-900">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-600">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="w-3.5 h-3.5 accent-emerald-600" />
              Remember me on this device
            </label>

            <button type="submit" disabled={loading || isSubmitting} className="h-10 w-full rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-60">
              {loading || isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Don&apos;t have an account? <Link to="/register" className="font-medium text-emerald-700 hover:underline">Register</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-[11px] text-zinc-400 mt-4">Wearthly Account Management</p>
      </div>
    </div>
  );
};
