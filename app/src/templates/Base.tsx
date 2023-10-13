import { ReactNode } from "react";
import Menubar from "../components/Menubar";
import Sidebar from "../components/Sidebar";

interface Props {
  children?: ReactNode;
}

export default function Base({ children }: Props) {
  return (
    <div>
      <Menubar />
      <div className="relative flex overflow-x-hidden bg-fill-primary">
        <Sidebar />
        <main className="relative ml-72 flex min-h-screen grow flex-col">
          <div className="mt-16 mb-12 flex flex-grow">
            <div className="mx-auto mt-14 flex max-w-screen-xl flex-grow justify-center px-8 2xl:px-16">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
