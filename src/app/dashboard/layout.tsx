"use client";

import Loader from "@/components/Loader";
import SupportChat from "@/components/SupportChat";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/SideBar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Toaster } from "@/components/ui/Toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  if (user === null) {
    return <Loader text={""} />;
  }

  if (!user) {
    return null;
  }
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6">{children}</main>
        {user && <SupportChat />}
        <Toaster />
      </div>
    </div>
  );
}
