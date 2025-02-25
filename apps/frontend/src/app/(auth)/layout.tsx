import React from "react";

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return <div className="flex items-center justify-center h-screen bg-[#f4f4f4]">{children}</div>;
};

export default AuthLayout;
