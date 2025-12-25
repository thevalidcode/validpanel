import {
  Crown,
  Users,
  ShoppingCart,
  CreditCard,
  FileText,
  Settings,
  BarChart3,
  Mail,
  Phone,
  Shield,
  Key,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Star,
  Heart,
  Zap,
  Globe,
  Home,
  Package,
  Truck,
  DollarSign,
  Calendar,
  Clock,
  Bell,
  Search,
  Filter,
  SortAsc,
  Download,
  Upload,
  Share,
  Lock,
  Unlock,
  Image,
  Video,
  Music,
  Server,
  Database,
  Code,
  Terminal,
  GitBranch,
} from "lucide-react";
import { type ReactElement } from "react";

export function getPermissionIcon(permissionName: string): ReactElement {
  const name = permissionName.toUpperCase();

  // Special case for ALL_ACCESS
  if (name === "ALL_ACCESS" || name === "ALL ACCESS") {
    return <Crown className="w-5 h-5 text-yellow-600" />;
  }

  // Extract the main word after underscore or use the whole name
  const parts = name.split("_");
  const keyWord = parts.length > 1 ? parts[1] : parts[0];

  switch (keyWord) {
    case "USERS":
    case "USER":
      return <Users className="w-5 h-5 text-blue-600" />;
    case "ORDERS":
    case "ORDER":
      return <ShoppingCart className="w-5 h-5 text-green-600" />;
    case "PAYMENTS":
    case "PAYMENT":
      return <CreditCard className="w-5 h-5 text-purple-600" />;
    case "SUBSCRIPTIONS":
    case "SUBSCRIPTION":
      return <Star className="w-5 h-5 text-orange-600" />;
    case "STORES":
    case "STORE":
      return <Home className="w-5 h-5 text-indigo-600" />;
    case "PRODUCTS":
    case "PRODUCT":
      return <Package className="w-5 h-5 text-teal-600" />;
    case "CATEGORIES":
    case "CATEGORY":
      return <FileText className="w-5 h-5 text-cyan-600" />;
    case "NOTIFICATIONS":
    case "NOTIFICATION":
      return <Bell className="w-5 h-5 text-red-600" />;
    case "EMAILS":
    case "EMAIL":
      return <Mail className="w-5 h-5 text-pink-600" />;
    case "CONTACTS":
    case "CONTACT":
      return <Phone className="w-5 h-5 text-emerald-600" />;
    case "ANALYTICS":
    case "ANALYTIC":
      return <BarChart3 className="w-5 h-5 text-violet-600" />;
    case "SETTINGS":
    case "SETTING":
      return <Settings className="w-5 h-5 text-gray-600" />;
    case "ROLES":
    case "ROLE":
      return <Shield className="w-5 h-5 text-slate-600" />;
    case "PERMISSIONS":
    case "PERMISSION":
      return <Key className="w-5 h-5 text-amber-600" />;
    case "VIEW":
      return <Eye className="w-5 h-5 text-blue-500" />;
    case "EDIT":
      return <Edit className="w-5 h-5 text-orange-500" />;
    case "DELETE":
      return <Trash2 className="w-5 h-5 text-red-500" />;
    case "CREATE":
      return <Plus className="w-5 h-5 text-green-500" />;
    case "UPDATE":
      return <Edit className="w-5 h-5 text-yellow-500" />;
    case "APPROVE":
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case "REJECT":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "BAN":
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case "SUPPORT":
      return <HelpCircle className="w-5 h-5 text-blue-600" />;
    case "FAVORITES":
    case "FAVORITE":
      return <Heart className="w-5 h-5 text-pink-500" />;
    case "FEATURES":
    case "FEATURE":
      return <Zap className="w-5 h-5 text-yellow-600" />;
    case "GLOBAL":
      return <Globe className="w-5 h-5 text-blue-700" />;
    case "DELIVERY":
      return <Truck className="w-5 h-5 text-orange-600" />;
    case "FINANCE":
    case "FINANCIAL":
      return <DollarSign className="w-5 h-5 text-green-700" />;
    case "SCHEDULE":
    case "SCHEDULER":
      return <Calendar className="w-5 h-5 text-purple-700" />;
    case "TIME":
      return <Clock className="w-5 h-5 text-gray-700" />;
    case "SEARCH":
      return <Search className="w-5 h-5 text-indigo-600" />;
    case "FILTER":
      return <Filter className="w-5 h-5 text-teal-600" />;
    case "SORT":
      return <SortAsc className="w-5 h-5 text-cyan-600" />;
    case "DOWNLOAD":
      return <Download className="w-5 h-5 text-blue-600" />;
    case "UPLOAD":
      return <Upload className="w-5 h-5 text-green-600" />;
    case "SHARE":
      return <Share className="w-5 h-5 text-purple-600" />;
    case "LOCK":
      return <Lock className="w-5 h-5 text-red-700" />;
    case "UNLOCK":
      return <Unlock className="w-5 h-5 text-green-700" />;
    case "MEDIA":
      return <Image className="w-5 h-5 text-pink-600" />;
    case "IMAGES":
    case "IMAGE":
      return <Image className="w-5 h-5 text-pink-600" />;
    case "VIDEOS":
    case "VIDEO":
      return <Video className="w-5 h-5 text-red-600" />;
    case "AUDIO":
      return <Music className="w-5 h-5 text-purple-600" />;
    case "SYSTEM":
      return <Server className="w-5 h-5 text-gray-700" />;
    case "DATABASE":
    case "DATA":
      return <Database className="w-5 h-5 text-blue-700" />;
    case "CODE":
      return <Code className="w-5 h-5 text-green-700" />;
    case "TERMINAL":
      return <Terminal className="w-5 h-5 text-black" />;
    case "GIT":
      return <GitBranch className="w-5 h-5 text-orange-700" />;
    case "POWER":
      return <Zap className="w-5 h-5 text-yellow-500" />;
    default:
      return <Key className="w-5 h-5 text-gray-500" />;
  }
}