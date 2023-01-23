import { NextPage } from "next";
import Navbar from "./Navbar";

type LayoutProps = {
  children?: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar />
      <div className="flex">{children}</div>
    </div>
  );
}

export default Layout;
