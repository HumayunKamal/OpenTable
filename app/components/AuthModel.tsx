"use client";
import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModelInputs from "./AuthModelInputs";
import useAuth from "@/hooks/useAuth";
import { AuthenticaiontContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModel({ isSignIn }: { isSignIn: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { signin, signup } = useAuth();
  const { loading, error, data } = useContext(AuthenticaiontContext);

  const renderContent = (signinContent: string, signupContent: string) => {
    return isSignIn ? signinContent : signupContent;
  };

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (isSignIn) {
      if (inputs.email && inputs.password) {
        return setDisabled(false);
      }
    } else if (
      inputs.firstName &&
      inputs.lastName &&
      inputs.email &&
      inputs.phone &&
      inputs.city &&
      inputs.password
    ) {
      return setDisabled(false);
    }
    setDisabled(true);
  }, [inputs]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleClick = () => {
    if (isSignIn) {
      signin({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      signup(inputs, handleClose);
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
      >
        {renderContent("Sign In", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="px-2 py-24 h-[500px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[500px]">
              {error ? (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              ) : null}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-small">
                  {renderContent("Sign in", "Create Account")}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    "Log Into Your Account",
                    "Create Your OpenTable Account"
                  )}
                </h2>
                <AuthModelInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignIn={isSignIn}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm pb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent("Sign In", "Create Account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
