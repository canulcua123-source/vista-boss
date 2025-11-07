const API_URL = import.meta.env.VITE_API_URL || 'https://kaelo-backend.onrender.com';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalRoutes: number;
  activeStores: number;
  totalSales: number;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: number;
  nombre: string;
  descripcion: string;
  distancia: number;
  dificultad: string;
  precio: number;
  estado: string;
  creador: {
    nombre: string;
  };
}

export interface Store {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estado: string;
  propietario: {
    nombre: string;
  };
}

export interface Transaction {
  id: number;
  monto: number;
  tipo: string;
  usuario: {
    nombre: string;
    email: string;
  };
  ruta: {
    nombre: string;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token || '',
  };
};

export const api = {
  // Auth
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Error al iniciar sesión');
    return response.json();
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/api/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return response.json();
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },

  createUser: async (userData: Partial<User> & { password: string }): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Error al crear usuario');
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Error al actualizar usuario');
  },

  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
  },

  // Routes
  getRoutes: async (): Promise<Route[]> => {
    const response = await fetch(`${API_URL}/api/admin/routes`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener rutas');
    return response.json();
  },

  updateRouteStatus: async (id: number, estado: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/routes/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado de ruta');
  },

  deleteRoute: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/routes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al eliminar ruta');
  },

  // Stores
  getStores: async (): Promise<Store[]> => {
    const response = await fetch(`${API_URL}/api/admin/stores`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener comercios');
    return response.json();
  },

  updateStoreStatus: async (id: number, estado: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/stores/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado }),
    });
    if (!response.ok) throw new Error('Error al actualizar estado de comercio');
  },

  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await fetch(`${API_URL}/api/admin/transactions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener transacciones');
    return response.json();
  },
};
