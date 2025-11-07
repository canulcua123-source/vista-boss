import { useEffect, useState } from "react";
import { api, Route } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Trash2 } from "lucide-react";

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoutes = async () => {
    try {
      const data = await api.getRoutes();
      setRoutes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las rutas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleStatusUpdate = async (id: number, estado: string) => {
    try {
      await api.updateRouteStatus(id, estado);
      toast({
        title: "Ruta actualizada",
        description: `La ruta ha sido ${estado}`,
      });
      fetchRoutes();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la ruta",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteRoute(id);
      toast({
        title: "Ruta eliminada",
        description: "La ruta ha sido eliminada exitosamente",
      });
      fetchRoutes();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la ruta",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aprobada':
        return <Badge className="bg-success text-white">Aprobada</Badge>;
      case 'pendiente':
        return <Badge className="bg-warning text-white">Pendiente</Badge>;
      case 'rechazada':
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getDifficultyBadge = (dificultad: string) => {
    switch (dificultad.toLowerCase()) {
      case 'fácil':
        return <Badge variant="outline" className="border-success text-success">Fácil</Badge>;
      case 'intermedia':
        return <Badge variant="outline" className="border-warning text-warning">Intermedia</Badge>;
      case 'difícil':
        return <Badge variant="outline" className="border-destructive text-destructive">Difícil</Badge>;
      default:
        return <Badge variant="outline">{dificultad}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <Card>
          <CardContent className="p-8">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rutas</h1>
        <p className="text-muted-foreground mt-2">Gestión de rutas ciclísticas</p>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Lista de Rutas</CardTitle>
          <CardDescription>Total de rutas: {routes.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Creador</TableHead>
                <TableHead>Distancia</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.nombre}</TableCell>
                  <TableCell>{route.creador.nombre}</TableCell>
                  <TableCell>{route.distancia} km</TableCell>
                  <TableCell>{getDifficultyBadge(route.dificultad)}</TableCell>
                  <TableCell>${Number(route.precio || 0).toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(route.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {route.estado === 'pendiente' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(route.id, 'aprobada')}
                            className="text-success hover:bg-success/10"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(route.id, 'rechazada')}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(route.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
