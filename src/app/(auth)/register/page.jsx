"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import MyLoader from "@/components/Loader/MyLoader";
import { Input, Button, Spinner } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "../login/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../login/EyeFilledIcon";
const Register = () => {
  const [err, setErr] = useState(false);
  const [errMsg, setErroMsg] = useState("");
  const session = useSession();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  // console.log(session);
  useEffect(() => {
    if (session.status === "authenticated")
      router.push("/complete-registration");
  }, [session.status, router]);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const token = e.target[4].value;
    // console.log(name, email, password, token);
    if (emailRegex.test(email)) {
      // Valid email address
      // You can perform further actions here, such as submitting the form.
      try {
        setIsLoading(() => true);
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "student",
            token,
          }),
        });
        //clear form inputs
        // e.target.reset();
        console.log(res);
        res.status === 201 &&
          // setIsLoading(() => false),
          (await signIn("credentials", {
            email,
            password,
            redirect: false,
            // callbackUrl: "/complete-registration",
          }));
        res.status === 400
          ? setErroMsg(() => "Token has already been used")
          : null;
        res.status === 500 ? setErroMsg(() => "Internal server error!") : null;
        setIsLoading(() => false);
        // e.target.reset();
      } catch (err) {
        setErr(true);
        setIsLoading(() => false);
        setErroMsg(err);
      }
    } else {
      // Invalid email address
      // alert("Please enter a valid email address.");
      setErroMsg(() => "Invalid Email");
      // Prevent the form from being submitted (if used in a form)
      return false;
    }
  };
  // console.log(errMsg);

  if (session.status === "loading")
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg" color="success" label="loading page..." />
      </div>
    );
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <h1 className=" text-4xl font-extrabold p-3">Register</h1>

      <span className="text-[#ff261b] pb-2 font-semibold">{errMsg}</span>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter your full name"
          className="max-w-xs"
          variant="bordered"
          label="Full Name"
          isRequired
          minLength={4}
          maxLength={250}
        />
        <Input
          type="email"
          placeholder="Enter your email"
          className="max-w-xs"
          variant="bordered"
          label="Email"
          isRequired
          minLength={5}
          maxLength={250}
          isInvalid={errMsg?.includes("Email") ? true : false}
        />
        <Input
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          minLength={8}
          maxLength={250}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
          isRequired
        />
        <Input
          type="text"
          placeholder="Enter registration token"
          className="max-w-xs"
          variant="bordered"
          label="Token"
          isRequired
          isInvalid={errMsg?.includes("Token") ? true : false}
        />

        <Button
          color="success"
          variant="flat"
          type="submit"
          isLoading={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>

      <Link href={"/login"} className=" mt-4 text-blue-500">
        Login with existing account.
      </Link>
    </div>
  );
};

export default Register;
