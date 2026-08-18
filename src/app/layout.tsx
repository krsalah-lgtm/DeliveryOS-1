import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, ShoppingBag, Users, Store, BookOpen, Settings, Truck } from "lucide-react";

// Cairo font natively supports Arabic beautifully.
const font = Cairo({ subsets: ["latin", "arabic"] });

export const metadata: Metadata = {
  title: "Delivery Order System",
  description: "Complete order management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set dir="rtl" for Arabic layout, or "ltr" for English.
  // We will default to ltr here, but the CSS supports both seamlessly.
  return (
    <html lang="en" dir="ltr">
      <body className={`${font.className} flex h-screen bg-slate-50`}>
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">DeliveryOS</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem icon={<LayoutDashboard size={20}/>} text="Dashboard / Import" active />
            <NavItem icon={<ShoppingBag size={20}/>} text="Order Management" />
            <NavItem icon={<Truck size={20}/>} text="Drivers & Ledger" />
            <NavItem icon={<Users size={20}/>} text="Customers" />
            <NavItem icon={<Store size={20}/>} text="Merchants" />
            <NavItem icon={<BookOpen size={20}/>} text="Notes & History" />
          </nav>
          <div className="p-4 border-t border-slate-200">
             <NavItem icon={<Settings size={20}/>} text="Settings" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:hidden">
            <h1 className="text-xl font-bold text-slate-800">DeliveryOS</h1>
          </header>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}

function NavItem({ icon, text, active = false }: { icon: React.ReactNode, text: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg transition-colors ${active ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
      {icon}
      <span className="font-medium">{text}</span>
    </a>
  );
}
