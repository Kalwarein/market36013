# Market360 - Step A Deliverables

## Overview
Market360 is a mobile-first B2B marketplace for Sierra Leone, inspired by Alibaba-style layouts but with custom branding and improved UX.

## Design System Implementation

### Color Tokens (HSL Format)
All colors are defined as HSL values in `src/index.css`:

- **market360-green**: `142 76% 34%` - Primary actions, success states
- **market360-blue**: `211 100% 52%` - Secondary actions, accents  
- **market360-dark**: `160 55% 11%` - Dark text on light backgrounds
- **neutral-900**: `220 18% 12%` - Body text
- **neutral-500**: `220 9% 46%` - Secondary text
- **bg-white**: `0 0% 100%` - Cards, primary background
- **surface-1**: `210 40% 98%` - Page background alternate
- **danger-red**: `0 72% 57%` - Errors, destructive actions

### Spacing & Radius
- **Border Radius**: 8px (sm), 12px (md), 20px (lg)
- **Shadows**: sm, md, lg elevation tokens defined in `tailwind.config.ts`
- **Safe Areas**: iOS-safe utilities (safe-top, safe-bottom) for notched devices

## Component Architecture

### File Structure
```
src/
├── components/
│   ├── market360/
│   │   ├── Header.tsx            # Search bar, camera icon, menu
│   │   ├── BottomNav.tsx         # 5-tab navigation with elevated center
│   │   ├── ProductCard.tsx       # Grid & list layouts
│   │   ├── CategoryChips.tsx     # Horizontal scrollable filters
│   │   └── ProductCarousel.tsx   # Horizontal product scrollers
│   └── ui/                       # Shadcn base components
├── data/
│   └── mockData.ts               # Seed data (10 products, 5 sellers)
├── pages/
│   ├── Home.tsx                  # Landing feed with carousels
│   ├── CategoryListing.tsx       # Filtered grid/list with toggle
│   └── ProductDetail.tsx         # Detail page with sticky CTA
└── index.css                     # Design tokens
```

## Component Specifications

### 1. Header Component
**Props**: None (stateless)  
**Features**:
- Sticky top positioning
- Search input with camera icon button
- Account menu button
- Responsive logo display

**Acceptance Criteria**:
- ✅ Sticky at top of viewport
- ✅ Search bar fills available space
- ✅ Camera icon for image search (click handler ready)
- ✅ Mobile-optimized (44px tap targets)

---

### 2. BottomNav Component
**Props**:
```typescript
interface BottomNavProps {
  visible?: boolean; // Controls slide animation
}
```

**Features**:
- 5 navigation items (Home, Categories, Browse, Cart, Profile)
- Elevated circular center button (Browse/Scan)
- Active state highlighting
- Slide up/down animation via `visible` prop

**Acceptance Criteria**:
- ✅ Center tab is visually elevated (+shadow, larger size)
- ✅ Hides when `visible={false}` (slide-down animation)
- ✅ Active route highlighted with primary color
- ✅ Safe area insets for iOS devices

---

### 3. ProductCard Component
**Props**:
```typescript
interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}
```

**Product Data Structure**:
```json
{
  "id": "p_001",
  "title": "Mobile App Development Services - Basic Package",
  "price": { "amount": 2000, "currency": "USD" },
  "image": "https://images.unsplash.com/...",
  "seller": {
    "id": "s_01",
    "name": "Freetown Devs",
    "rating": 4.7,
    "verified": true
  },
  "location": "Freetown",
  "tags": ["services", "software", "development"],
  "promotion": { "type": "flash", "label": "US$2,000" },
  "stock": "Available",
  "moq": 1
}
```

**Features**:
- Grid layout: Vertical card with image, seller badge, price, wishlist
- List layout: Horizontal card with smaller image, inline details
- Promotion badges (Flash, Deal, New)
- Verified seller shield icon
- Active press animation (scale 0.98)

**Acceptance Criteria**:
- ✅ Links to `/product/:id`
- ✅ Displays all core product fields
- ✅ Responsive aspect ratio (1:1 for grid images)
- ✅ Wishlist icon (click handler stub)

---

### 4. CategoryChips Component
**Props**:
```typescript
interface CategoryChipsProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}
```

**Features**:
- Horizontal scroll (no scrollbar visible)
- Icon + label for each category
- Active state: filled background with primary color
- Smooth transitions

**Acceptance Criteria**:
- ✅ Scrolls horizontally on mobile
- ✅ Active category visually distinct
- ✅ Touch-friendly padding (min 44px height)

---

### 5. ProductCarousel Component
**Props**:
```typescript
interface ProductCarouselProps {
  title: string;
  products: Product[];
  actionLabel?: string;
}
```

**Features**:
- Section header with "See all" action
- Horizontal scrolling product cards (160px width each)
- Manual swipe only (no autoplay)

**Acceptance Criteria**:
- ✅ Cards scroll smoothly
- ✅ Title and action link aligned
- ✅ Works with any product array

---

## Page Specifications

### Home Page (`/`)
**Features**:
- Header (search, camera, menu)
- Category chips (all categories)
- "Top Deals" carousel (products with flash/deal promotions)
- "Top Ranking" carousel (first 6 products)
- "New Arrivals" carousel (products with "new" promotion)
- Bottom navigation (visible)

**User Flow**:
1. User lands on home
2. Browse categories via chips
3. Tap product card → Navigate to detail
4. Bottom nav always visible

---

### Category Listing Page (`/categories`)
**Features**:
- Header (sticky)
- Sticky filter bar with category chips
- Grid/List toggle buttons
- Product count indicator
- Filtered product grid/list
- Bottom navigation (visible)

**Filtering Logic**:
- "All" shows all products
- Other categories filter by `product.tags`

**User Flow**:
1. User navigates from home via bottom nav
2. Select category chip → Products filter
3. Toggle grid ↔ list layout
4. Tap product → Navigate to detail

---

### Product Detail Page (`/product/:id`)
**Features**:
- Back button header (no bottom nav)
- Full-width product image
- Price + MOQ + quantity selector
- Seller card (name, rating, verification, actions)
- Description section
- Specifications accordion
- Related products carousel
- Sticky CTA bar (Add to Cart, Buy Now)

**Navigation Behavior**:
- Bottom nav **HIDDEN** on this page
- Sticky CTA bar **VISIBLE** instead
- Back button returns to previous page

**User Flow**:
1. User clicks product card
2. Bottom nav slides down (hidden)
3. Sticky CTA slides up
4. User views details, selects quantity
5. Contact seller OR Add to cart
6. Back button → Bottom nav returns

---

## Mock Data

### Seed Data Location
`src/data/mockData.ts`

### Included Data
- **5 Sellers**: Freetown Devs, TechHub SL, Local Traders, Sierra Solutions, Global Imports
- **10 Products**: Mix of services, equipment, electronics
- **6 Categories**: All, Consumer Electronics, Security, Commercial Equipment, Fashion, Home & Living

### How to Add More Data
1. Open `src/data/mockData.ts`
2. Add new entries to `sellers` or `products` arrays
3. Follow existing TypeScript interfaces
4. Component will automatically render new items

---

## Running the Prototype

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:8080`

### Mobile Testing
1. Get your local network IP (e.g., 192.168.1.x)
2. Access via mobile: `http://[YOUR_IP]:8080`
3. Or use browser DevTools mobile emulation

---

## Responsive Behavior

### Breakpoints
- **Mobile**: < 768px (primary target)
- **Tablet/Desktop**: ≥ 768px (scales up gracefully)

### Key Adaptations
- Logo text hidden on small screens
- Grid cards adjust to container width
- Touch targets minimum 44x44px
- Safe area insets for iOS notch

---

## Acceptance Checklist (Step A)

- ✅ Design tokens defined in HSL format
- ✅ Three mobile mockup wireframes generated
- ✅ Component architecture documented
- ✅ Mock data with 5 sellers + 10 products
- ✅ Home page with carousels implemented
- ✅ Category listing with grid/list toggle
- ✅ Product detail with sticky CTA (no bottom nav)
- ✅ Bottom navigation with elevated center tab
- ✅ Responsive mobile-first design
- ✅ README with usage instructions

---

## Next Steps (Awaiting Confirmation)

**Step B**: Build inquire modal, image carousel enhancements  
**Step C**: Cart/checkout stub pages  
**Step D**: Animation refinements (swipe gestures, transitions)  
**Step E**: Accessibility audit + localization keys

---

## Design Notes

### Improvements Over Reference
- **Cleaner spacing**: More whitespace around cards
- **Consistent aspect ratios**: 1:1 for product images
- **Clear price hierarchy**: Large bold price + small currency
- **Seller verification**: Shield icon prominently displayed
- **Contextual CTAs**: "Inquire", "Contact", "Buy Now" clearly labeled
- **Bottom nav behavior**: Hides on detail, shows on listing (better UX)

### Known Limitations (Stubs)
- Image carousel: Single image only (multi-image in Step B)
- Inquire modal: Not yet implemented (Step B)
- Cart functionality: Placeholder routes only (Step C)
- Payment flow: Stub only (future integration)
- User authentication: Not included in MVP

---

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + HSL design tokens
- **Routing**: React Router v6
- **UI Components**: Shadcn/ui (customized)
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## Contact & Feedback
This is **Step A** deliverable. Please review and confirm before proceeding to Step B.

For questions about implementation or to request changes to the design system, reply in the chat.
