import { useEffect, useState } from "react";
import { Users, Route as RouteIcon, Store, DollarSign } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { api, DashboardStats } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las estadísticas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Resumen general de la plataforma Ruta Bici-Maya
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Usuarios"
          value={stats?.totalUsers || 0}
          icon={Users}
          colorClass="text-primary"
        />
        <StatCard
          title="Total Rutas"
          value={stats?.totalRoutes || 0}
          icon={RouteIcon}
          colorClass="text-info"
        />
        <StatCard
          title="Comercios Activos"
          value={stats?.activeStores || 0}
          icon={Store}
          colorClass="text-success"
        />
        <StatCard
          title="Ventas Totales"
          value={`$${stats?.totalSales?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          colorClass="text-warning"
        />
      </div>
    </div>
  );
}
