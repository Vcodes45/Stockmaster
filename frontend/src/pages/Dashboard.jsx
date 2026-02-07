import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { dashboardService } from "../services/dashboard.service";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

const Dashboard = () => {
  const { isManager } = useAuth();

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  if (statsLoading) {
    return <Loading fullScreen />;
  }

  if (statsError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load dashboard"
        description="Unable to fetch dashboard statistics. Please try again later."
      />
    );
  }

  const statsData = stats?.data || {};
  const stockTrendData = statsData.stockMovements || [];
  const financialData = statsData.financialTrends || [];
  const recentOperations = statsData.recentOperations || [];

  const hasMovementData = stockTrendData.some(
    (entry) =>
      entry.receipts ||
      entry.deliveries ||
      entry.internalTransfers ||
      entry.adjustments
  );

  const hasFinancialData = financialData.some(
    (entry) => entry.revenue || entry.cost || entry.profit
  );

  const formatOperationType = (type) => {
    switch (type) {
      case "NEW_PRODUCT":
        return "New Product Added";
      case "RECEIPT":
        return "Stock Received";
      case "DELIVERY":
        return "Stock Delivered";
      case "INTERNAL_TRANSFER":
        return "Stock Moved";
      case "ADJUSTMENT":
        return "Stock Adjustment";
      default:
        return `${type} Operation`;
    }
  };

  return (
    <div className="p-2 md:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* ... keeping header ... */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Overview of your inventory performance.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={statsData.totalProducts || 0}
          trend={`${statsData.totalProducts || 0} items`}
          isPositive={true}
          icon={Package}
          color="indigo"
        />
        <StatCard
          title="Low Stock Items"
          value={statsData.lowStockItems ?? statsData.lowStockCount ?? 0}
          trend="Needs attention"
          isPositive={false}
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Pending Receipts"
          value={statsData.pendingReceipts || 0}
          trend="Incoming"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Pending Deliveries"
          value={statsData.pendingDeliveries || 0}
          trend="Outgoing"
          isPositive={true}
          icon={TrendingDown}
          color="orange"
        />
      </div>

      {/* Financial Chart (Managers Only) */}
      {isManager && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Financial Performance
            </h3>
            <span className="text-xs font-medium px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Manager View
            </span>
          </div>

          {hasFinancialData ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={financialData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#ef4444"
                  fillOpacity={0}
                  fill="#ef4444"
                  name="Cost"
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-3">
                <TrendingUp size={32} className="opacity-50" />
              </div>
              <p className="font-medium">No financial data available yet</p>
              <p className="text-sm mt-1">Process outgoing deliveries to generate revenue stats</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                Stock Activity Trends
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Last 30 days history + 7 days forecast
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                <span className="text-slate-500">Historical</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-slate-400 border-2 border-dashed border-slate-600"></div>
                <span className="text-slate-500">Forecast</span>
              </div>
            </div>
          </div>
          {hasMovementData ? (
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart
                data={stockTrendData}
                margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
              >
                <defs>
                  {/* Receipts Gradient - Emerald */}
                  <linearGradient id="colorReceipts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  {/* Deliveries Gradient - Rose */}
                  <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.05} />
                  </linearGradient>
                  {/* Transfers Gradient - Indigo */}
                  <linearGradient id="colorTransfers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                  {/* Adjustments Gradient - Amber */}
                  <linearGradient id="colorAdjustments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  strokeOpacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155', strokeOpacity: 0.5 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                  interval={4}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  allowDecimals={false}
                  domain={[0, "auto"]}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                  tickFormatter={(value) => value > 0 ? value : ''}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "16px",
                    border: "1px solid rgba(100, 116, 139, 0.3)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                    padding: "12px 16px",
                  }}
                  labelStyle={{
                    color: "#e2e8f0",
                    fontWeight: "600",
                    marginBottom: "8px",
                    fontSize: "13px"
                  }}
                  itemStyle={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    padding: "2px 0"
                  }}
                  labelFormatter={(value) => {
                    const entry = stockTrendData.find(d => d.date === value);
                    const dateStr = new Date(value).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    });
                    return entry?.isPrediction ? `📊 ${dateStr} (Forecast)` : `📅 ${dateStr}`;
                  }}
                  formatter={(value, name) => [
                    <span key={name} style={{ fontWeight: 500 }}>{value} units</span>,
                    name
                  ]}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <ReferenceLine
                  x={(() => {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                  })()}
                  stroke="#8b5cf6"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: '⬇ Today',
                    position: 'top',
                    fill: '#a78bfa',
                    fontSize: 11,
                    fontWeight: 600
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => (
                    <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '4px' }}>{value}</span>
                  )}
                />
                <Area
                  type="monotoneX"
                  dataKey="receipts"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReceipts)"
                  name="📥 Receipts"
                  dot={false}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
                <Area
                  type="monotoneX"
                  dataKey="deliveries"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorDeliveries)"
                  name="📤 Deliveries"
                  dot={false}
                  activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                />
                <Area
                  type="monotoneX"
                  dataKey="internalTransfers"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTransfers)"
                  name="🔄 Transfers"
                  dot={false}
                  activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                />
                <Area
                  type="monotoneX"
                  dataKey="adjustments"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAdjustments)"
                  name="⚙️ Adjustments"
                  dot={false}
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
              <div className="h-[340px] w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-3">
                  <TrendingUp size={32} className="opacity-50" />
                </div>
                <p className="font-medium">No stock activity data yet</p>
                <p className="text-sm mt-1 text-center px-4">Validate receipts, deliveries, or transfers to see historical trends and forecasts</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Recent Activity
          </h3>
          <div className="space-y-6">
            {recentOperations.length > 0 ? (
              recentOperations.map((operation, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0 ring-4 ring-indigo-100 dark:ring-indigo-900"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {formatOperationType(operation.type)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {operation.reference ? operation.reference : "No reference"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {new Date(operation.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-600 text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isPositive, icon: Icon, color }) => {
  const colors = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            isPositive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {trend}
        </span>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        {title}
      </h3>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
        {value}
      </p>
    </motion.div>
  );
};

export default Dashboard;
