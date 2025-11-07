import { 
  LayoutDashboard, 
  Users, 
  Route as RouteIcon, 
  Store, 
  CreditCard, 
  LogOut,
  Bike
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Usuarios", url: "/dashboard/users", icon: Users },
  { title: "Rutas", url: "/dashboard/routes", icon: RouteIcon },
  { title: "Comercios", url: "/dashboard/stores", icon: Store },
  { title: "Transacciones", url: "/dashboard/transactions", icon: CreditCard },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary rounded-lg p-2">
            <Bike className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">Ruta Bici-Maya</h2>
            <p className="text-xs text-sidebar-foreground/70">Panel Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Gestión
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
