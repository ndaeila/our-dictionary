import {
  // Common actions
  Add,
  Edit,
  Delete,
  Search,
  Settings,
  
  // Content organization
  Folder,
  Category,
  Label,
  Bookmark,
  Star,
  Flag,
  Archive,
  
  // Communication
  Mail,
  Message,
  Chat,
  Forum,
  Announcement,
  
  // Education & Learning
  School,
  Book,
  MenuBook,
  LocalLibrary,
  Assignment,
  
  // Business & Finance
  Business,
  Work,
  AccountBalance,
  AttachMoney,
  CreditCard,
  Receipt,
  
  // Technology
  Computer,
  Laptop,
  Smartphone,
  Code,
  Cloud,
  Storage,
  
  // People & Social
  Person,
  Group,
  People,
  Public,
  Share,
  
  // Time & Schedule
  Schedule,
  Today,
  Event,
  CalendarToday,
  
  // Location & Travel
  Place,
  LocationOn,
  Map,
  Navigation,
  Flight,
  
  // Media
  Image,
  Movie,
  MusicNote,
  Headphones,
  
  // Health & Wellness
  LocalHospital,
  Favorite,
  FitnessCenter,
  Restaurant,
  
  // Nature & Environment
  Park,
  Nature,
  WbSunny,
  
  // Shopping & Commerce
  ShoppingCart,
  Store,
  LocalMall,
  
  // Home & Living
  Home,
  House,
  Build,
  
  // Sports & Activities
  Sports,
  SportsBasketball,
  SportsFootball,
  
  // Transportation
  DirectionsCar,
  LocalTaxi,
  Train,
  
  // Security
  Security,
  Lock,
  VpnKey,
  
  // Misc
  Lightbulb,
  EmojiObjects,
  Palette,
  Brush
} from '@mui/icons-material';

export const categoryIcons = {
  // Common Actions
  Add: Add,
  Edit: Edit,
  Delete: Delete,
  Search: Search,
  Settings: Settings,

  // Content Organization
  Folder: Folder,
  Category: Category,
  Label: Label,
  Bookmark: Bookmark,
  Star: Star,
  Flag: Flag,
  Archive: Archive,

  // Communication
  Mail: Mail,
  Message: Message,
  Chat: Chat,
  Forum: Forum,
  Announcement: Announcement,

  // Education & Learning
  School: School,
  Book: Book,
  MenuBook: MenuBook,
  LocalLibrary: LocalLibrary,
  Assignment: Assignment,

  // Business & Finance
  Business: Business,
  Work: Work,
  AccountBalance: AccountBalance,
  AttachMoney: AttachMoney,
  CreditCard: CreditCard,
  Receipt: Receipt,

  // Technology
  Computer: Computer,
  Laptop: Laptop,
  Smartphone: Smartphone,
  Code: Code,
  Cloud: Cloud,
  Storage: Storage,

  // People & Social
  Person: Person,
  Group: Group,
  People: People,
  Public: Public,
  Share: Share,

  // Time & Schedule
  Schedule: Schedule,
  Today: Today,
  Event: Event,
  CalendarToday: CalendarToday,

  // Location & Travel
  Place: Place,
  LocationOn: LocationOn,
  Map: Map,
  Navigation: Navigation,
  Flight: Flight,

  // Media
  Image: Image,
  Movie: Movie,
  MusicNote: MusicNote,
  Headphones: Headphones,

  // Health & Wellness
  LocalHospital: LocalHospital,
  Favorite: Favorite,
  FitnessCenter: FitnessCenter,
  Restaurant: Restaurant,

  // Nature & Environment
  Park: Park,
  Nature: Nature,
  WbSunny: WbSunny,

  // Shopping & Commerce
  ShoppingCart: ShoppingCart,
  Store: Store,
  LocalMall: LocalMall,

  // Home & Living
  Home: Home,
  House: House,
  Build: Build,

  // Sports & Activities
  Sports: Sports,
  SportsBasketball: SportsBasketball,
  SportsFootball: SportsFootball,

  // Transportation
  DirectionsCar: DirectionsCar,
  LocalTaxi: LocalTaxi,
  Train: Train,

  // Security
  Security: Security,
  Lock: Lock,
  VpnKey: VpnKey,

  // Misc
  Lightbulb: Lightbulb,
  EmojiObjects: EmojiObjects,
  Palette: Palette,
  Brush: Brush
};

export type IconName = keyof typeof categoryIcons;