export interface Seller {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  totalOrders?: number;
  responseTime?: string;
}

export interface Product {
  id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
  };
  image: string;
  seller: Seller;
  location: string;
  tags: string[];
  promotion?: {
    type: "flash" | "deal" | "new";
    label: string;
  };
  stock: string;
  moq?: number;
  description?: string;
  specifications?: Record<string, string>;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "all", name: "All", icon: "grid" },
  { id: "electronics", name: "Consumer Electronics", icon: "laptop" },
  { id: "security", name: "Security", icon: "shield" },
  { id: "commercial", name: "Commercial Equipment", icon: "building" },
  { id: "fashion", name: "Fashion & Apparel", icon: "shirt" },
  { id: "home", name: "Home & Living", icon: "home" },
];

export const sellers: Seller[] = [
  {
    id: "s_01",
    name: "Freetown Devs",
    rating: 4.7,
    verified: true,
    totalOrders: 1240,
    responseTime: "< 2 hours",
  },
  {
    id: "s_02",
    name: "TechHub SL",
    rating: 4.9,
    verified: true,
    totalOrders: 2450,
    responseTime: "< 1 hour",
  },
  {
    id: "s_03",
    name: "Local Traders",
    rating: 4.5,
    verified: false,
    totalOrders: 580,
    responseTime: "< 4 hours",
  },
  {
    id: "s_04",
    name: "Sierra Solutions",
    rating: 4.8,
    verified: true,
    totalOrders: 1890,
    responseTime: "< 2 hours",
  },
  {
    id: "s_05",
    name: "Global Imports",
    rating: 4.6,
    verified: true,
    totalOrders: 3200,
    responseTime: "< 3 hours",
  },
];

export const products: Product[] = [
  {
    id: "p_001",
    title: "Mobile App Development Services - Basic Package",
    price: { amount: 2000, currency: "USD" },
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400",
    seller: sellers[0],
    location: "Freetown",
    tags: ["services", "software", "development"],
    promotion: { type: "flash", label: "US$2,000" },
    stock: "Available",
    moq: 1,
    description: "Professional mobile app development with modern frameworks",
    specifications: {
      "Delivery Time": "4-6 weeks",
      Platform: "iOS & Android",
      "Tech Stack": "React Native",
      Support: "3 months free",
    },
  },
  {
    id: "p_002",
    title: "Commercial Solar Panel System 5kW",
    price: { amount: 4500, currency: "USD" },
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    seller: sellers[1],
    location: "Bo",
    tags: ["energy", "solar", "commercial"],
    promotion: { type: "deal", label: "Save 15%" },
    stock: "In Stock",
    moq: 1,
    description: "Complete solar panel installation for commercial buildings",
    specifications: {
      Power: "5kW",
      "Panel Type": "Monocrystalline",
      Warranty: "25 years",
      Installation: "Included",
    },
  },
  {
    id: "p_003",
    title: "Security Camera System (8 Cameras + DVR)",
    price: { amount: 850, currency: "USD" },
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400",
    seller: sellers[3],
    location: "Freetown",
    tags: ["security", "electronics", "surveillance"],
    stock: "In Stock",
    moq: 1,
    description: "Professional security camera system with night vision",
    specifications: {
      Resolution: "1080p Full HD",
      "Night Vision": "Up to 30m",
      Storage: "1TB HDD included",
      Cameras: "8 units",
    },
  },
  {
    id: "p_004",
    title: "Industrial Generator 10kVA",
    price: { amount: 3200, currency: "USD" },
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
    seller: sellers[4],
    location: "Kenema",
    tags: ["commercial", "power", "equipment"],
    promotion: { type: "new", label: "New Arrival" },
    stock: "Limited Stock",
    moq: 1,
    description: "Heavy-duty diesel generator for commercial use",
    specifications: {
      Power: "10kVA / 8kW",
      "Fuel Type": "Diesel",
      "Run Time": "8-10 hours",
      Noise: "Low noise design",
    },
  },
  {
    id: "p_005",
    title: "Office Furniture Set - Complete Package",
    price: { amount: 1200, currency: "USD" },
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    seller: sellers[2],
    location: "Freetown",
    tags: ["furniture", "office", "commercial"],
    stock: "In Stock",
    moq: 1,
    description: "Modern office furniture set for 6 workstations",
    specifications: {
      Includes: "Desks, Chairs, Cabinets",
      Capacity: "6 workstations",
      Material: "Wood & Metal",
      Assembly: "Free installation",
    },
  },
  {
    id: "p_006",
    title: "Professional Laptop - Business Edition",
    price: { amount: 950, currency: "USD" },
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    seller: sellers[1],
    location: "Freetown",
    tags: ["electronics", "computer", "business"],
    promotion: { type: "flash", label: "Flash Sale" },
    stock: "In Stock",
    moq: 5,
    description: "High-performance business laptop with warranty",
    specifications: {
      Processor: "Intel i7 11th Gen",
      RAM: "16GB DDR4",
      Storage: "512GB SSD",
      Display: '15.6" Full HD',
    },
  },
  {
    id: "p_007",
    title: "Point of Sale (POS) System",
    price: { amount: 650, currency: "USD" },
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    seller: sellers[0],
    location: "Freetown",
    tags: ["retail", "software", "hardware"],
    stock: "Available",
    moq: 1,
    description: "Complete POS system with software and hardware",
    specifications: {
      Includes: "Terminal, Scanner, Printer",
      Software: "Cloud-based",
      Support: "24/7 technical support",
      Training: "Free staff training",
    },
  },
  {
    id: "p_008",
    title: "LED Display Screen - Outdoor",
    price: { amount: 5500, currency: "USD" },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    seller: sellers[4],
    location: "Freetown",
    tags: ["advertising", "electronics", "commercial"],
    promotion: { type: "deal", label: "Best Price" },
    stock: "In Stock",
    moq: 1,
    description: "Large outdoor LED display for advertising",
    specifications: {
      Size: "3m x 2m",
      Resolution: "Full HD",
      Brightness: "6000 nits",
      Waterproof: "IP65 rated",
    },
  },
  {
    id: "p_009",
    title: "Restaurant Kitchen Equipment Set",
    price: { amount: 4200, currency: "USD" },
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
    seller: sellers[3],
    location: "Bo",
    tags: ["restaurant", "commercial", "equipment"],
    stock: "In Stock",
    moq: 1,
    description: "Complete kitchen equipment for small restaurant",
    specifications: {
      Includes: "Stove, Oven, Refrigerator, Prep Tables",
      Capacity: "Small to medium restaurant",
      Warranty: "2 years",
      Installation: "Professional setup included",
    },
  },
  {
    id: "p_010",
    title: "Printing Services - Business Cards & Flyers",
    price: { amount: 150, currency: "USD" },
    image: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=400",
    seller: sellers[2],
    location: "Freetown",
    tags: ["printing", "services", "marketing"],
    stock: "Available",
    moq: 500,
    description: "Professional printing services for business materials",
    specifications: {
      "Business Cards": "500 pcs included",
      Flyers: "1000 pcs included",
      Quality: "Premium glossy finish",
      "Delivery Time": "3-5 business days",
    },
  },
];
