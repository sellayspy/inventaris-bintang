import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import SidebarSection from '@/components/sidebar-section';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { BookOpen, Building2, Database, FileText, Folder, LayoutGrid, List, MapPin, Package, Settings } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const platformNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const masterDataNavItems = [
        {
            title: 'Master Data',
            icon: Database,
            children: [
                { title: 'Kategori', href: '/kategori', icon: List },
                { title: 'Jenis Barang', href: '/jenis-barang', icon: Package },
                { title: 'Asal Barang', href: '/asal-barang', icon: Building2 },
                { title: 'Lokasi', href: '/lokasi', icon: MapPin },
            ],
        },
    ];

    const transaksiNavItems = [
        {
            title: 'Transaksi',
            href: '/transaksi',
            icon: LayoutGrid,
        },
    ];

    const stokNavItems = [
        {
            title: 'Stok',
            href: '/stok',
            icon: Package,
        },
    ];

    const laporanNavItems = [
        {
            title: 'Laporan',
            icon: FileText,
            children: [
                { title: 'Barang Masuk', href: '#', icon: FileText },
                { title: 'Barang Keluar', href: '#', icon: FileText },
            ],
        },
    ];

    const settingsNavItems = [
        {
            title: 'Pengaturan',
            icon: Settings,
            children: [
                { title: 'Profil', href: '/settings/profile', icon: Settings },
                { title: 'Password', href: '/settings/password', icon: Settings },
            ],
        },
    ];

    const footerNavItems = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Group 1: Platform */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarSection items={platformNavItems} />
                </SidebarGroup>

                {/* Group 2: Master Data */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                    <SidebarSection items={masterDataNavItems} storageKey="sidebar-masterdata" />
                </SidebarGroup>

                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Transaksi</SidebarGroupLabel>
                    <SidebarSection items={transaksiNavItems} />
                </SidebarGroup>

                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Stok</SidebarGroupLabel>
                    <SidebarSection items={stokNavItems} />
                </SidebarGroup>

                {/* Group 3: Laporan */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Laporan</SidebarGroupLabel>
                    <SidebarSection items={laporanNavItems} storageKey="sidebar-laporan" />
                </SidebarGroup>

                {/* Group 4: Pengaturan */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
                    <SidebarSection items={settingsNavItems} storageKey="sidebar-settings" />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
