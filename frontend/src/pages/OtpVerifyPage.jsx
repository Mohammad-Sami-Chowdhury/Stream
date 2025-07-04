import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom"; // corrected from react-router

const OtpVerifyPage = () => {
  const [email] = useState(localStorage.getItem("email") || "");
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubmit = async () => {
    setIsPending(true);
    setMessage("");
    try {
      const response = await axiosInstance.post("/auth/verify-code", {
        email,
        code,
      });

      // axios auto-decodes JSON, so use response.data
      if (response.status === 200) {
        setMessage(response.data.message || "Verification successful!");
        setCode("")
      } else {
        setMessage(response.data.message || "Verification failed!");
      }
    } catch (error) {
      // error response handled better here
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Try again.");
      }
    }
    setIsPending(false);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Stream
            </span>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Verify Your OTP</h2>
                  <p className="text-sm opacity-70">
                    Verify your OTP to your account to continue your language
                    journey
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Verification Code</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your OTP code"
                      className="input input-bordered w-full"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>

                  {message && (
                    <p
                      className={`mt-3 text-center ${
                        message.toLowerCase().includes("success")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {message}
                    </p>
                  )}

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-primary hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
