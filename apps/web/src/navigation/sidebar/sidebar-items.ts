import {
  Calendar,
  Fingerprint,
  Kanban,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

export type NavBadge = "new" | "soon";

interface NavSubItem {
  id: string;
  title: string;
  titleKey?: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  titleKey?: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  labelKey?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Apps",
    items: [
      {
        id: "email",
        title: "Email",
        titleKey: "titleEmail",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "chat",
        title: "Chat",
        titleKey: "titleChat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        id: "calendar",
        title: "Calendar",
        titleKey: "titleCalendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        id: "kanban",
        title: "Kanban",
        titleKey: "titleKanban",
        url: "/dashboard/kanban",
        icon: Kanban,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        id: "profile",
        title: "Profile",
        titleKey: "titleProfile",
        url: "/dashboard/profile",
        icon: UserRound,
      },
      {
        id: "users",
        title: "Users",
        titleKey: "titleUsers",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "roles",
        title: "Roles",
        titleKey: "titleRoles",
        url: "/dashboard/roles",
        icon: Lock,
      },
      {
        id: "authentication",
        title: "Authentication",
        titleKey: "titleAuthentication",
        icon: Fingerprint,
        subItems: [
          { id: "auth-login-v2", title: "Login v2", titleKey: "titleLoginV2", url: "/auth/v2/login" },
          {
            id: "auth-register-v2",
            title: "Register v2",
            titleKey: "titleRegisterV2",
            url: "/auth/v2/register",
          },
        ],
      },
      {
        id: "settings",
        title: "Configurações",
        titleKey: "titleSettings",
        icon: Settings,
        subItems: [
          { id: "settings-general", title: "Geral", titleKey: "titleGeneral", url: "/dashboard/settings/general" },
          {
            id: "settings-shortcuts",
            title: "Atalhos",
            titleKey: "titleShortcuts",
            url: "/dashboard/settings/shortcuts",
          },
          {
            id: "settings-servers",
            title: "Servidores",
            titleKey: "titleServers",
            url: "/dashboard/settings/servers",
          },
          {
            id: "settings-providers",
            title: "Provedores",
            titleKey: "titleProviders",
            url: "/dashboard/settings/providers",
          },
          {
            id: "settings-models",
            title: "Modelos",
            titleKey: "titleModels",
            url: "/dashboard/settings/models",
          },
        ],
      },
    ],
  },
];
