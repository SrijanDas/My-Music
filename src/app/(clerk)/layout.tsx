import React from "react";

function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
