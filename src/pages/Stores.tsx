import { useEffect, useState } from "react";
import { api, Store } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStores = async () => {
    try {
      const data = await api.getStores();
      setStores(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los comercios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleStatusUpdate = async (id: number, estado: string) => {
    try {
      await api.updateStoreStatus(id, estado);
      toast({
        title: "Comercio actualizado",
        description: `El comercio ha sido marcado como ${estado}`,
      });
      fetchStores();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el comercio",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return <Badge className="bg-success text-white">Activo</Badge>;
      case 'pendiente':
        return <Badge className="bg-warning text-white">Pendiente</Badge>;
      case 'inactivo':
        return <Badge variant="destructive">Inactivo</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
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
        <h1 className="text-3xl font-bold">Comercios</h1>
        <p className="text-muted-foreground mt-2">Gestión de comercios registrados</p>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Lista de Comercios</CardTitle>
          <CardDescription>Total de comercios: {stores.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.nombre}</TableCell>
                  <TableCell>{store.propietario.nombre}</TableCell>
                  <TableCell className="max-w-xs truncate">{store.ubicacion}</TableCell>
                  <TableCell>{getStatusBadge(store.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {store.estado !== 'activo' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(store.id, 'activo')}
                          className="text-success hover:bg-success/10"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      {store.estado !== 'inactivo' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(store.id, 'inactivo')}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
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
