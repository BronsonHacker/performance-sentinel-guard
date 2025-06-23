// Welcome to Guardião de Performance v2!
// This is a major architectural update to make the app more robust, scalable, and complete.
// Key features implemented:
// - Global State Management: Using React Context for server and date range selection.
// - Real-world Data Fetching: Integrated React Query (`useQuery`) to simulate async data fetching and caching.
// - Enhanced UI/UX: Added a global date range picker, interactive tables, and more detailed pages.
// - Authentication Flow: Basic structure for a login/protected routes flow.
// - Low-Impact Principle: The architecture is now designed to support efficient data collection.

import React, { useState, useContext, createContext, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

// --- UI Components ---
import { Home, BarChart2, Bell, Database, Settings, ChevronLeft, ChevronRight, Cpu, Timer, Disc, User, LogOut, Lightbulb, Server, HardDrive, MemoryStick } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';


// --- MOCK API & DATA ---
// Simulates a real API with delays and structured data.
const MOCK_DATA = {
  servers: [
    { id: 'srv-prod-01', name: 'Servidor de Produção', status: 'Online', cpu: 75, memory: 85, disk: 92 },
    { id: 'srv-staging-01', name: 'Servidor de Staging', status: 'Online', cpu: 45, memory: 60, disk: 50 },
    { id: 'srv-analytics-01', name: 'Servidor de Analytics', status: 'Warning', cpu: 92, memory: 88, disk: 75 },
  ],
  queries: {
    'srv-prod-01': {
        cpu: [
            { id: 1, query: "SELECT * FROM Orders WHERE CustomerID = @p1", avg_cpu_time: 1500, executions: 1200, db: 'MainDB' },
            { id: 2, query: "UPDATE Products SET Stock = Stock - 1 WHERE ProductID = @p2", avg_cpu_time: 1250, executions: 800, db: 'MainDB' },
            { id: 3, query: "SELECT p.*, c.CategoryName FROM Products p JOIN ...", avg_cpu_time: 980, executions: 500, db: 'MainDB' },
        ],
        duration: [
            { id: 4, query: "EXEC sp_GenerateSalesReport '2024-01-01', '2024-06-30'", avg_duration: 8000, executions: 50, db: 'ReportsDB' },
            { id: 1, query: "SELECT * FROM Orders WHERE CustomerID = @p1", avg_duration: 3500, executions: 1200, db: 'MainDB' },
            { id: 5, query: "DELETE FROM Logs WHERE LogDate < DATEADD(day, -30, GETDATE())", avg_duration: 2800, executions: 10, db: 'LoggingDB' },
        ],
        io: [
            { id: 7, query: "SELECT * FROM VeryLargeTable WITH (NOLOCK)", avg_logical_reads: 50000, executions: 250, db: 'ArchiveDB' },
            { id: 1, query: "SELECT * FROM Orders WHERE CustomerID = @p1", avg_logical_reads: 42000, executions: 1200, db: 'MainDB' },
            { id: 3, query: "SELECT p.*, c.CategoryName FROM Products p JOIN ...", avg_logical_reads: 38000, executions: 500, db: 'MainDB' },
        ]
    },
    'srv-staging-01': { cpu: [], duration: [], io: [] },
    'srv-analytics-01': { cpu: [], duration: [], io: [] },
  },
  queryDetails: {
    1: {
      fullQueryText: "SELECT O.OrderID, C.CustomerName, O.OrderDate, OD.ProductID, P.ProductName, OD.Quantity, OD.UnitPrice FROM Orders O JOIN Customers C ON O.CustomerID = C.CustomerID JOIN [Order Details] OD ON O.OrderID = OD.OrderID JOIN Products P ON OD.ProductID = P.ProductID WHERE O.CustomerID = @p1 ORDER BY O.OrderDate DESC",
      database: 'MainDB',
      stats: { executions: 1200, avg_cpu: 1500, avg_duration: 3500, avg_io: 42000 },
      executionPlan: `
|--Nested Loops(Inner Join, Cost: 0.00)
  |--Clustered Index Seek(OBJECT:([dbo].[Customers].[PK_Customers]), SEEK:([dbo].[Customers].[CustomerID] = @p1), Cost: 0.00)
  |--Nested Loops(Inner Join, Cost: 0.00)
    |--Clustered Index Scan(OBJECT:([dbo].[Orders].[PK_Orders]), WHERE:([dbo].[Orders].[CustomerID] = @p1), Cost: 0.01)
    |--Clustered Index Seek(OBJECT:([dbo].[Order Details].[PK_Order_Details]), SEEK:([OrderID]), Cost: 0.00)
      `,
      recommendations: [
        "Considere criar um índice não clusterizado na coluna 'OrderDate' da tabela 'Orders' para melhorar a performance da ordenação."
      ]
    },
     2: {
      fullQueryText: "UPDATE Products SET Stock = Stock - 1 WHERE ProductID = @p2",
      database: 'MainDB',
      stats: { executions: 800, avg_cpu: 1250, avg_duration: 1800, avg_io: 500 },
      executionPlan: `|--UPDATE(OBJECT:([dbo].[Products]), SET:[Stock] = [Stock]-1)
  |--Clustered Index Seek(OBJECT:([dbo].[Products].[PK_Products]), SEEK:([ProductID] = @p2), Cost: 0.00)`,
      recommendations: ["Nenhuma recomendação imediata. A query parece otimizada."]
    },
    // Add details for other queries to make them clickable
    3: { fullQueryText: "...", stats: {}, executionPlan: "...", recommendations: ["..."] },
    4: { fullQueryText: "...", stats: {}, executionPlan: "...", recommendations: ["..."] },
    5: { fullQueryText: "...", stats: {}, executionPlan: "...", recommendations: ["..."] },
    7: { fullQueryText: "...", stats: {}, executionPlan: "...", recommendations: ["..."] },
  },
  performanceHistory: [
    { name: '7d', cpu: 1200, duration: 3000 }, { name: '6d', cpu: 1300, duration: 3200 },
    { name: '5d', cpu: 1100, duration: 2900 }, { name: '4d', cpu: 1400, duration: 3800 },
    { name: '3d', cpu: 1550, duration: 4100 }, { name: '2d', cpu: 1450, duration: 3900 },
    { name: 'Hoje', cpu: 1500, duration: 3500 },
  ],
  alerts: [
    { id: 1, severity: 'Error', message: 'Query #4 (EXEC sp_GenerateSalesReport) excedeu o limite de duração (8000ms).', timestamp: '2025-06-23 20:15:00' },
    { id: 2, severity: 'Warning', message: 'Uso de CPU no servidor srv-analytics-01 atingiu 92%.', timestamp: '2025-06-23 19:30:00' },
    { id: 3, severity: 'Error', message: "Backup do banco de dados 'MainDB' falhou.", timestamp: '2025-06-22 23:00:00' },
    { id: 4, severity: 'Info', message: 'Manutenção de índices concluída no srv-prod-01.', timestamp: '2025-06-22 04:00:00' },
  ]
};

const mockApi = {
    fetchServers: async () => {
        await new Promise(res => setTimeout(res, 300));
        return MOCK_DATA.servers;
    },
    fetchServerData: async (serverId, dateRange) => {
        console.log(`Fetching data for ${serverId} from ${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}`);
        await new Promise(res => setTimeout(res, 500));
        return {
            health: MOCK_DATA.servers.find(s => s.id === serverId),
            queries: MOCK_DATA.queries[serverId] || { cpu: [], duration: [], io: [] },
        };
    },
    fetchQueryDetails: async (queryId) => {
        await new Promise(res => setTimeout(res, 400));
        return MOCK_DATA.queryDetails[queryId];
    },
    fetchAlerts: async () => {
        await new Promise(res => setTimeout(res, 600));
        return MOCK_DATA.alerts;
    },
    login: async (email, password) => {
        await new Promise(res => setTimeout(res, 500));
        if (email === 'dba@empresa.com' && password === 'password') {
            return { success: true, user: { name: 'Admin DBA', email: 'dba@empresa.com' } };
        }
        return { success: false, message: 'Credenciais inválidas.' };
    }
};

// --- GLOBAL CONTEXTS ---

// Auth Context
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const result = await mockApi.login(email, password);
        if (result.success) {
            setUser(result.user);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result;
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    React.useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
        setLoading(false);
    }, []);

    const value = { user, login, logout, isAuthenticated: !!user, loading };
    
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// App (Filters) Context
const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }) => {
    const [selectedServerId, setSelectedServerId] = useState(MOCK_DATA.servers[0].id);
    const [date, setDate] = useState({
        from: addDays(new Date(), -7),
        to: new Date(),
    });

    const value = useMemo(() => ({ selectedServerId, setSelectedServerId, date, setDate }), [selectedServerId, date]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


// --- CORE APP STRUCTURE ---
const queryClient = new QueryClient();

function App() {
    return (
        <div className="dark h-screen w-full font-sans antialiased">
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/*" element={
                                <ProtectedRoute>
                                    <AppProvider>
                                        <MainLayout />
                                    </AppProvider>
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </AuthProvider>
                </Router>
            </QueryClientProvider>
        </div>
    );
}

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

const MainLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div className="flex min-h-screen w-full">
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(p => !p)} />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto bg-muted/40">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/analysis" element={<QueryAnalysisPage />} />
                        <Route path="/alerts" element={<AlertsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};


// --- COMPONENTS (ENHANCED) ---

const Sidebar = ({ isCollapsed, onToggle }) => (
    <div className={cn("relative hidden h-screen border-r bg-background transition-all duration-300 md:block", isCollapsed ? "w-16" : "w-64")}>
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                    <Database className="h-6 w-6 text-primary" />
                    {!isCollapsed && <span className="">Guardião</span>}
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <NavLink to="/" icon={Home} collapsed={isCollapsed}>Dashboard</NavLink>
                    <NavLink to="/analysis" icon={BarChart2} collapsed={isCollapsed}>Análise de Query</NavLink>
                    <NavLink to="/alerts" icon={Bell} collapsed={isCollapsed}>Alertas</NavLink>
                    <NavLink to="/settings" icon={Settings} collapsed={isCollapsed}>Configurações</NavLink>
                </nav>
            </div>
            <button
                onClick={onToggle}
                className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border bg-background p-1 text-muted-foreground hover:text-primary"
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
        </div>
    </div>
);

const NavLink = ({ to, icon: Icon, children, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary",
              collapsed && "justify-center"
            )}
          >
            <Icon className="h-4 w-4" />
            {!collapsed && children}
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{children}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { selectedServerId, setSelectedServerId, date, setDate } = useAppContext();
    const { data: servers, isLoading } = useQuery({ queryKey: ['servers'], queryFn: mockApi.fetchServers });

    return (
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1 flex items-center gap-4">
                {isLoading ? <Skeleton className="h-9 w-[280px]" /> : (
                     <Select value={selectedServerId} onValueChange={setSelectedServerId}>
                        <SelectTrigger className="w-[180px] md:w-[280px]">
                            <SelectValue placeholder="Selecione um servidor" />
                        </SelectTrigger>
                        <SelectContent>
                            {servers?.map(server => (
                                <SelectItem key={server.id} value={server.id}>{server.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <DateRangePicker date={date} setDate={setDate} />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Menu do usuário</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate('/settings')}>Configurações</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};

const DateRangePicker = ({ date, setDate, className }) => {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: ptBR })
              )
            ) : (
              <span>Escolha um intervalo</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const TopQueriesCard = ({ title, data, valueKey, unit, icon: Icon, isLoading }) => {
    const navigate = useNavigate();
    
    const CardSkeleton = () => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
    );

    if (isLoading) return <CardSkeleton />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {data?.length > 0 ? data.map((item) => (
                            <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate('/analysis', { state: { queryId: item.id } })}>
                                <TableCell className="font-mono text-xs truncate max-w-[150px] md:max-w-[200px]">
                                    <TooltipProvider><Tooltip><TooltipTrigger>{item.query}</TooltipTrigger><TooltipContent><p>{item.query}</p></TooltipContent></Tooltip></TooltipProvider>
                                </TableCell>
                                <TableCell className="text-right">{item[valueKey].toLocaleString()}{unit}</TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">Nenhum dado encontrado.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

// --- PAGES ---

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState('dba@empresa.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Acesse o dashboard do Guardião de Performance
                        </p>
                    </div>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Entrando...' : 'Login'}
                        </Button>
                    </form>
                </div>
            </div>
            <div className="hidden bg-muted lg:block p-10">
                <div className="flex flex-col justify-center items-center h-full text-center">
                    <Database className="h-24 w-24 text-primary mb-4"/>
                    <h2 className="text-4xl font-bold">Guardião de Performance</h2>
                    <p className="text-xl text-muted-foreground mt-2">Sua sentinela para um SQL Server mais rápido e confiável.</p>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { selectedServerId, date } = useAppContext();
    const { data, isLoading } = useQuery({ 
        queryKey: ['serverData', selectedServerId, date], 
        queryFn: () => mockApi.fetchServerData(selectedServerId, date),
        keepPreviousData: true,
    });
    
    return (
        <div className="flex flex-col gap-4 p-4 md:p-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {isLoading ? <Skeleton className="h-[220px] w-full"/> : <ServerStatusCard server={data.health} /> }
                 {isLoading ? <Skeleton className="h-[220px] w-full"/> : <Card><CardHeader><CardTitle>Status dos Backups</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Em desenvolvimento.</p></CardContent></Card>}
                 {isLoading ? <Skeleton className="h-[220px] w-full"/> : <Card><CardHeader><CardTitle>Saúde dos Índices</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Em desenvolvimento.</p></CardContent></Card>}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <TopQueriesCard title="Top Queries por CPU" data={data?.queries?.cpu} isLoading={isLoading} valueKey="avg_cpu_time" unit="ms" icon={Cpu} />
                <TopQueriesCard title="Top Queries por Duração" data={data?.queries?.duration} isLoading={isLoading} valueKey="avg_duration" unit="ms" icon={Timer} />
                <TopQueriesCard title="Top Queries por I/O" data={data?.queries?.io} isLoading={isLoading} valueKey="avg_logical_reads" unit=" leituras" icon={Disc}/>
            </div>
        </div>
    );
};

const ServerStatusCard = ({server}) => {
    if(!server) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{server.name}</span>
                    <Badge variant={server.status === 'Online' ? 'default' : 'destructive'} className={cn(server.status === 'Warning' && 'bg-yellow-500')}>{server.status}</Badge>
                </CardTitle>
                <CardDescription>Status atual dos recursos do servidor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                 <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-muted-foreground" />
                    <div className="w-full">
                        <div className="flex justify-between text-sm mb-1"><span>CPU</span><span>{server.cpu}%</span></div>
                        <Progress value={server.cpu} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <MemoryStick className="h-5 w-5 text-muted-foreground" />
                    <div className="w-full">
                         <div className="flex justify-between text-sm mb-1"><span>Memória</span><span>{server.memory}%</span></div>
                        <Progress value={server.memory} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                    <div className="w-full">
                         <div className="flex justify-between text-sm mb-1"><span>Disco</span><span>{server.disk}%</span></div>
                        <Progress value={server.disk} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const QueryAnalysisPage = () => {
    const location = useLocation();
    const queryId = location.state?.queryId;
    
    const { data: details, isLoading } = useQuery({
        queryKey: ['queryDetails', queryId],
        queryFn: () => mockApi.fetchQueryDetails(queryId),
        enabled: !!queryId,
    });

    if (!queryId) {
        return <div className="p-8 text-center"><p>Selecione uma query no Dashboard para começar a análise.</p></div>
    }
    if (isLoading) {
        return <div className="p-8"><Skeleton className="h-[80vh] w-full" /></div>
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2">Análise Detalhada da Query #{queryId}</h1>
            <p className="text-muted-foreground mb-6">Investigue a performance, plano de execução e recomendações.</p>
            <ResizablePanelGroup direction="vertical" className="min-h-[80vh] rounded-lg border bg-background">
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={60}>
                            <div className="flex h-full flex-col p-4">
                                <h3 className="font-semibold mb-2">Texto Completo da Query</h3>
                                <div className="flex-grow p-4 rounded-md bg-muted font-mono text-sm overflow-auto">
                                    <pre><code>{details.fullQueryText}</code></pre>
                                </div>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={40}>
                            <div className="p-4 space-y-4">
                               <Card>
                                   <CardHeader><CardTitle>Estatísticas de Performance</CardTitle></CardHeader>
                                   <CardContent>
                                       <ul className="space-y-2 text-sm">
                                            <li className="flex justify-between"><span>Execuções:</span> <span className="font-medium">{details.stats.executions.toLocaleString()}</span></li>
                                            <li className="flex justify-between"><span>CPU Média:</span> <span className="font-medium">{details.stats.avg_cpu.toLocaleString()} ms</span></li>
                                            <li className="flex justify-between"><span>Duração Média:</span> <span className="font-medium">{details.stats.avg_duration.toLocaleString()} ms</span></li>
                                            <li className="flex justify-between"><span>I/O Médio (Leituras):</span> <span className="font-medium">{details.stats.avg_io.toLocaleString()}</span></li>
                                            <li className="flex justify-between"><span>Banco de Dados:</span> <Badge variant="outline">{details.database}</Badge></li>
                                       </ul>
                                   </CardContent>
                               </Card>
                               <Card>
                                   <CardHeader><CardTitle className="flex items-center"><Lightbulb className="w-4 h-4 mr-2 text-yellow-400"/>Recomendações</CardTitle></CardHeader>
                                   <CardContent>
                                        <p className="text-sm text-muted-foreground">{details.recommendations[0]}</p>
                                   </CardContent>
                               </Card>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    <div className="flex h-full flex-col p-4">
                         <h3 className="font-semibold mb-2">Plano de Execução (Simulado)</h3>
                         <div className="flex-grow p-4 rounded-md bg-muted font-mono text-sm overflow-auto">
                             <pre><code>{details.executionPlan}</code></pre>
                         </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};


const AlertsPage = () => {
    const { data: alerts, isLoading } = useQuery({ queryKey: ['alerts'], queryFn: mockApi.fetchAlerts });
    
    const getSeverityVariant = (severity) => {
        if (severity === 'Error') return 'destructive';
        if (severity === 'Warning') return 'default';
        return 'secondary';
    }
     const getSeverityClass = (severity) => {
        if (severity === 'Warning') return 'bg-yellow-500 hover:bg-yellow-600';
        return '';
    }

    const AlertSkeleton = () => (
         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );

    return (
        <div className="flex flex-col gap-4 p-4 md:p-8">
            <h1 className="text-3xl font-bold">Gerenciador de Alertas</h1>
            <p className="text-muted-foreground">Monitore e configure os alertas de performance do sistema.</p>
            
            <div className="grid gap-6 md:grid-cols-2">
                {isLoading ? <AlertSkeleton /> : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Alertas</CardTitle>
                            <CardDescription>Eventos recentes detectados pelo sistema.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Severidade</TableHead>
                                        <TableHead>Mensagem</TableHead>
                                        <TableHead>Data</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alerts.map(alert => (
                                        <TableRow key={alert.id}>
                                            <TableCell><Badge variant={getSeverityVariant(alert.severity)} className={getSeverityClass(alert.severity)}>{alert.severity}</Badge></TableCell>
                                            <TableCell>{alert.message}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{alert.timestamp}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
                 <Card>
                    <CardHeader>
                        <CardTitle>Configuração de Alertas</CardTitle>
                        <CardDescription>Habilite e defina os limites para as notificações.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="cpu-alert" className="flex flex-col space-y-1">
                                <span>Uso de CPU Elevado</span>
                                <span className="font-normal leading-snug text-muted-foreground">Notificar quando o uso de CPU exceder 90% por 5 minutos.</span>
                            </Label>
                            <Switch id="cpu-alert" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="duration-alert" className="flex flex-col space-y-1">
                                <span>Query de Longa Duração</span>
                                <span className="font-normal leading-snug text-muted-foreground">Notificar quando uma query exceder 5000ms de duração.</span>
                            </Label>
                            <Switch id="duration-alert" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="backup-alert" className="flex flex-col space-y-1">
                                <span>Falha de Backup</span>
                                <span className="font-normal leading-snug text-muted-foreground">Notificar imediatamente se um job de backup falhar.</span>
                            </Label>
                            <Switch id="backup-alert" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
const SettingsPage = () => (
    <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configurações em Desenvolvimento</CardTitle>
            <CardDescription>As páginas para gerenciar instâncias, perfil e aparência serão implementadas aqui.</CardDescription>
          </CardHeader>
        </Card>
    </div>
);


export default App;
