import { useEffect, useState } from "react";
import { api, Transaction } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await api.getTransactions();
        setTransactions(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las transacciones",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  const getTypeBadge = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'compra_ruta':
        return <Badge className="bg-primary">Compra de Ruta</Badge>;
      case 'compra_tienda':
        return <Badge className="bg-secondary text-secondary-foreground">Compra en Tienda</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
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

  const totalAmount = transactions.reduce((sum, t) => sum + Number(t.monto || 0), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Transacciones</h1>
        <p className="text-muted-foreground mt-2">Historial de transacciones de la plataforma</p>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Lista de Transacciones</CardTitle>
          <CardDescription>
            Total de transacciones: {transactions.length} | Monto total: ${totalAmount.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ruta/Producto</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">#{transaction.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.usuario.nombre}</div>
                      <div className="text-sm text-muted-foreground">{transaction.usuario.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(transaction.tipo)}</TableCell>
                  <TableCell>{transaction.ruta?.nombre || 'N/A'}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${transaction.monto.toFixed(2)}
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
