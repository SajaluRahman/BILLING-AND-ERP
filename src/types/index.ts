// ============================================================
// Core Type Definitions for Water Distribution ERP
// ============================================================

// ---- User & RBAC ----
export type UserRole =
  | "super_admin"
  | "company_owner"
  | "branch_manager"
  | "warehouse_manager"
  | "sales_manager"
  | "sales_executive"
  | "delivery_driver"
  | "accountant"
  | "billing_staff"
  | "store_keeper"
  | "read_only";

export type Permission =
  | "dashboard.view"
  | "companies.view"
  | "companies.create"
  | "companies.edit"
  | "companies.delete"
  | "brands.view"
  | "brands.create"
  | "brands.edit"
  | "brands.delete"
  | "products.view"
  | "products.create"
  | "products.edit"
  | "products.delete"
  | "inventory.view"
  | "inventory.create"
  | "inventory.edit"
  | "inventory.adjust"
  | "warehouse.view"
  | "warehouse.create"
  | "warehouse.edit"
  | "warehouse.transfer"
  | "purchases.view"
  | "purchases.create"
  | "purchases.edit"
  | "purchases.approve"
  | "customers.view"
  | "customers.create"
  | "customers.edit"
  | "customers.delete"
  | "routes.view"
  | "routes.create"
  | "routes.edit"
  | "deliveries.view"
  | "deliveries.create"
  | "deliveries.edit"
  | "deliveries.complete"
  | "vehicles.view"
  | "vehicles.create"
  | "vehicles.edit"
  | "drivers.view"
  | "drivers.create"
  | "drivers.edit"
  | "sales.view"
  | "sales.create"
  | "sales.edit"
  | "sales.approve"
  | "billing.view"
  | "billing.create"
  | "billing.edit"
  | "billing.cancel"
  | "billing.print"
  | "collections.view"
  | "collections.create"
  | "collections.edit"
  | "expenses.view"
  | "expenses.create"
  | "expenses.edit"
  | "expenses.approve"
  | "accounting.view"
  | "accounting.edit"
  | "reports.view"
  | "reports.export"
  | "settings.view"
  | "settings.edit"
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "notifications.view"
  | "notifications.manage";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  companyId: string;
  branchId?: string;
  warehouseId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Company & Brand ----
export interface Company {
  id: string;
  name: string;
  code: string;
  logo?: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  gst: string;
  pan: string;
  cin?: string;
  bankDetails: BankDetails;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  code: string;
  companyId: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Product ----
export type ProductCategory =
  | "mineral_water"
  | "packaged_drinking_water"
  | "sparkling_water"
  | "flavored_water"
  | "soda"
  | "juice"
  | "energy_drink"
  | "other";

export type ProductUnit = "bottle" | "can" | "jar" | "carton" | "case" | "pack" | "litre" | "ml";

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  companyId: string;
  category: ProductCategory;
  sku: string;
  barcode: string;
  qrCode?: string;
  unit: ProductUnit;
  bottleSize: string;
  description?: string;
  purchasePrice: number;
  sellingPrice: number;
  distributorPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  gstRate: number;
  hsnCode: string;
  openingStock: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Customer ----
export type CustomerType = "retail" | "wholesale" | "distributor" | "hotel" | "restaurant" | "office" | "institution" | "other";

export interface Customer {
  id: string;
  businessName: string;
  ownerName: string;
  type: CustomerType;
  address: Address;
  contacts: ContactInfo[];
  email?: string;
  gst?: string;
  pan?: string;
  creditLimit: number;
  outstandingBalance: number;
  creditDays: number;
  routeId?: string;
  rating: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
}

// ---- Supplier ----
export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  address: Address;
  phone: string;
  email?: string;
  gst?: string;
  pan?: string;
  bankDetails?: BankDetails;
  outstandingBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Warehouse ----
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  companyId: string;
  address: Address;
  managerId?: string;
  managerName?: string;
  capacity: number;
  currentOccupancy: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseStock {
  id: string;
  warehouseId: string;
  productId: string;
  productName: string;
  brandName: string;
  quantity: number;
  damagedQuantity: number;
  returnedQuantity: number;
  lastUpdated: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  items: StockTransferItem[];
  status: "pending" | "in_transit" | "completed" | "cancelled";
  notes?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface StockTransferItem {
  productId: string;
  productName: string;
  quantity: number;
  receivedQuantity?: number;
}

// ---- Inventory ----
export type StockMovementType =
  | "purchase"
  | "sale"
  | "transfer_in"
  | "transfer_out"
  | "return"
  | "damage"
  | "adjustment"
  | "opening"
  | "expiry";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  currentStock: number;
  referenceId?: string;
  referenceType?: string;
  batchNumber?: string;
  lotNumber?: string;
  expiryDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// ---- Purchase ----
export type PurchaseStatus = "draft" | "pending" | "approved" | "received" | "partial" | "cancelled";

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: PurchaseStatus;
  paymentStatus: PaymentStatus;
  expectedDate?: string;
  receivedDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  receivedQuantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

// ---- Sales ----
export type SalesOrderStatus = "draft" | "pending" | "approved" | "processing" | "dispatched" | "delivered" | "cancelled" | "returned";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "overdue" | "refunded";
export type PaymentMethod = "cash" | "upi" | "bank_transfer" | "cheque" | "card" | "credit";

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: SalesItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  roundOff: number;
  total: number;
  status: SalesOrderStatus;
  paymentStatus: PaymentStatus;
  routeId?: string;
  deliveryDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesItem {
  productId: string;
  productName: string;
  brandName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

// ---- Invoice / Billing ----
export type InvoiceType = "gst" | "non_gst" | "proforma" | "credit_note" | "debit_note";
export type InvoiceStatus = "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled" | "refunded";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  customerId: string;
  customerName: string;
  customerGST?: string;
  salesOrderId?: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  discount: number;
  roundOff: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  payments: Payment[];
  dueDate: string;
  notes?: string;
  terms?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber?: string;
  date: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// ---- Route ----
export interface Route {
  id: string;
  name: string;
  code: string;
  description?: string;
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  customers: string[];
  distance?: number;
  estimatedTime?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Delivery ----
export type DeliveryStatus = "scheduled" | "loading" | "in_transit" | "delivered" | "partial" | "failed" | "cancelled";

export interface Delivery {
  id: string;
  deliveryNumber: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleNumber: string;
  date: string;
  items: DeliveryItem[];
  totalItems: number;
  deliveredItems: number;
  status: DeliveryStatus;
  startTime?: string;
  endTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryItem {
  customerId: string;
  customerName: string;
  orderId: string;
  products: DeliveryProduct[];
  status: DeliveryStatus;
  deliveredAt?: string;
  signature?: string;
  photo?: string;
  notes?: string;
}

export interface DeliveryProduct {
  productId: string;
  productName: string;
  orderedQuantity: number;
  deliveredQuantity: number;
}

// ---- Vehicle ----
export interface Vehicle {
  id: string;
  number: string;
  type: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  fuelType: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  driverId?: string;
  driverName?: string;
  status: "available" | "on_route" | "maintenance" | "inactive";
  currentLoad: number;
  lastService?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Driver ----
export interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: Address;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleId?: string;
  vehicleNumber?: string;
  routeId?: string;
  routeName?: string;
  salary: number;
  totalCollections: number;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Expense ----
export type ExpenseCategory =
  | "fuel"
  | "salary"
  | "rent"
  | "electricity"
  | "maintenance"
  | "office"
  | "transport"
  | "packaging"
  | "marketing"
  | "miscellaneous";

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  receipt?: string;
  notes?: string;
  approvedBy?: string;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Collection ----
export interface Collection {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber?: string;
  collectedBy: string;
  date: string;
  notes?: string;
  createdAt: string;
}

// ---- Notification ----
export type NotificationType =
  | "low_stock"
  | "payment_due"
  | "order_ready"
  | "delivery_started"
  | "delivery_completed"
  | "purchase_reminder"
  | "collection_reminder"
  | "system_alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ---- Shared Types ----
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: "savings" | "current";
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  todaySales: number;
  monthlySales: number;
  totalRevenue: number;
  outstandingPayments: number;
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  vehiclesOnRoute: number;
  dailyCollection: number;
  cashFlow: number;
  purchaseCost: number;
  profit: number;
}

// ---- Navigation ----
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  children?: NavItem[];
  permissions?: Permission[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
