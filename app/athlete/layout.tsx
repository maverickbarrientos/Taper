

import React from "react";
import AthleteSidebar from "@/components/athlete-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AthleteLayout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      <AthleteSidebar />
      <main className="min-w-0 flex-1 p-4 md:p-6 typeset typeset-docs">
        <div className="mb-4 flex items-center gap-2 md:hidden">
          <SidebarTrigger aria-label="Open navigation" />
          <b>Taper</b>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )

}
