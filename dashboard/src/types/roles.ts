/**
 * User Role Definitions
 * Defines all roles and their planned permissions (enforced in Phase 9).
 */

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SALES: 'sales',
  SUPPORT: 'support',
  VIEWER: 'viewer',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SALES]: 'Sales',
  [UserRole.SUPPORT]: 'Support',
  [UserRole.VIEWER]: 'Viewer',
};

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '#EF4444',
  [UserRole.ADMIN]: '#F59E0B',
  [UserRole.SALES]: '#3B82F6',
  [UserRole.SUPPORT]: '#10B981',
  [UserRole.VIEWER]: '#6B7280',
};

export interface RolePermissions {
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewLeads: boolean;
  canEditLeads: boolean;
  canDeleteLeads: boolean;
  canViewAppointments: boolean;
  canManageAppointments: boolean;
  canViewAnalytics: boolean;
  canManageCampaigns: boolean;
  canViewCallHistory: boolean;
}

/**
 * Permission matrix — NOT enforced yet, just defined for Phase 9.
 */
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  [UserRole.SUPER_ADMIN]: {
    canManageUsers: true,
    canManageSettings: true,
    canViewLeads: true,
    canEditLeads: true,
    canDeleteLeads: true,
    canViewAppointments: true,
    canManageAppointments: true,
    canViewAnalytics: true,
    canManageCampaigns: true,
    canViewCallHistory: true,
  },
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageSettings: true,
    canViewLeads: true,
    canEditLeads: true,
    canDeleteLeads: true,
    canViewAppointments: true,
    canManageAppointments: true,
    canViewAnalytics: true,
    canManageCampaigns: true,
    canViewCallHistory: true,
  },
  [UserRole.SALES]: {
    canManageUsers: false,
    canManageSettings: false,
    canViewLeads: true,
    canEditLeads: true,
    canDeleteLeads: false,
    canViewAppointments: true,
    canManageAppointments: true,
    canViewAnalytics: true,
    canManageCampaigns: false,
    canViewCallHistory: true,
  },
  [UserRole.SUPPORT]: {
    canManageUsers: false,
    canManageSettings: false,
    canViewLeads: true,
    canEditLeads: true,
    canDeleteLeads: false,
    canViewAppointments: true,
    canManageAppointments: false,
    canViewAnalytics: false,
    canManageCampaigns: false,
    canViewCallHistory: true,
  },
  [UserRole.VIEWER]: {
    canManageUsers: false,
    canManageSettings: false,
    canViewLeads: true,
    canEditLeads: false,
    canDeleteLeads: false,
    canViewAppointments: true,
    canManageAppointments: false,
    canViewAnalytics: true,
    canManageCampaigns: false,
    canViewCallHistory: true,
  },
};
