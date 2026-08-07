import {
  DashboardStats,
  Product,
  Customer,
  Invoice,
  Delivery,
  Vehicle,
  Driver,
  Route,
  Warehouse,
  Brand,
  Company,
  Notification,
  SalesOrder,
  PurchaseOrder,
  Expense,
  Collection,
  StockMovement,
  User,
} from "@/types";

// ---- Companies ----
export const mockCompanies: Company[] = [
  {
    id: "comp-1",
    name: "AquaFlow Distributors Pvt. Ltd.",
    code: "AQFD",
    address: { line1: "42, Industrial Area", city: "Kochi", state: "Kerala", pincode: "682024", country: "India" },
    phone: "+91 484 2345678",
    email: "info@aquaflow.in",
    website: "https://aquaflow.in",
    gst: "32AABCU9603R1ZM",
    pan: "AABCU9603R",
    bankDetails: { bankName: "HDFC Bank", accountNumber: "50200012345678", ifscCode: "HDFC0001234", branchName: "Kochi Main", accountType: "current" },
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-06-15",
  },
  {
    id: "comp-2",
    name: "ClearDrop Beverages",
    code: "CLDR",
    address: { line1: "18, MG Road", city: "Thrissur", state: "Kerala", pincode: "680001", country: "India" },
    phone: "+91 487 2345678",
    email: "info@cleardrop.in",
    gst: "32BBCDU8503R1ZN",
    pan: "BBCDU8503R",
    bankDetails: { bankName: "SBI", accountNumber: "30200012345679", ifscCode: "SBIN0001234", branchName: "Thrissur", accountType: "current" },
    isActive: true,
    createdAt: "2024-03-01",
    updatedAt: "2024-07-01",
  },
];

// ---- Brands ----
export const mockBrands: Brand[] = [
  { id: "brand-1", name: "Bisleri", code: "BIS", companyId: "comp-1", description: "India's No.1 Packaged Drinking Water", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: "brand-2", name: "Kinley", code: "KIN", companyId: "comp-1", description: "Trust of Coca-Cola", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: "brand-3", name: "Aquafina", code: "AQF", companyId: "comp-1", description: "PepsiCo Pure Water", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: "brand-4", name: "Himalayan", code: "HIM", companyId: "comp-1", description: "Natural Mineral Water", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: "brand-5", name: "AquaFlow Pure", code: "AFP", companyId: "comp-1", description: "Our own premium brand", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: "brand-6", name: "ClearDrop Spring", code: "CDS", companyId: "comp-2", description: "Premium spring water", isActive: true, createdAt: "2024-03-01", updatedAt: "2024-03-01" },
];

// ---- Products ----
export const mockProducts: Product[] = [
  { id: "prod-1", name: "Bisleri 500ml", brandId: "brand-1", brandName: "Bisleri", companyId: "comp-1", category: "packaged_drinking_water", sku: "BIS-500ML", barcode: "8901063010012", unit: "bottle", bottleSize: "500ml", purchasePrice: 8, sellingPrice: 12, distributorPrice: 10, wholesalePrice: 10, retailPrice: 12, gstRate: 18, hsnCode: "2201", openingStock: 5000, currentStock: 3420, minimumStock: 500, maximumStock: 10000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-2", name: "Bisleri 1L", brandId: "brand-1", brandName: "Bisleri", companyId: "comp-1", category: "packaged_drinking_water", sku: "BIS-1L", barcode: "8901063010029", unit: "bottle", bottleSize: "1L", purchasePrice: 14, sellingPrice: 20, distributorPrice: 17, wholesalePrice: 17, retailPrice: 20, gstRate: 18, hsnCode: "2201", openingStock: 3000, currentStock: 2150, minimumStock: 300, maximumStock: 8000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-3", name: "Bisleri 2L", brandId: "brand-1", brandName: "Bisleri", companyId: "comp-1", category: "packaged_drinking_water", sku: "BIS-2L", barcode: "8901063010036", unit: "bottle", bottleSize: "2L", purchasePrice: 22, sellingPrice: 30, distributorPrice: 26, wholesalePrice: 26, retailPrice: 30, gstRate: 18, hsnCode: "2201", openingStock: 2000, currentStock: 1280, minimumStock: 200, maximumStock: 5000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-4", name: "Bisleri 5L", brandId: "brand-1", brandName: "Bisleri", companyId: "comp-1", category: "packaged_drinking_water", sku: "BIS-5L", barcode: "8901063010043", unit: "jar", bottleSize: "5L", purchasePrice: 38, sellingPrice: 50, distributorPrice: 44, wholesalePrice: 44, retailPrice: 50, gstRate: 18, hsnCode: "2201", openingStock: 1000, currentStock: 650, minimumStock: 100, maximumStock: 3000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-5", name: "Bisleri 20L", brandId: "brand-1", brandName: "Bisleri", companyId: "comp-1", category: "packaged_drinking_water", sku: "BIS-20L", barcode: "8901063010050", unit: "jar", bottleSize: "20L", purchasePrice: 60, sellingPrice: 80, distributorPrice: 70, wholesalePrice: 70, retailPrice: 80, gstRate: 18, hsnCode: "2201", openingStock: 500, currentStock: 180, minimumStock: 50, maximumStock: 1500, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-6", name: "Kinley 500ml", brandId: "brand-2", brandName: "Kinley", companyId: "comp-1", category: "packaged_drinking_water", sku: "KIN-500ML", barcode: "8901063020012", unit: "bottle", bottleSize: "500ml", purchasePrice: 7, sellingPrice: 10, distributorPrice: 9, wholesalePrice: 9, retailPrice: 10, gstRate: 18, hsnCode: "2201", openingStock: 4000, currentStock: 2890, minimumStock: 400, maximumStock: 8000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-7", name: "Kinley 1L", brandId: "brand-2", brandName: "Kinley", companyId: "comp-1", category: "packaged_drinking_water", sku: "KIN-1L", barcode: "8901063020029", unit: "bottle", bottleSize: "1L", purchasePrice: 12, sellingPrice: 18, distributorPrice: 15, wholesalePrice: 15, retailPrice: 18, gstRate: 18, hsnCode: "2201", openingStock: 2500, currentStock: 1750, minimumStock: 250, maximumStock: 6000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-8", name: "Kinley 2L", brandId: "brand-2", brandName: "Kinley", companyId: "comp-1", category: "packaged_drinking_water", sku: "KIN-2L", barcode: "8901063020036", unit: "bottle", bottleSize: "2L", purchasePrice: 20, sellingPrice: 28, distributorPrice: 24, wholesalePrice: 24, retailPrice: 28, gstRate: 18, hsnCode: "2201", openingStock: 1500, currentStock: 920, minimumStock: 150, maximumStock: 4000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-9", name: "Aquafina 500ml", brandId: "brand-3", brandName: "Aquafina", companyId: "comp-1", category: "packaged_drinking_water", sku: "AQF-500ML", barcode: "8901063030012", unit: "bottle", bottleSize: "500ml", purchasePrice: 8, sellingPrice: 12, distributorPrice: 10, wholesalePrice: 10, retailPrice: 12, gstRate: 18, hsnCode: "2201", openingStock: 3500, currentStock: 2340, minimumStock: 350, maximumStock: 7000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-10", name: "Aquafina 1L", brandId: "brand-3", brandName: "Aquafina", companyId: "comp-1", category: "packaged_drinking_water", sku: "AQF-1L", barcode: "8901063030029", unit: "bottle", bottleSize: "1L", purchasePrice: 14, sellingPrice: 20, distributorPrice: 17, wholesalePrice: 17, retailPrice: 20, gstRate: 18, hsnCode: "2201", openingStock: 2000, currentStock: 1560, minimumStock: 200, maximumStock: 5000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-11", name: "Himalayan 500ml", brandId: "brand-4", brandName: "Himalayan", companyId: "comp-1", category: "mineral_water", sku: "HIM-500ML", barcode: "8901063040012", unit: "bottle", bottleSize: "500ml", purchasePrice: 18, sellingPrice: 25, distributorPrice: 22, wholesalePrice: 22, retailPrice: 25, gstRate: 18, hsnCode: "2201", openingStock: 2000, currentStock: 1280, minimumStock: 200, maximumStock: 5000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-12", name: "Himalayan 1L", brandId: "brand-4", brandName: "Himalayan", companyId: "comp-1", category: "mineral_water", sku: "HIM-1L", barcode: "8901063040029", unit: "bottle", bottleSize: "1L", purchasePrice: 30, sellingPrice: 45, distributorPrice: 38, wholesalePrice: 38, retailPrice: 45, gstRate: 18, hsnCode: "2201", openingStock: 1500, currentStock: 890, minimumStock: 150, maximumStock: 4000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-13", name: "AquaFlow Pure 500ml", brandId: "brand-5", brandName: "AquaFlow Pure", companyId: "comp-1", category: "packaged_drinking_water", sku: "AFP-500ML", barcode: "8901063050012", unit: "bottle", bottleSize: "500ml", purchasePrice: 5, sellingPrice: 8, distributorPrice: 7, wholesalePrice: 7, retailPrice: 8, gstRate: 18, hsnCode: "2201", openingStock: 8000, currentStock: 5420, minimumStock: 800, maximumStock: 15000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-14", name: "AquaFlow Pure 1L", brandId: "brand-5", brandName: "AquaFlow Pure", companyId: "comp-1", category: "packaged_drinking_water", sku: "AFP-1L", barcode: "8901063050029", unit: "bottle", bottleSize: "1L", purchasePrice: 9, sellingPrice: 14, distributorPrice: 12, wholesalePrice: 12, retailPrice: 14, gstRate: 18, hsnCode: "2201", openingStock: 5000, currentStock: 3200, minimumStock: 500, maximumStock: 10000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-15", name: "AquaFlow Pure 20L Jar", brandId: "brand-5", brandName: "AquaFlow Pure", companyId: "comp-1", category: "packaged_drinking_water", sku: "AFP-20L", barcode: "8901063050050", unit: "jar", bottleSize: "20L", purchasePrice: 40, sellingPrice: 60, distributorPrice: 50, wholesalePrice: 50, retailPrice: 60, gstRate: 18, hsnCode: "2201", openingStock: 800, currentStock: 320, minimumStock: 80, maximumStock: 2000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "prod-16", name: "Bisleri Soda 300ml", brandId: "brand-1", brandName: "Bisleri", companyId: "comp-1", category: "soda", sku: "BIS-SODA-300ML", barcode: "8901063060012", unit: "bottle", bottleSize: "300ml", purchasePrice: 10, sellingPrice: 15, distributorPrice: 13, wholesalePrice: 13, retailPrice: 15, gstRate: 28, hsnCode: "2202", openingStock: 3000, currentStock: 1850, minimumStock: 300, maximumStock: 6000, images: [], isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
];

// ---- Customers ----
export const mockCustomers: Customer[] = [
  { id: "cust-1", businessName: "Hotel Grand Palace", ownerName: "Rajesh Kumar", type: "hotel", address: { line1: "MG Road", city: "Kochi", state: "Kerala", pincode: "682011", country: "India" }, contacts: [{ id: "c1", name: "Rajesh Kumar", phone: "+91 9876543210", isPrimary: true }], email: "hotel@grandpalace.in", gst: "32AADCH1234R1ZX", creditLimit: 100000, outstandingBalance: 45200, creditDays: 15, routeId: "route-1", rating: 4.5, isActive: true, createdAt: "2024-01-15", updatedAt: "2024-08-06" },
  { id: "cust-2", businessName: "City Supermarket", ownerName: "Anita Sharma", type: "retail", address: { line1: "Broadway", city: "Kochi", state: "Kerala", pincode: "682011", country: "India" }, contacts: [{ id: "c2", name: "Anita Sharma", phone: "+91 9876543211", isPrimary: true }], email: "city@supermarket.in", creditLimit: 50000, outstandingBalance: 12500, creditDays: 7, routeId: "route-1", rating: 4.8, isActive: true, createdAt: "2024-01-20", updatedAt: "2024-08-06" },
  { id: "cust-3", businessName: "TechPark Cafeteria", ownerName: "Vivek Menon", type: "office", address: { line1: "InfoPark", city: "Kochi", state: "Kerala", pincode: "682042", country: "India" }, contacts: [{ id: "c3", name: "Vivek Menon", phone: "+91 9876543212", isPrimary: true }], email: "vivek@techpark.in", creditLimit: 75000, outstandingBalance: 28900, creditDays: 30, routeId: "route-2", rating: 4.2, isActive: true, createdAt: "2024-02-01", updatedAt: "2024-08-06" },
  { id: "cust-4", businessName: "Sea Shell Restaurant", ownerName: "Priya Nair", type: "restaurant", address: { line1: "Marine Drive", city: "Kochi", state: "Kerala", pincode: "682011", country: "India" }, contacts: [{ id: "c4", name: "Priya Nair", phone: "+91 9876543213", isPrimary: true }], email: "priya@seashell.in", creditLimit: 60000, outstandingBalance: 8700, creditDays: 15, routeId: "route-1", rating: 4.6, isActive: true, createdAt: "2024-02-10", updatedAt: "2024-08-06" },
  { id: "cust-5", businessName: "Lulu Hypermarket", ownerName: "Mohammed Ali", type: "retail", address: { line1: "Edappally", city: "Kochi", state: "Kerala", pincode: "682024", country: "India" }, contacts: [{ id: "c5", name: "Mohammed Ali", phone: "+91 9876543214", isPrimary: true }], email: "ali@lulu.in", gst: "32AADCL5678R1ZY", creditLimit: 200000, outstandingBalance: 156000, creditDays: 30, routeId: "route-2", rating: 4.9, isActive: true, createdAt: "2024-02-15", updatedAt: "2024-08-06" },
  { id: "cust-6", businessName: "Marina Bay Hotel", ownerName: "Suresh Pillai", type: "hotel", address: { line1: "Fort Kochi", city: "Kochi", state: "Kerala", pincode: "682001", country: "India" }, contacts: [{ id: "c6", name: "Suresh Pillai", phone: "+91 9876543215", isPrimary: true }], creditLimit: 80000, outstandingBalance: 32400, creditDays: 15, routeId: "route-3", rating: 4.3, isActive: true, createdAt: "2024-03-01", updatedAt: "2024-08-06" },
  { id: "cust-7", businessName: "Green Valley School", ownerName: "Lakshmi Devi", type: "institution", address: { line1: "Kakkanad", city: "Kochi", state: "Kerala", pincode: "682030", country: "India" }, contacts: [{ id: "c7", name: "Lakshmi Devi", phone: "+91 9876543216", isPrimary: true }], creditLimit: 40000, outstandingBalance: 5600, creditDays: 30, routeId: "route-2", rating: 4.7, isActive: true, createdAt: "2024-03-10", updatedAt: "2024-08-06" },
  { id: "cust-8", businessName: "Fresh Mart", ownerName: "George Thomas", type: "wholesale", address: { line1: "Aluva", city: "Kochi", state: "Kerala", pincode: "683101", country: "India" }, contacts: [{ id: "c8", name: "George Thomas", phone: "+91 9876543217", isPrimary: true }], gst: "32AADCF9012R1ZZ", creditLimit: 150000, outstandingBalance: 89500, creditDays: 15, routeId: "route-3", rating: 4.1, isActive: true, createdAt: "2024-03-20", updatedAt: "2024-08-06" },
  { id: "cust-9", businessName: "Comfort Inn", ownerName: "Deepa Raj", type: "hotel", address: { line1: "Palarivattom", city: "Kochi", state: "Kerala", pincode: "682025", country: "India" }, contacts: [{ id: "c9", name: "Deepa Raj", phone: "+91 9876543218", isPrimary: true }], creditLimit: 45000, outstandingBalance: 15800, creditDays: 7, routeId: "route-1", rating: 3.9, isActive: true, createdAt: "2024-04-01", updatedAt: "2024-08-06" },
  { id: "cust-10", businessName: "Royal Bakery & Cafe", ownerName: "James Wilson", type: "restaurant", address: { line1: "Panampilly Nagar", city: "Kochi", state: "Kerala", pincode: "682036", country: "India" }, contacts: [{ id: "c10", name: "James Wilson", phone: "+91 9876543219", isPrimary: true }], creditLimit: 35000, outstandingBalance: 4200, creditDays: 7, routeId: "route-3", rating: 4.4, isActive: true, createdAt: "2024-04-15", updatedAt: "2024-08-06" },
  { id: "cust-11", businessName: "Metro Wholesale", ownerName: "Arun Menon", type: "wholesale", address: { line1: "Kalamassery", city: "Kochi", state: "Kerala", pincode: "682033", country: "India" }, contacts: [{ id: "c11", name: "Arun Menon", phone: "+91 9876543220", isPrimary: true }], gst: "32AADCM3456R1ZA", creditLimit: 300000, outstandingBalance: 215000, creditDays: 30, routeId: "route-2", rating: 4.6, isActive: true, createdAt: "2024-05-01", updatedAt: "2024-08-06" },
  { id: "cust-12", businessName: "Sunrise Hotel", ownerName: "Ravi Shankar", type: "hotel", address: { line1: "Vytilla", city: "Kochi", state: "Kerala", pincode: "682019", country: "India" }, contacts: [{ id: "c12", name: "Ravi Shankar", phone: "+91 9876543221", isPrimary: true }], creditLimit: 55000, outstandingBalance: 22100, creditDays: 15, routeId: "route-1", rating: 4.0, isActive: false, createdAt: "2024-05-15", updatedAt: "2024-08-06" },
];

// ---- Warehouses ----
export const mockWarehouses: Warehouse[] = [
  { id: "wh-1", name: "Main Warehouse", code: "MW-01", companyId: "comp-1", address: { line1: "42, Industrial Area", city: "Kochi", state: "Kerala", pincode: "682024", country: "India" }, managerId: "user-3", managerName: "Anil Kumar", capacity: 50000, currentOccupancy: 32450, isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "wh-2", name: "North Hub", code: "NH-01", companyId: "comp-1", address: { line1: "15, CSEZ", city: "Kochi", state: "Kerala", pincode: "682037", country: "India" }, managerId: "user-4", managerName: "Binu Joseph", capacity: 30000, currentOccupancy: 18200, isActive: true, createdAt: "2024-02-01", updatedAt: "2024-08-06" },
  { id: "wh-3", name: "South Distribution Center", code: "SDC-01", companyId: "comp-1", address: { line1: "8, Tripunithura", city: "Kochi", state: "Kerala", pincode: "682301", country: "India" }, capacity: 20000, currentOccupancy: 11800, isActive: true, createdAt: "2024-04-01", updatedAt: "2024-08-06" },
];

// ---- Routes ----
export const mockRoutes: Route[] = [
  { id: "route-1", name: "City Center Route", code: "CCR", description: "Covers MG Road, Marine Drive, Broadway area", driverId: "drv-1", driverName: "Sunil M.", vehicleId: "veh-1", vehicleNumber: "KL-07-AX-1234", customers: ["cust-1", "cust-2", "cust-4", "cust-9", "cust-12"], distance: 25, estimatedTime: "4 hours", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "route-2", name: "Tech Park Route", code: "TPR", description: "InfoPark, SmartCity, Kakkanad area", driverId: "drv-2", driverName: "Rajan K.", vehicleId: "veh-2", vehicleNumber: "KL-07-BX-5678", customers: ["cust-3", "cust-5", "cust-7", "cust-11"], distance: 32, estimatedTime: "5 hours", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "route-3", name: "Fort & Suburbs", code: "FSR", description: "Fort Kochi, Mattancherry, Aluva", driverId: "drv-3", driverName: "Vijay S.", vehicleId: "veh-3", vehicleNumber: "KL-07-CX-9012", customers: ["cust-6", "cust-8", "cust-10"], distance: 45, estimatedTime: "6 hours", isActive: true, createdAt: "2024-02-01", updatedAt: "2024-08-06" },
];

// ---- Vehicles ----
export const mockVehicles: Vehicle[] = [
  { id: "veh-1", number: "KL-07-AX-1234", type: "Mini Truck", make: "Tata", model: "Ace Gold", year: 2023, capacity: 1000, fuelType: "Diesel", insuranceExpiry: "2025-06-30", registrationExpiry: "2028-12-31", driverId: "drv-1", driverName: "Sunil M.", status: "on_route", currentLoad: 650, isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "veh-2", number: "KL-07-BX-5678", type: "Pickup", make: "Mahindra", model: "Bolero Pickup", year: 2022, capacity: 1500, fuelType: "Diesel", insuranceExpiry: "2025-03-15", registrationExpiry: "2027-09-30", driverId: "drv-2", driverName: "Rajan K.", status: "on_route", currentLoad: 1200, isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "veh-3", number: "KL-07-CX-9012", type: "Mini Truck", make: "Tata", model: "Intra V30", year: 2024, capacity: 2000, fuelType: "Diesel", insuranceExpiry: "2026-01-31", registrationExpiry: "2029-06-30", driverId: "drv-3", driverName: "Vijay S.", status: "available", currentLoad: 0, isActive: true, createdAt: "2024-03-01", updatedAt: "2024-08-06" },
  { id: "veh-4", number: "KL-07-DX-3456", type: "Three Wheeler", make: "Piaggio", model: "Ape Xtra DLX", year: 2023, capacity: 500, fuelType: "CNG", insuranceExpiry: "2025-09-30", registrationExpiry: "2028-03-31", status: "available", currentLoad: 0, isActive: true, createdAt: "2024-05-01", updatedAt: "2024-08-06" },
];

// ---- Drivers ----
export const mockDrivers: Driver[] = [
  { id: "drv-1", name: "Sunil M.", phone: "+91 9876543230", address: { line1: "Aluva", city: "Kochi", state: "Kerala", pincode: "683101", country: "India" }, licenseNumber: "KL0720210012345", licenseExpiry: "2029-12-31", vehicleId: "veh-1", vehicleNumber: "KL-07-AX-1234", routeId: "route-1", routeName: "City Center Route", salary: 18000, totalCollections: 245000, rating: 4.7, isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "drv-2", name: "Rajan K.", phone: "+91 9876543231", address: { line1: "Kakkanad", city: "Kochi", state: "Kerala", pincode: "682030", country: "India" }, licenseNumber: "KL0720210012346", licenseExpiry: "2028-06-30", vehicleId: "veh-2", vehicleNumber: "KL-07-BX-5678", routeId: "route-2", routeName: "Tech Park Route", salary: 18000, totalCollections: 312000, rating: 4.5, isActive: true, createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "drv-3", name: "Vijay S.", phone: "+91 9876543232", address: { line1: "Fort Kochi", city: "Kochi", state: "Kerala", pincode: "682001", country: "India" }, licenseNumber: "KL0720210012347", licenseExpiry: "2030-03-31", vehicleId: "veh-3", vehicleNumber: "KL-07-CX-9012", routeId: "route-3", routeName: "Fort & Suburbs", salary: 20000, totalCollections: 198000, rating: 4.3, isActive: true, createdAt: "2024-02-01", updatedAt: "2024-08-06" },
];

// ---- Users ----
export const mockUsers: User[] = [
  { id: "user-1", name: "Admin User", email: "admin@aquaflow.in", phone: "+91 9876543200", role: "super_admin", permissions: [], companyId: "comp-1", isActive: true, lastLogin: "2024-08-06T10:30:00", createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "user-2", name: "Sajal Rahman", email: "sajal@aquaflow.in", phone: "+91 9876543201", role: "company_owner", permissions: [], companyId: "comp-1", isActive: true, lastLogin: "2024-08-06T09:15:00", createdAt: "2024-01-01", updatedAt: "2024-08-06" },
  { id: "user-3", name: "Anil Kumar", email: "anil@aquaflow.in", phone: "+91 9876543202", role: "warehouse_manager", permissions: [], companyId: "comp-1", warehouseId: "wh-1", isActive: true, lastLogin: "2024-08-06T08:45:00", createdAt: "2024-01-15", updatedAt: "2024-08-06" },
  { id: "user-4", name: "Binu Joseph", email: "binu@aquaflow.in", phone: "+91 9876543203", role: "warehouse_manager", permissions: [], companyId: "comp-1", warehouseId: "wh-2", isActive: true, lastLogin: "2024-08-05T16:30:00", createdAt: "2024-02-01", updatedAt: "2024-08-06" },
  { id: "user-5", name: "Meera Nair", email: "meera@aquaflow.in", phone: "+91 9876543204", role: "sales_manager", permissions: [], companyId: "comp-1", isActive: true, lastLogin: "2024-08-06T11:00:00", createdAt: "2024-01-15", updatedAt: "2024-08-06" },
  { id: "user-6", name: "Rahul Dev", email: "rahul@aquaflow.in", phone: "+91 9876543205", role: "billing_staff", permissions: [], companyId: "comp-1", isActive: true, lastLogin: "2024-08-06T10:00:00", createdAt: "2024-03-01", updatedAt: "2024-08-06" },
  { id: "user-7", name: "Priya K.", email: "priya@aquaflow.in", phone: "+91 9876543206", role: "accountant", permissions: [], companyId: "comp-1", isActive: true, lastLogin: "2024-08-06T09:30:00", createdAt: "2024-02-15", updatedAt: "2024-08-06" },
];

// ---- Invoices ----
export const mockInvoices: Invoice[] = [
  { id: "inv-1", invoiceNumber: "INV-2024-001", type: "gst", customerId: "cust-1", customerName: "Hotel Grand Palace", customerGST: "32AADCH1234R1ZX", items: [{ id: "ii-1", productId: "prod-5", productName: "Bisleri 20L", hsnCode: "2201", quantity: 50, unitPrice: 80, discount: 0, taxRate: 18, cgst: 360, sgst: 360, total: 4720 }, { id: "ii-2", productId: "prod-2", productName: "Bisleri 1L", hsnCode: "2201", quantity: 100, unitPrice: 20, discount: 5, taxRate: 18, cgst: 171, sgst: 171, total: 2242 }], subtotal: 5900, cgst: 531, sgst: 531, igst: 0, discount: 100, roundOff: -2, total: 6860, amountPaid: 4000, amountDue: 2860, status: "partial", payments: [{ id: "pay-1", invoiceId: "inv-1", amount: 4000, method: "upi", referenceNumber: "UPI123456", date: "2024-08-01", createdBy: "user-6", createdAt: "2024-08-01" }], dueDate: "2024-08-15", createdBy: "user-6", createdAt: "2024-08-01", updatedAt: "2024-08-06" },
  { id: "inv-2", invoiceNumber: "INV-2024-002", type: "gst", customerId: "cust-5", customerName: "Lulu Hypermarket", customerGST: "32AADCL5678R1ZY", items: [{ id: "ii-3", productId: "prod-1", productName: "Bisleri 500ml", hsnCode: "2201", quantity: 500, unitPrice: 10, discount: 0, taxRate: 18, cgst: 450, sgst: 450, total: 5900 }, { id: "ii-4", productId: "prod-6", productName: "Kinley 500ml", hsnCode: "2201", quantity: 300, unitPrice: 9, discount: 0, taxRate: 18, cgst: 243, sgst: 243, total: 3186 }], subtotal: 7700, cgst: 693, sgst: 693, igst: 0, discount: 0, roundOff: -1, total: 9085, amountPaid: 9085, amountDue: 0, status: "paid", payments: [{ id: "pay-2", invoiceId: "inv-2", amount: 9085, method: "bank_transfer", referenceNumber: "NEFT789012", date: "2024-08-03", createdBy: "user-6", createdAt: "2024-08-03" }], dueDate: "2024-08-30", createdBy: "user-6", createdAt: "2024-08-02", updatedAt: "2024-08-03" },
  { id: "inv-3", invoiceNumber: "INV-2024-003", type: "gst", customerId: "cust-3", customerName: "TechPark Cafeteria", items: [{ id: "ii-5", productId: "prod-15", productName: "AquaFlow Pure 20L Jar", hsnCode: "2201", quantity: 30, unitPrice: 60, discount: 0, taxRate: 18, cgst: 162, sgst: 162, total: 2124 }], subtotal: 1800, cgst: 162, sgst: 162, igst: 0, discount: 0, roundOff: -1, total: 2123, amountPaid: 0, amountDue: 2123, status: "overdue", payments: [], dueDate: "2024-07-30", createdBy: "user-6", createdAt: "2024-07-15", updatedAt: "2024-08-06" },
  { id: "inv-4", invoiceNumber: "INV-2024-004", type: "gst", customerId: "cust-2", customerName: "City Supermarket", items: [{ id: "ii-6", productId: "prod-9", productName: "Aquafina 500ml", hsnCode: "2201", quantity: 200, unitPrice: 10, discount: 0, taxRate: 18, cgst: 180, sgst: 180, total: 2360 }], subtotal: 2000, cgst: 180, sgst: 180, igst: 0, discount: 0, roundOff: 0, total: 2360, amountPaid: 2360, amountDue: 0, status: "paid", payments: [{ id: "pay-3", invoiceId: "inv-4", amount: 2360, method: "cash", date: "2024-08-05", createdBy: "user-6", createdAt: "2024-08-05" }], dueDate: "2024-08-12", createdBy: "user-6", createdAt: "2024-08-05", updatedAt: "2024-08-05" },
  { id: "inv-5", invoiceNumber: "INV-2024-005", type: "gst", customerId: "cust-8", customerName: "Fresh Mart", customerGST: "32AADCF9012R1ZZ", items: [{ id: "ii-7", productId: "prod-1", productName: "Bisleri 500ml", hsnCode: "2201", quantity: 1000, unitPrice: 10, discount: 500, taxRate: 18, cgst: 855, sgst: 855, total: 11210 }, { id: "ii-8", productId: "prod-2", productName: "Bisleri 1L", hsnCode: "2201", quantity: 500, unitPrice: 17, discount: 250, taxRate: 18, cgst: 720.9, sgst: 720.9, total: 9441.8 }], subtotal: 18500, cgst: 1575.9, sgst: 1575.9, igst: 0, discount: 750, roundOff: 0.2, total: 20902, amountPaid: 0, amountDue: 20902, status: "sent", payments: [], dueDate: "2024-08-20", createdBy: "user-6", createdAt: "2024-08-06", updatedAt: "2024-08-06" },
];

// ---- Deliveries ----
export const mockDeliveries: Delivery[] = [
  { id: "del-1", deliveryNumber: "DEL-2024-001", routeId: "route-1", routeName: "City Center Route", driverId: "drv-1", driverName: "Sunil M.", vehicleId: "veh-1", vehicleNumber: "KL-07-AX-1234", date: "2024-08-06", items: [{ customerId: "cust-1", customerName: "Hotel Grand Palace", orderId: "ord-1", products: [{ productId: "prod-5", productName: "Bisleri 20L", orderedQuantity: 20, deliveredQuantity: 20 }], status: "delivered", deliveredAt: "2024-08-06T09:30:00" }, { customerId: "cust-2", customerName: "City Supermarket", orderId: "ord-2", products: [{ productId: "prod-9", productName: "Aquafina 500ml", orderedQuantity: 100, deliveredQuantity: 100 }], status: "delivered", deliveredAt: "2024-08-06T10:15:00" }, { customerId: "cust-4", customerName: "Sea Shell Restaurant", orderId: "ord-3", products: [{ productId: "prod-15", productName: "AquaFlow Pure 20L Jar", orderedQuantity: 10, deliveredQuantity: 0 }], status: "scheduled" }], totalItems: 3, deliveredItems: 2, status: "in_transit", startTime: "2024-08-06T08:00:00", createdAt: "2024-08-06", updatedAt: "2024-08-06" },
  { id: "del-2", deliveryNumber: "DEL-2024-002", routeId: "route-2", routeName: "Tech Park Route", driverId: "drv-2", driverName: "Rajan K.", vehicleId: "veh-2", vehicleNumber: "KL-07-BX-5678", date: "2024-08-06", items: [{ customerId: "cust-3", customerName: "TechPark Cafeteria", orderId: "ord-4", products: [{ productId: "prod-15", productName: "AquaFlow Pure 20L Jar", orderedQuantity: 15, deliveredQuantity: 15 }], status: "delivered", deliveredAt: "2024-08-06T09:45:00" }, { customerId: "cust-5", customerName: "Lulu Hypermarket", orderId: "ord-5", products: [{ productId: "prod-1", productName: "Bisleri 500ml", orderedQuantity: 200, deliveredQuantity: 200 }], status: "delivered", deliveredAt: "2024-08-06T11:00:00" }], totalItems: 2, deliveredItems: 2, status: "delivered", startTime: "2024-08-06T08:30:00", endTime: "2024-08-06T12:00:00", createdAt: "2024-08-06", updatedAt: "2024-08-06" },
];

// ---- Sales Orders ----
export const mockSalesOrders: SalesOrder[] = [
  { id: "so-1", orderNumber: "SO-2024-001", customerId: "cust-1", customerName: "Hotel Grand Palace", items: [{ productId: "prod-5", productName: "Bisleri 20L", brandName: "Bisleri", quantity: 50, unitPrice: 80, discount: 0, taxRate: 18, taxAmount: 720, total: 4720 }], subtotal: 4000, taxAmount: 720, discount: 0, roundOff: 0, total: 4720, status: "delivered", paymentStatus: "partial", createdBy: "user-5", createdAt: "2024-08-01", updatedAt: "2024-08-06" },
  { id: "so-2", orderNumber: "SO-2024-002", customerId: "cust-5", customerName: "Lulu Hypermarket", items: [{ productId: "prod-1", productName: "Bisleri 500ml", brandName: "Bisleri", quantity: 500, unitPrice: 10, discount: 0, taxRate: 18, taxAmount: 900, total: 5900 }], subtotal: 5000, taxAmount: 900, discount: 0, roundOff: 0, total: 5900, status: "processing", paymentStatus: "unpaid", createdBy: "user-5", createdAt: "2024-08-05", updatedAt: "2024-08-06" },
  { id: "so-3", orderNumber: "SO-2024-003", customerId: "cust-3", customerName: "TechPark Cafeteria", items: [{ productId: "prod-15", productName: "AquaFlow Pure 20L Jar", brandName: "AquaFlow Pure", quantity: 30, unitPrice: 60, discount: 0, taxRate: 18, taxAmount: 324, total: 2124 }], subtotal: 1800, taxAmount: 324, discount: 0, roundOff: -1, total: 2123, status: "pending", paymentStatus: "unpaid", createdBy: "user-5", createdAt: "2024-08-06", updatedAt: "2024-08-06" },
];

// ---- Purchase Orders ----
export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "po-1", orderNumber: "PO-2024-001", supplierId: "sup-1", supplierName: "Bisleri International Pvt. Ltd.", warehouseId: "wh-1", warehouseName: "Main Warehouse", items: [{ productId: "prod-1", productName: "Bisleri 500ml", quantity: 5000, receivedQuantity: 5000, unitPrice: 8, taxRate: 18, taxAmount: 7200, total: 47200 }, { productId: "prod-2", productName: "Bisleri 1L", quantity: 3000, receivedQuantity: 3000, unitPrice: 14, taxRate: 18, taxAmount: 7560, total: 49560 }], subtotal: 82000, taxAmount: 14760, discount: 0, total: 96760, status: "received", paymentStatus: "paid", receivedDate: "2024-07-25", createdBy: "user-3", createdAt: "2024-07-20", updatedAt: "2024-07-25" },
  { id: "po-2", orderNumber: "PO-2024-002", supplierId: "sup-2", supplierName: "Coca-Cola India (Kinley)", warehouseId: "wh-1", warehouseName: "Main Warehouse", items: [{ productId: "prod-6", productName: "Kinley 500ml", quantity: 4000, receivedQuantity: 0, unitPrice: 7, taxRate: 18, taxAmount: 5040, total: 33040 }], subtotal: 28000, taxAmount: 5040, discount: 0, total: 33040, status: "pending", paymentStatus: "unpaid", expectedDate: "2024-08-10", createdBy: "user-3", createdAt: "2024-08-04", updatedAt: "2024-08-04" },
];

// ---- Expenses ----
export const mockExpenses: Expense[] = [
  { id: "exp-1", category: "fuel", description: "Diesel for delivery vehicles", amount: 5000, date: "2024-08-06", paymentMethod: "cash", status: "approved", createdBy: "user-3", createdAt: "2024-08-06", updatedAt: "2024-08-06" },
  { id: "exp-2", category: "salary", description: "Driver salaries - August", amount: 56000, date: "2024-08-01", paymentMethod: "bank_transfer", referenceNumber: "SAL-AUG-24", status: "approved", createdBy: "user-7", createdAt: "2024-08-01", updatedAt: "2024-08-01" },
  { id: "exp-3", category: "rent", description: "Warehouse rent - Main", amount: 35000, date: "2024-08-01", paymentMethod: "bank_transfer", referenceNumber: "RENT-AUG-24", status: "approved", createdBy: "user-7", createdAt: "2024-08-01", updatedAt: "2024-08-01" },
  { id: "exp-4", category: "maintenance", description: "Vehicle service - KL-07-AX-1234", amount: 8500, date: "2024-08-03", paymentMethod: "upi", status: "approved", createdBy: "user-3", createdAt: "2024-08-03", updatedAt: "2024-08-03" },
  { id: "exp-5", category: "electricity", description: "Electricity bill - Main Warehouse", amount: 12000, date: "2024-08-05", paymentMethod: "bank_transfer", status: "pending", createdBy: "user-7", createdAt: "2024-08-05", updatedAt: "2024-08-05" },
];

// ---- Collections ----
export const mockCollections: Collection[] = [
  { id: "col-1", customerId: "cust-1", customerName: "Hotel Grand Palace", invoiceId: "inv-1", invoiceNumber: "INV-2024-001", amount: 4000, method: "upi", referenceNumber: "UPI123456", collectedBy: "Sunil M.", date: "2024-08-06", createdAt: "2024-08-06" },
  { id: "col-2", customerId: "cust-2", customerName: "City Supermarket", invoiceId: "inv-4", invoiceNumber: "INV-2024-004", amount: 2360, method: "cash", collectedBy: "Sunil M.", date: "2024-08-06", createdAt: "2024-08-06" },
  { id: "col-3", customerId: "cust-5", customerName: "Lulu Hypermarket", invoiceId: "inv-2", invoiceNumber: "INV-2024-002", amount: 9085, method: "bank_transfer", referenceNumber: "NEFT789012", collectedBy: "Office", date: "2024-08-05", createdAt: "2024-08-05" },
  { id: "col-4", customerId: "cust-6", customerName: "Marina Bay Hotel", amount: 15000, method: "cheque", referenceNumber: "CHQ-456789", collectedBy: "Vijay S.", date: "2024-08-05", createdAt: "2024-08-05" },
];

// ---- Notifications ----
export const mockNotifications: Notification[] = [
  { id: "notif-1", type: "low_stock", title: "Low Stock Alert", message: "Bisleri 20L has only 180 units left (minimum: 50)", isRead: false, actionUrl: "/inventory", createdAt: "2024-08-06T10:30:00" },
  { id: "notif-2", type: "payment_due", title: "Payment Overdue", message: "TechPark Cafeteria has ₹2,123 overdue since Jul 30", isRead: false, actionUrl: "/customers/cust-3", createdAt: "2024-08-06T09:00:00" },
  { id: "notif-3", type: "delivery_completed", title: "Delivery Completed", message: "Tech Park Route delivery completed by Rajan K.", isRead: false, actionUrl: "/deliveries/del-2", createdAt: "2024-08-06T12:00:00" },
  { id: "notif-4", type: "order_ready", title: "Purchase Order Ready", message: "PO-2024-002 from Kinley expected on Aug 10", isRead: true, actionUrl: "/purchases/po-2", createdAt: "2024-08-05T15:00:00" },
  { id: "notif-5", type: "collection_reminder", title: "Collection Reminder", message: "Fresh Mart has ₹89,500 outstanding balance", isRead: true, actionUrl: "/customers/cust-8", createdAt: "2024-08-05T10:00:00" },
  { id: "notif-6", type: "system_alert", title: "Insurance Expiring", message: "Vehicle KL-07-BX-5678 insurance expires on Mar 15, 2025", isRead: true, actionUrl: "/vehicles/veh-2", createdAt: "2024-08-04T09:00:00" },
];

// ---- Stock Movements ----
export const mockStockMovements: StockMovement[] = [
  { id: "sm-1", productId: "prod-1", productName: "Bisleri 500ml", warehouseId: "wh-1", type: "purchase", quantity: 5000, previousStock: 420, currentStock: 5420, referenceId: "po-1", referenceType: "purchase_order", createdBy: "user-3", createdAt: "2024-07-25T10:00:00" },
  { id: "sm-2", productId: "prod-1", productName: "Bisleri 500ml", warehouseId: "wh-1", type: "sale", quantity: -500, previousStock: 5420, currentStock: 4920, referenceId: "inv-2", referenceType: "invoice", createdBy: "user-6", createdAt: "2024-08-02T14:00:00" },
  { id: "sm-3", productId: "prod-1", productName: "Bisleri 500ml", warehouseId: "wh-1", type: "sale", quantity: -1000, previousStock: 4920, currentStock: 3920, referenceId: "inv-5", referenceType: "invoice", createdBy: "user-6", createdAt: "2024-08-06T09:00:00" },
  { id: "sm-4", productId: "prod-1", productName: "Bisleri 500ml", warehouseId: "wh-1", type: "transfer_out", quantity: -500, previousStock: 3920, currentStock: 3420, referenceId: "transfer-1", referenceType: "stock_transfer", createdBy: "user-3", createdAt: "2024-08-06T11:00:00" },
  { id: "sm-5", productId: "prod-5", productName: "Bisleri 20L", warehouseId: "wh-1", type: "sale", quantity: -50, previousStock: 230, currentStock: 180, referenceId: "inv-1", referenceType: "invoice", createdBy: "user-6", createdAt: "2024-08-01T10:00:00" },
  { id: "sm-6", productId: "prod-15", productName: "AquaFlow Pure 20L Jar", warehouseId: "wh-1", type: "sale", quantity: -30, previousStock: 350, currentStock: 320, referenceId: "inv-3", referenceType: "invoice", createdBy: "user-6", createdAt: "2024-07-15T14:00:00" },
];

// ---- Dashboard Stats ----
export const mockDashboardStats: DashboardStats = {
  todaySales: 48250,
  monthlySales: 856420,
  totalRevenue: 4285600,
  outstandingPayments: 639900,
  totalCustomers: 12,
  activeCustomers: 11,
  inactiveCustomers: 1,
  lowStockItems: 3,
  outOfStockItems: 0,
  pendingDeliveries: 5,
  completedDeliveries: 18,
  vehiclesOnRoute: 2,
  dailyCollection: 30445,
  cashFlow: 125800,
  purchaseCost: 612400,
  profit: 244020,
};

// ---- Monthly Sales Data (for charts) ----
export const monthlySalesData = [
  { month: "Jan", sales: 520000, purchases: 380000, profit: 140000, collections: 490000 },
  { month: "Feb", sales: 580000, purchases: 410000, profit: 170000, collections: 545000 },
  { month: "Mar", sales: 620000, purchases: 430000, profit: 190000, collections: 600000 },
  { month: "Apr", sales: 560000, purchases: 390000, profit: 170000, collections: 540000 },
  { month: "May", sales: 680000, purchases: 470000, profit: 210000, collections: 650000 },
  { month: "Jun", sales: 750000, purchases: 520000, profit: 230000, collections: 720000 },
  { month: "Jul", sales: 820000, purchases: 560000, profit: 260000, collections: 790000 },
  { month: "Aug", sales: 856420, purchases: 612400, profit: 244020, collections: 830000 },
];

// ---- Daily Sales Data (for charts) ----
export const dailySalesData = [
  { day: "Mon", sales: 42500, orders: 18 },
  { day: "Tue", sales: 38200, orders: 15 },
  { day: "Wed", sales: 51800, orders: 22 },
  { day: "Thu", sales: 45600, orders: 19 },
  { day: "Fri", sales: 55200, orders: 24 },
  { day: "Sat", sales: 48250, orders: 20 },
  { day: "Sun", sales: 28000, orders: 12 },
];

// ---- Inventory by Category (for charts) ----
export const inventoryByCategory = [
  { name: "Packaged Water", value: 45, fill: "hsl(210, 100%, 56%)" },
  { name: "Mineral Water", value: 18, fill: "hsl(160, 100%, 40%)" },
  { name: "Soda", value: 15, fill: "hsl(280, 100%, 60%)" },
  { name: "Juice", value: 12, fill: "hsl(30, 100%, 56%)" },
  { name: "Others", value: 10, fill: "hsl(0, 0%, 60%)" },
];

// ---- Top Products ----
export const topProductsData = [
  { name: "Bisleri 500ml", sales: 15200, revenue: 182400 },
  { name: "AquaFlow Pure 20L", sales: 8500, revenue: 510000 },
  { name: "Kinley 500ml", sales: 12800, revenue: 128000 },
  { name: "Bisleri 1L", sales: 9600, revenue: 192000 },
  { name: "Aquafina 500ml", sales: 11200, revenue: 134400 },
];
