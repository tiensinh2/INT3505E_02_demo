"use client";

import Navbar from "@/components/home/Navbar";
import Banner from "@/components/home/Banner";
import Categories from "@/components/home/Categories";
import FlashSale from "@/components/home/FlashSale";
import ProductGrid from "@/components/home/ProductGrid";

export default function HomePageShop() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="pt-20">
                <Banner />
                <Categories />
                <FlashSale />
                <ProductGrid />
            </div>
        </div>
    );
}

//// HomePageShop



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Home, Users, Package, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const [role, setRole] = useState<"ADMIN" | "USER" | null>(null);

    useEffect(() => {
        const loadRole = () => {
            const r = localStorage.getItem("role") as "ADMIN" | "USER" | null;
            setRole(r);
        };

        loadRole();
    }, []);


    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${open ? "w-64" : "w-20"} bg-white shadow-md transition-all duration-300 p-4 flex flex-col border-r border-gray-200`}
            >
                <div className="flex items-center justify-between mb-8">
                    {open && <h1 className="text-xl font-bold text-blue-600 tracking-wide">SmartShopAI</h1>}
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* MENU */}
                <nav className="space-y-2">
                    <SidebarItem open={open} href="/dashboard" icon={<Home size={20} />} label="Trang chủ" />

                    {/* USER MENU */}
                    <SidebarItem open={open} href="/dashboard/profile" icon={<Users size={20} />} label="Trang cá nhân" />

                    {/* ADMIN ONLY MENU */}
                    {role === "ADMIN" && (
                        <>
                            <SidebarItem open={open} href="/dashboard/products" icon={<Package size={20} />} label="Sản phẩm" />
                            <SidebarItem open={open} href="/dashboard/users" icon={<Users size={20} />} label="Người dùng" />
                            <SidebarItem open={open} href="/dashboard/orders" icon={<Settings size={20} />} label="Đơn hàng" />
                        </>
                    )}
                </nav>
            </aside>

            <main className="flex-1 p-8">
                <Header />
                <div className="mt-8">{children}</div>
            </main>
        </div>
    );
}

type SidebarItemProps = {
    open: boolean;
    href: string;
    icon: React.ReactNode;
    label: string;
};

function SidebarItem({ open, href, icon, label }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition"
        >
            <span className="text-blue-600">{icon}</span>
            {open && <span>{label}</span>}
        </Link>
    );
}

function Header() {
    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <div className="w-10 h-10 rounded-full bg-gray-300 border" />
        </div>
    );
}





export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Chào mừng trở lại 👋
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card title="Tổng sản phẩm" value="128" />
                <Card title="Đơn hàng mới" value="32" />
                <Card title="Người dùng mới" value="12" />
            </div>
        </div>
    );
}

function Card({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-4xl font-bold text-blue-600 mt-2">{value}</h3>
        </div>
    );
}