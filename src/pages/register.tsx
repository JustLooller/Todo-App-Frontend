import React, { useState } from "react";
import axios from "axios";
import Router from "next/router";
import { validatePassword } from "@/utils/PasswordValidation";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);
  const [usernameMissingError, setUsernameMissingError] =
    useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  
  async function handleRegister() {
    setAlreadyRegistered(false);
    setUsernameMissingError(false);
    setPasswordError(false);
    setPasswordMatchError(false);

    if (username.length === 0) {
      setUsernameMissingError(true);
      return;
    }

    if (password != verifyPassword) {
      setPasswordMatchError(true);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/register",
        {
          username,
          password,
        }
      );
      Router.push("/login");
    } catch (error) {
      setAlreadyRegistered(true);
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen decoration-clone bg-gradient-to-bl from-gray-400 to-gray-700 h-full w-full">
      <div className="container h-full w-full mx-auto flex flex-col justify-center py-10  ">
        <div className="bg-gray-800 w-full mx-auto py-8 px-8 rounded-md shadow-lg">
          <h1 className="text-4xl text-white font-bold text-center">
            Register
          </h1>
          <div className="w-full flex justify-evenly text-gray-400 py-7 ">
            <input
              className="border border-gray-400 rounded-lg p-1 focus: outline-none "
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border border-gray-400 rounded-lg p-1 focus: outline-none "
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="border border-gray-400 rounded-lg p-1 focus: outline-none "
              type="password"
              placeholder="Verify Password"
              name="verifypassword"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
            <button
              className=" bg-gray-300 border border-gray-400 hover:bg-gray-500 rounded-lg"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
          <div className="flex justify-center text-red-500">
            {passwordMatchError ? <p>Passwords do not match, retry.</p> : null}
            {alreadyRegistered ? <p>Username already registered.</p> : null}
            {usernameMissingError ? (
              <p> Please insert a valid username</p>
            ) : null}
            {passwordError ? (
              <p>
                {" "}
                Your password does not meet the minimum requirements, which are:
                <li>8 letters long</li>
                <li>At least 1 Uppercase letter</li>
                <li>At least 1 Lowercase letter</li>
                <li>At least 1 Special Character</li>
                <li>At least 1 Number</li>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
