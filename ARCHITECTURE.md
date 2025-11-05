# Market360 Architecture - Step A

## Component Hierarchy

```
App
├── Home (/)
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar
│   │   │   └── CameraButton
│   │   └── MenuButton
│   ├── CategoryChips
│   │   └── CategoryChip[] (with icons)
│   ├── ProductCarousel ("Top Deals")
│   │   └── ProductCard[] (grid layout, 160px width)
│   ├── ProductCarousel ("Top Ranking")
│   │   └── ProductCard[]
│   ├── ProductCarousel ("New Arrivals")
│   │   └── ProductCard[]
│   └── BottomNav (visible)
│
├── CategoryListing (/categories)
│   ├── Header
│   ├── StickyFilterBar
│   │   ├── CategoryChips
│   │   └── LayoutToggle (Grid/List)
│   ├── ProductGrid or ProductList
│   │   └── ProductCard[] (grid or list layout)
│   └── BottomNav (visible)
│
└── ProductDetail (/product/:id)
    ├── HeaderMinimal
    │   ├── BackButton
    │   ├── ShareButton
    │   └── WishlistButton
    ├── ImageGallery (single image for now)
    ├── ProductInfo
    │   ├── Title & Location
    │   ├── Price & Currency
    │   └── QuantitySelector
    ├── SellerCard
    │   ├── SellerProfile
    │   ├── Rating & Verification
    │   └── ActionButtons (Contact, Inquire, Visit Store)
    ├── DescriptionSection
    ├── SpecificationsAccordion
    ├── ProductCarousel ("Related Products")
    ├── StickyCTABar (Add to Cart, Buy Now)
    └── BottomNav (HIDDEN)
```

## Data Flow

```
mockData.ts
├── categories[]        → CategoryChips component
├── sellers[]          → Product.seller property
└── products[]         → ProductCard, ProductCarousel, ProductDetail
    ├── Filtered by category in CategoryListing
    ├── Filtered by promotion in Home carousels
    └── Filtered by tags for Related Products
```

## State Management

### Page-Level State
- **Home**: `activeCategory` (string) - filters visible chips highlight
- **CategoryListing**: 
  - `activeCategory` (string) - filters product display
  - `layout` ("grid" | "list") - toggles card layout
- **ProductDetail**: `quantity` (number) - manages quantity selector

### No Global State (Step A)
All state is local to pages. Future steps may add:
- Cart state (Step C)
- Wishlist state
- User authentication state

## Navigation Flow

```
User Journey 1: Browse → Detail
Home → [Tap ProductCard] → ProductDetail
  - BottomNav visible → BottomNav hidden
  - Sticky CTA appears

User Journey 2: Category Filtering
Home → [Tap Categories Tab] → CategoryListing
  - Select category chip → Products filter
  - Toggle grid/list → Layout changes

User Journey 3: Product Detail → Back
ProductDetail → [Tap Back] → Previous page
  - Sticky CTA hidden → BottomNav returns
```

## Design System Tokens

### Usage in Components

| Component | Primary Tokens Used |
|-----------|---------------------|
| Header | `bg-card`, `border-border` |
| BottomNav | `bg-card`, `text-primary` (active), `border-border` |
| ProductCard | `bg-card`, `text-primary` (price), `shadow-sm` |
| Button (primary) | `bg-primary`, `text-primary-foreground` |
| Button (secondary) | `bg-secondary`, `text-secondary-foreground` |
| Badge (promotion) | `bg-primary`, `text-primary-foreground` |
| CategoryChip (active) | `bg-primary`, `text-primary-foreground`, `border-primary` |

### Custom Utilities
- `.tap-highlight-none` - Removes iOS tap highlight
- `.safe-top` / `.safe-bottom` - iOS notch padding
- `.scrollbar-hide` - Hides scrollbar on horizontal scrolls

## Responsive Breakpoints

| Breakpoint | Width | Adaptations |
|------------|-------|-------------|
| Mobile | < 768px | Logo text hidden, single column grid |
| Tablet | ≥ 768px | Logo visible, 2-column grid maintained |
| Desktop | ≥ 1024px | Max-width container, increased padding |

## File Size Estimates

| File | Lines | Purpose |
|------|-------|---------|
| mockData.ts | ~260 | Seed data (10 products, 5 sellers, 6 categories) |
| Header.tsx | ~40 | Search bar with camera icon |
| BottomNav.tsx | ~60 | 5-tab navigation with animations |
| ProductCard.tsx | ~90 | Grid & list layouts |
| CategoryChips.tsx | ~50 | Horizontal scrollable filters |
| ProductCarousel.tsx | ~30 | Section with horizontal product scroller |
| Home.tsx | ~40 | Landing page composition |
| CategoryListing.tsx | ~60 | Filtered grid/list view |
| ProductDetail.tsx | ~180 | Full product detail with related items |

## Mobile-First Considerations

### Touch Targets
- All interactive elements minimum **44x44px**
- Increased padding on mobile buttons
- Larger tap areas for icons

### Performance
- Images lazy-loaded via browser native loading
- Horizontal scrolls use CSS `overflow-x: auto`
- No heavy JavaScript animations (CSS transitions only)

### Accessibility
- Semantic HTML (`<header>`, `<nav>`, `<main>`)
- Alt text on all images (via `product.title`)
- Keyboard navigation ready (focus states defined)
- Color contrast AA compliant (tested)

## Future Enhancements (Steps B-E)

### Step B: Enhanced Interactions
- Multi-image carousel with pinch-zoom
- Inquire modal with attachments
- Long-press wishlist quick-add

### Step C: Cart & Checkout
- Cart page with quantity management
- Checkout flow with address/payment stubs
- Order summary

### Step D: Advanced Features
- Swipe-to-dismiss modals
- Pull-to-refresh on listings
- Skeleton loading states

### Step E: Production Ready
- Localization (English + Krio)
- Accessibility audit & fixes
- High-contrast mode support
- Real backend integration points

---

## Quick Reference: Adding New Products

1. Open `src/data/mockData.ts`
2. Add entry to `products` array:
```typescript
{
  id: "p_011",
  title: "Your Product Name",
  price: { amount: 1000, currency: "USD" },
  image: "https://images.unsplash.com/...",
  seller: sellers[0], // Reference existing seller
  location: "City Name",
  tags: ["category1", "category2"],
  stock: "In Stock",
  moq: 1,
  // Optional fields:
  promotion: { type: "flash", label: "Limited Time" },
  description: "Product description...",
  specifications: { "Key": "Value" }
}
```
3. Save file → Hot reload updates UI automatically

---

## Testing Checklist

- [ ] Home page loads with 3 carousels
- [ ] Category chips filter products correctly
- [ ] Product cards link to detail page
- [ ] Bottom nav highlights active route
- [ ] Bottom nav hides on product detail
- [ ] Sticky CTA bar appears on product detail
- [ ] Back button from detail restores bottom nav
- [ ] Grid/List toggle works on category listing
- [ ] Quantity selector increments/decrements
- [ ] Mobile viewport (360x780) renders correctly
- [ ] Touch targets are 44px minimum
- [ ] No horizontal overflow on any page

---

**Status**: Step A Complete ✅  
**Next**: Awaiting confirmation to proceed to Step B
