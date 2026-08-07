export const APP_NAME = "AquaFlow ERP";
export const APP_DESCRIPTION = "Enterprise Water Distribution Management & Billing System";
export const APP_VERSION = "1.0.0";

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  company_owner: "Company Owner",
  branch_manager: "Branch Manager",
  warehouse_manager: "Warehouse Manager",
  sales_manager: "Sales Manager",
  sales_executive: "Sales Executive",
  delivery_driver: "Delivery Driver",
  accountant: "Accountant",
  billing_staff: "Billing Staff",
  store_keeper: "Store Keeper",
  read_only: "Read Only",
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],
  company_owner: ["*"],
  branch_manager: [
    "dashboard.view", "products.view", "products.create", "products.edit",
    "inventory.view", "inventory.create", "inventory.edit", "inventory.adjust",
    "warehouse.view", "warehouse.create", "warehouse.edit", "warehouse.transfer",
    "purchases.view", "purchases.create", "purchases.edit", "purchases.approve",
    "customers.view", "customers.create", "customers.edit",
    "routes.view", "routes.create", "routes.edit",
    "deliveries.view", "deliveries.create", "deliveries.edit", "deliveries.complete",
    "vehicles.view", "vehicles.create", "vehicles.edit",
    "drivers.view", "drivers.create", "drivers.edit",
    "sales.view", "sales.create", "sales.edit", "sales.approve",
    "billing.view", "billing.create", "billing.edit", "billing.cancel", "billing.print",
    "collections.view", "collections.create", "collections.edit",
    "expenses.view", "expenses.create", "expenses.edit", "expenses.approve",
    "accounting.view", "reports.view", "reports.export",
    "settings.view", "settings.edit", "users.view", "users.create", "users.edit",
    "notifications.view", "notifications.manage",
  ],
  warehouse_manager: [
    "dashboard.view", "products.view",
    "inventory.view", "inventory.create", "inventory.edit", "inventory.adjust",
    "warehouse.view", "warehouse.edit", "warehouse.transfer",
    "purchases.view", "purchases.create",
    "notifications.view",
  ],
  sales_manager: [
    "dashboard.view", "products.view", "customers.view", "customers.create", "customers.edit",
    "sales.view", "sales.create", "sales.edit", "sales.approve",
    "billing.view", "billing.create", "billing.edit", "billing.print",
    "collections.view", "collections.create",
    "reports.view", "reports.export", "notifications.view",
  ],
  sales_executive: [
    "dashboard.view", "products.view", "customers.view", "customers.create",
    "sales.view", "sales.create",
    "billing.view", "billing.create", "billing.print",
    "collections.view", "collections.create",
    "notifications.view",
  ],
  delivery_driver: [
    "dashboard.view", "deliveries.view", "deliveries.complete",
    "collections.view", "collections.create",
    "routes.view", "notifications.view",
  ],
  accountant: [
    "dashboard.view", "billing.view", "collections.view",
    "expenses.view", "expenses.create", "expenses.edit",
    "accounting.view", "accounting.edit",
    "reports.view", "reports.export",
    "notifications.view",
  ],
  billing_staff: [
    "dashboard.view", "products.view", "customers.view",
    "billing.view", "billing.create", "billing.edit", "billing.print",
    "collections.view", "collections.create",
    "notifications.view",
  ],
  store_keeper: [
    "dashboard.view", "products.view",
    "inventory.view", "inventory.create", "inventory.edit",
    "warehouse.view",
    "notifications.view",
  ],
  read_only: [
    "dashboard.view", "products.view", "customers.view", "inventory.view",
    "warehouse.view", "sales.view", "billing.view", "reports.view",
    "notifications.view",
  ],
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  card: "Card",
  credit: "Credit",
};

export const GST_RATES = [0, 5, 12, 18, 28];

export const PRODUCT_CATEGORIES: Record<string, string> = {
  mineral_water: "Mineral Water",
  packaged_drinking_water: "Packaged Drinking Water",
  sparkling_water: "Sparkling Water",
  flavored_water: "Flavored Water",
  soda: "Soda",
  juice: "Juice",
  energy_drink: "Energy Drink",
  other: "Other",
};

export const PRODUCT_UNITS: Record<string, string> = {
  bottle: "Bottle",
  can: "Can",
  jar: "Jar",
  carton: "Carton",
  case: "Case",
  pack: "Pack",
  litre: "Litre",
  ml: "ML",
};

export const EXPENSE_CATEGORIES: Record<string, string> = {
  fuel: "Fuel",
  salary: "Salary",
  rent: "Rent",
  electricity: "Electricity",
  maintenance: "Maintenance",
  office: "Office Expenses",
  transport: "Transport",
  packaging: "Packaging",
  marketing: "Marketing",
  miscellaneous: "Miscellaneous",
};

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman & Nicobar Islands", "Dadra & Nagar Haveli",
  "Daman & Diu", "Lakshadweep",
];
