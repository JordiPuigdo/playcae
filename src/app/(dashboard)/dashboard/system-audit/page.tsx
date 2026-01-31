"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import { useAudit } from "@/hooks/useAudit";
import { DateRangePicker, DateRange } from "@/components/ui/DateRangePicker";
import {
  ClipboardList,
  Bell,
  Mail,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Building,
  Users,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  AuditActionType,
  AuditResultType,
  NotificationType,
  EmailType,
  EmailSendStatus,
} from "@/types/audit";

// ============ HELPER FUNCTIONS ============

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============ MAIN COMPONENT ============

type TabType = "auditLogs" | "documentNotifications" | "emailRegistry";

export default function SystemAuditPage() {
  const { t } = useTranslation();
  const {
    auditLogs,
    documentNotifications,
    emailRegistry,
    isLoadingAuditLogs,
    isLoadingNotifications,
    isLoadingEmails,
    fetchAuditLogs,
    fetchDocumentNotifications,
    fetchEmailRegistry,
    fetchAll,
    dateRange,
    setDateRange,
  } = useAudit();

  const [activeTab, setActiveTab] = useState<TabType>("auditLogs");
  const [searchTerm, setSearchTerm] = useState("");

  // Local date range state
  const [localDateRange, setLocalDateRange] = useState<DateRange>({
    from: dateRange.from,
    to: dateRange.to,
  });

  // Translated presets for DateRangePicker
  const datePresets = useMemo(() => {
    const today = new Date();
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return [
      {
        label: t("systemAudit.presets.today"),
        getValue: () => ({ from: formatDate(today), to: formatDate(today) }),
      },
      {
        label: t("systemAudit.presets.last7Days"),
        getValue: () => {
          const from = new Date(today);
          from.setDate(from.getDate() - 7);
          return { from: formatDate(from), to: formatDate(today) };
        },
      },
      {
        label: t("systemAudit.presets.last30Days"),
        getValue: () => {
          const from = new Date(today);
          from.setDate(from.getDate() - 30);
          return { from: formatDate(from), to: formatDate(today) };
        },
      },
      {
        label: t("systemAudit.presets.thisMonth"),
        getValue: () => {
          const from = new Date(today.getFullYear(), today.getMonth(), 1);
          return { from: formatDate(from), to: formatDate(today) };
        },
      },
      {
        label: t("systemAudit.presets.lastMonth"),
        getValue: () => {
          const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const to = new Date(today.getFullYear(), today.getMonth(), 0);
          return { from: formatDate(from), to: formatDate(to) };
        },
      },
      {
        label: t("systemAudit.presets.last3Months"),
        getValue: () => {
          const from = new Date(today);
          from.setMonth(from.getMonth() - 3);
          return { from: formatDate(from), to: formatDate(today) };
        },
      },
      {
        label: t("systemAudit.presets.thisYear"),
        getValue: () => {
          const from = new Date(today.getFullYear(), 0, 1);
          return { from: formatDate(from), to: formatDate(today) };
        },
      },
    ];
  }, [t]);

  // Filters for each tab
  const [auditActionFilter, setAuditActionFilter] = useState<string>("all");
  const [auditResultFilter, setAuditResultFilter] = useState<string>("all");
  const [notificationTypeFilter, setNotificationTypeFilter] = useState<string>("all");
  const [emailStatusFilter, setEmailStatusFilter] = useState<string>("all");

  // Pagination
  const ITEMS_PER_PAGE = 15;
  const [auditLogsPage, setAuditLogsPage] = useState(1);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [emailsPage, setEmailsPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setAuditLogsPage(1);
  }, [searchTerm, auditActionFilter, auditResultFilter]);

  useEffect(() => {
    setNotificationsPage(1);
  }, [searchTerm, notificationTypeFilter]);

  useEffect(() => {
    setEmailsPage(1);
  }, [searchTerm, emailStatusFilter]);

  // Initial load
  useEffect(() => {
    fetchAll();
  }, []);

  // Handle date range apply from DateRangePicker
  const handleApplyDateRange = (range: DateRange) => {
    setLocalDateRange(range);
    setDateRange(range.from, range.to);
    fetchAll({ from: range.from, to: range.to });
  };

  // Handle refresh
  const handleRefresh = () => {
    switch (activeTab) {
      case "auditLogs":
        fetchAuditLogs();
        break;
      case "documentNotifications":
        fetchDocumentNotifications();
        break;
      case "emailRegistry":
        fetchEmailRegistry();
        break;
    }
  };

  const isLoading = isLoadingAuditLogs || isLoadingNotifications || isLoadingEmails;

  const tabs = [
    {
      id: "auditLogs" as TabType,
      label: t("systemAudit.tabs.auditLogs"),
      icon: ClipboardList,
      count: auditLogs.length,
      loading: isLoadingAuditLogs,
    },
    {
      id: "documentNotifications" as TabType,
      label: t("systemAudit.tabs.documentNotifications"),
      icon: Bell,
      count: documentNotifications.length,
      loading: isLoadingNotifications,
    },
    {
      id: "emailRegistry" as TabType,
      label: t("systemAudit.tabs.emailRegistry"),
      icon: Mail,
      count: emailRegistry.length,
      loading: isLoadingEmails,
    },
  ];

  // ============ AUDIT LOGS HELPERS ============

  const getActionTypeLabel = (actionType: AuditActionType): string => {
    const labels: Record<AuditActionType, string> = {
      [AuditActionType.Create]: t("systemAudit.actions.create"),
      [AuditActionType.Update]: t("systemAudit.actions.update"),
      [AuditActionType.Delete]: t("systemAudit.actions.delete"),
      [AuditActionType.Login]: t("systemAudit.actions.login"),
      [AuditActionType.Logout]: t("systemAudit.actions.logout"),
      [AuditActionType.Upload]: t("systemAudit.actions.upload"),
      [AuditActionType.Download]: t("systemAudit.actions.download"),
      [AuditActionType.Validate]: t("systemAudit.actions.validate"),
      [AuditActionType.Reject]: t("systemAudit.actions.reject"),
      [AuditActionType.Export]: t("systemAudit.actions.export"),
      [AuditActionType.Import]: t("systemAudit.actions.import"),
      [AuditActionType.SendEmail]: t("systemAudit.actions.sendEmail"),
      [AuditActionType.ChangeStatus]: t("systemAudit.actions.changeStatus"),
      [AuditActionType.AccessGranted]: t("systemAudit.actions.accessGranted"),
      [AuditActionType.AccessDenied]: t("systemAudit.actions.accessDenied"),
    };
    return labels[actionType] || String(actionType);
  };

  const getActionTypeBadgeColor = (actionType: AuditActionType): string => {
    const colors: Record<AuditActionType, string> = {
      [AuditActionType.Create]: "bg-green-100 text-green-800",
      [AuditActionType.Update]: "bg-blue-100 text-blue-800",
      [AuditActionType.Delete]: "bg-red-100 text-red-800",
      [AuditActionType.Login]: "bg-purple-100 text-purple-800",
      [AuditActionType.Logout]: "bg-gray-100 text-gray-800",
      [AuditActionType.Upload]: "bg-cyan-100 text-cyan-800",
      [AuditActionType.Download]: "bg-indigo-100 text-indigo-800",
      [AuditActionType.Validate]: "bg-emerald-100 text-emerald-800",
      [AuditActionType.Reject]: "bg-orange-100 text-orange-800",
      [AuditActionType.Export]: "bg-teal-100 text-teal-800",
      [AuditActionType.Import]: "bg-lime-100 text-lime-800",
      [AuditActionType.SendEmail]: "bg-sky-100 text-sky-800",
      [AuditActionType.ChangeStatus]: "bg-amber-100 text-amber-800",
      [AuditActionType.AccessGranted]: "bg-green-100 text-green-800",
      [AuditActionType.AccessDenied]: "bg-red-100 text-red-800",
    };
    return colors[actionType] || "bg-gray-100 text-gray-800";
  };

  const getResultBadge = (result: AuditResultType) => {
    switch (result) {
      case AuditResultType.Success:
        return (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            {t("systemAudit.results.success")}
          </Badge>
        );
      case AuditResultType.Failure:
        return (
          <Badge className="bg-red-100 text-red-800 gap-1">
            <XCircle className="h-3 w-3" />
            {t("systemAudit.results.failure")}
          </Badge>
        );
      case AuditResultType.PartialSuccess:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
            <AlertTriangle className="h-3 w-3" />
            {t("systemAudit.results.partial")}
          </Badge>
        );
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "Company":
        return <Building className="h-4 w-4 text-playBlueLight" />;
      case "Worker":
        return <Users className="h-4 w-4 text-playBlueLight" />;
      case "Document":
        return <FileText className="h-4 w-4 text-playBlueLight" />;
      case "User":
        return <User className="h-4 w-4 text-playBlueLight" />;
      default:
        return <ClipboardList className="h-4 w-4 text-playBlueLight" />;
    }
  };

  // ============ NOTIFICATION HELPERS ============

  const getNotificationTypeBadge = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SevenDaysWarning:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="h-3 w-3" />
            {t("systemAudit.notificationTypes.sevenDays")}
          </Badge>
        );
      case NotificationType.Expired:
        return (
          <Badge className="bg-red-100 text-red-800 gap-1">
            <AlertTriangle className="h-3 w-3" />
            {t("systemAudit.notificationTypes.expired")}
          </Badge>
        );
    }
  };

  // ============ EMAIL HELPERS ============

  const getEmailTypeLabel = (emailType: EmailType): string => {
    const labels: Record<EmailType, string> = {
      [EmailType.Welcome]: t("systemAudit.emailTypes.welcome"),
      [EmailType.PasswordReset]: t("systemAudit.emailTypes.passwordReset"),
      [EmailType.DocumentExpiring]: t("systemAudit.emailTypes.documentExpiring"),
      [EmailType.DocumentExpired]: t("systemAudit.emailTypes.documentExpired"),
      [EmailType.DocumentValidated]: t("systemAudit.emailTypes.documentValidated"),
      [EmailType.DocumentRejected]: t("systemAudit.emailTypes.documentRejected"),
      [EmailType.AccessGranted]: t("systemAudit.emailTypes.accessGranted"),
      [EmailType.AccessDenied]: t("systemAudit.emailTypes.accessDenied"),
      [EmailType.Notification]: t("systemAudit.emailTypes.notification"),
    };
    return labels[emailType] || String(emailType);
  };

  const getEmailStatusBadge = (status: EmailSendStatus) => {
    switch (status) {
      case EmailSendStatus.Sent:
        return (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            {t("systemAudit.emailStatus.sent")}
          </Badge>
        );
      case EmailSendStatus.Failed:
        return (
          <Badge className="bg-red-100 text-red-800 gap-1">
            <XCircle className="h-3 w-3" />
            {t("systemAudit.emailStatus.failed")}
          </Badge>
        );
      case EmailSendStatus.Pending:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="h-3 w-3" />
            {t("systemAudit.emailStatus.pending")}
          </Badge>
        );
      case EmailSendStatus.Retrying:
        return (
          <Badge className="bg-blue-100 text-blue-800 gap-1">
            <RefreshCw className="h-3 w-3" />
            {t("systemAudit.emailStatus.retrying")}
          </Badge>
        );
    }
  };

  // ============ FILTERED DATA ============

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        !searchTerm ||
        log.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction =
        auditActionFilter === "all" ||
        log.actionType === parseInt(auditActionFilter);

      const matchesResult =
        auditResultFilter === "all" ||
        log.result === parseInt(auditResultFilter);

      return matchesSearch && matchesAction && matchesResult;
    });
  }, [auditLogs, searchTerm, auditActionFilter, auditResultFilter]);

  const filteredNotifications = useMemo(() => {
    return documentNotifications.filter((notification) => {
      const matchesSearch =
        !searchTerm ||
        notification.documentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        notificationTypeFilter === "all" ||
        notification.notificationType === parseInt(notificationTypeFilter);

      return matchesSearch && matchesType;
    });
  }, [documentNotifications, searchTerm, notificationTypeFilter]);

  const filteredEmails = useMemo(() => {
    return emailRegistry.filter((email) => {
      const matchesSearch =
        !searchTerm ||
        email.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        emailStatusFilter === "all" ||
        email.status === parseInt(emailStatusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [emailRegistry, searchTerm, emailStatusFilter]);

  // ============ PAGINATED DATA ============

  const paginatedAuditLogs = useMemo(() => {
    const startIndex = (auditLogsPage - 1) * ITEMS_PER_PAGE;
    return filteredAuditLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAuditLogs, auditLogsPage]);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (notificationsPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotifications, notificationsPage]);

  const paginatedEmails = useMemo(() => {
    const startIndex = (emailsPage - 1) * ITEMS_PER_PAGE;
    return filteredEmails.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmails, emailsPage]);

  // ============ PAGINATION HELPERS ============

  const getTotalPages = (totalItems: number) => Math.ceil(totalItems / ITEMS_PER_PAGE);

  const renderPagination = (
    currentPage: number,
    totalItems: number,
    setPage: (page: number) => void
  ) => {
    const totalPages = getTotalPages(totalItems);
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    // Generate page numbers to show
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages + 2) {
        // Show all pages if there are few
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
        
        if (currentPage > 3) {
          pages.push("...");
        }
        
        // Show pages around current
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        if (currentPage < totalPages - 2) {
          pages.push("...");
        }
        
        // Always show last page
        pages.push(totalPages);
      }
      
      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-playBlueLight/20">
        <div className="text-sm text-playBlueLight">
          {t("common.showing")} <span className="font-medium text-brand-primary">{startItem}</span> - <span className="font-medium text-brand-primary">{endItem}</span> {t("common.of")} <span className="font-medium text-brand-primary">{totalItems}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 border-playBlueLight/50 hover:bg-playGrey disabled:opacity-40"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 border-playBlueLight/50 hover:bg-playGrey disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Page numbers */}
          <div className="flex items-center gap-1 mx-1">
            {getPageNumbers().map((page, index) => (
              typeof page === "string" ? (
                <span key={`ellipsis-${index}`} className="px-2 text-playBlueLight">
                  {page}
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(page)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === page
                      ? "bg-playOrange hover:bg-playOrange/90 text-white border-playOrange"
                      : "border-playBlueLight/50 hover:bg-playGrey text-brand-primary"
                  }`}
                >
                  {page}
                </Button>
              )
            ))}
          </div>
          
          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 border-playBlueLight/50 hover:bg-playGrey disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 border-playBlueLight/50 hover:bg-playGrey disabled:opacity-40"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ============ RENDER ============

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">
            {t("systemAudit.title")}
          </h1>
          <p className="text-playBlueLight mt-1">
            {t("systemAudit.description")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {t("common.refresh")}
        </Button>
      </div>

      {/* Date Range Filter */}
      <DateRangePicker
        value={localDateRange}
        onChange={setLocalDateRange}
        onApply={handleApplyDateRange}
        presets={datePresets}
        disabled={isLoading}
        labels={{
          from: t("systemAudit.dateFrom"),
          to: t("systemAudit.dateTo"),
          apply: t("systemAudit.applyFilter"),
          clear: t("common.clear"),
          presets: t("systemAudit.dateRange"),
        }}
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-playBlueLight/30 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                isActive
                  ? "bg-playOrange text-white"
                  : "text-brand-primary hover:bg-playGrey"
              }`}
            >
              {tab.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              {tab.label}
              <Badge
                variant="secondary"
                className={`ml-1 ${
                  isActive ? "bg-white/20 text-white" : "bg-playGrey"
                }`}
              >
                {tab.count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-white border border-playBlueLight/30">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
              <Input
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-playBlueLight/50 focus:border-playOrange"
              />
            </div>

            {/* Tab-specific filters */}
            {activeTab === "auditLogs" && (
              <>
                <Select value={auditActionFilter} onValueChange={setAuditActionFilter}>
                  <SelectTrigger className="w-[180px] border-playBlueLight/50">
                    <Filter className="h-4 w-4 mr-2 text-playBlueLight" />
                    <SelectValue placeholder={t("systemAudit.filters.action")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value={String(AuditActionType.Create)}>
                      {t("systemAudit.actions.create")}
                    </SelectItem>
                    <SelectItem value={String(AuditActionType.Update)}>
                      {t("systemAudit.actions.update")}
                    </SelectItem>
                    <SelectItem value={String(AuditActionType.Delete)}>
                      {t("systemAudit.actions.delete")}
                    </SelectItem>
                    <SelectItem value={String(AuditActionType.Login)}>
                      {t("systemAudit.actions.login")}
                    </SelectItem>
                    <SelectItem value={String(AuditActionType.Upload)}>
                      {t("systemAudit.actions.upload")}
                    </SelectItem>
                    <SelectItem value={String(AuditActionType.Validate)}>
                      {t("systemAudit.actions.validate")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={auditResultFilter} onValueChange={setAuditResultFilter}>
                  <SelectTrigger className="w-[150px] border-playBlueLight/50">
                    <SelectValue placeholder={t("systemAudit.filters.result")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value={String(AuditResultType.Success)}>
                      {t("systemAudit.results.success")}
                    </SelectItem>
                    <SelectItem value={String(AuditResultType.Failure)}>
                      {t("systemAudit.results.failure")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {activeTab === "documentNotifications" && (
              <Select
                value={notificationTypeFilter}
                onValueChange={setNotificationTypeFilter}
              >
                <SelectTrigger className="w-[200px] border-playBlueLight/50">
                  <Filter className="h-4 w-4 mr-2 text-playBlueLight" />
                  <SelectValue placeholder={t("systemAudit.filters.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  <SelectItem value={String(NotificationType.SevenDaysWarning)}>
                    {t("systemAudit.notificationTypes.sevenDays")}
                  </SelectItem>
                  <SelectItem value={String(NotificationType.Expired)}>
                    {t("systemAudit.notificationTypes.expired")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}

            {activeTab === "emailRegistry" && (
              <Select value={emailStatusFilter} onValueChange={setEmailStatusFilter}>
                <SelectTrigger className="w-[150px] border-playBlueLight/50">
                  <Filter className="h-4 w-4 mr-2 text-playBlueLight" />
                  <SelectValue placeholder={t("common.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  <SelectItem value={String(EmailSendStatus.Sent)}>
                    {t("systemAudit.emailStatus.sent")}
                  </SelectItem>
                  <SelectItem value={String(EmailSendStatus.Failed)}>
                    {t("systemAudit.emailStatus.failed")}
                  </SelectItem>
                  <SelectItem value={String(EmailSendStatus.Pending)}>
                    {t("systemAudit.emailStatus.pending")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table Content */}
      <Card className="bg-white border border-playBlueLight/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-primary">
            {activeTab === "auditLogs" && (
              <>
                <ClipboardList className="h-5 w-5" />
                {t("systemAudit.tabs.auditLogs")}
              </>
            )}
            {activeTab === "documentNotifications" && (
              <>
                <Bell className="h-5 w-5" />
                {t("systemAudit.tabs.documentNotifications")}
              </>
            )}
            {activeTab === "emailRegistry" && (
              <>
                <Mail className="h-5 w-5" />
                {t("systemAudit.tabs.emailRegistry")}
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            {/* Audit Logs Table */}
            {activeTab === "auditLogs" && (
              <>
                {isLoadingAuditLogs ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-playOrange" />
                  </div>
                ) : filteredAuditLogs.length === 0 ? (
                  <div className="text-center py-12 text-playBlueLight">
                    {t("systemAudit.noData")}
                  </div>
                ) : (
                  <>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-playGrey">
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.timestamp")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.user")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.action")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.entity")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.result")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.ip")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAuditLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-playGrey/30">
                          <TableCell className="text-brand-primary whitespace-nowrap">
                            {formatDate(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-playBlueLight" />
                              <span className="text-brand-primary">
                                {log.userName || t("systemAudit.system")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getActionTypeBadgeColor(log.actionType)}>
                              {getActionTypeLabel(log.actionType)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEntityIcon(log.entityType)}
                              <div>
                                <div className="font-medium text-brand-primary">
                                  {log.entityName || "-"}
                                </div>
                                <div className="text-xs text-playBlueLight">
                                  {log.entityType}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {getResultBadge(log.result)}
                              {log.errorMessage && (
                                <div className="text-xs text-red-500 mt-1">
                                  {log.errorMessage}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-brand-primary font-mono text-sm">
                            {log.ipAddress || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(auditLogsPage, filteredAuditLogs.length, setAuditLogsPage)}
                  </>
                )}
              </>
            )}

            {/* Document Notifications Table */}
            {activeTab === "documentNotifications" && (
              <>
                {isLoadingNotifications ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-playOrange" />
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 text-playBlueLight">
                    {t("systemAudit.noData")}
                  </div>
                ) : (
                  <>
                    <Table>
                    <TableHeader>
                      <TableRow className="bg-playGrey">
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.sentDate")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.document")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.type")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.recipient")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("common.status")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedNotifications.map((notification) => (
                        <TableRow key={notification.id} className="hover:bg-playGrey/30">
                          <TableCell className="text-brand-primary whitespace-nowrap">
                            {formatDate(notification.sentDate)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-playBlueLight" />
                              <span className="text-brand-primary">
                                {notification.documentName || "-"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getNotificationTypeBadge(notification.notificationType)}
                          </TableCell>
                          <TableCell className="text-brand-primary">
                            {notification.recipientEmail || "-"}
                          </TableCell>
                          <TableCell>
                            <div>
                              {notification.emailSent ? (
                                <Badge className="bg-green-100 text-green-800 gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  {t("systemAudit.emailStatus.sent")}
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 gap-1">
                                  <XCircle className="h-3 w-3" />
                                  {t("systemAudit.emailStatus.failed")}
                                </Badge>
                              )}
                              {notification.errorMessage && (
                                <div className="text-xs text-red-500 mt-1">
                                  {notification.errorMessage}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(notificationsPage, filteredNotifications.length, setNotificationsPage)}
                  </>
                )}
              </>
            )}

            {/* Email Registry Table */}
            {activeTab === "emailRegistry" && (
              <>
                {isLoadingEmails ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-playOrange" />
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="text-center py-12 text-playBlueLight">
                    {t("systemAudit.noData")}
                  </div>
                ) : (
                  <>
                    <Table>
                    <TableHeader>
                      <TableRow className="bg-playGrey">
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.sentDate")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.emailType")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.recipient")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.subject")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("common.status")}
                        </TableHead>
                        <TableHead className="text-brand-primary">
                          {t("systemAudit.columns.retries")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEmails.map((email) => (
                        <TableRow key={email.id} className="hover:bg-playGrey/30">
                          <TableCell className="text-brand-primary whitespace-nowrap">
                            {formatDate(email.sentAt)}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              {getEmailTypeLabel(email.emailType)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-brand-primary">
                                {email.recipientName || "-"}
                              </div>
                              <div className="text-xs text-playBlueLight">
                                {email.recipientEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-brand-primary max-w-[300px] truncate">
                            {email.subject || "-"}
                          </TableCell>
                          <TableCell>
                            <div>
                              {getEmailStatusBadge(email.status)}
                              {email.errorMessage && (
                                <div className="text-xs text-red-500 mt-1">
                                  {email.errorMessage}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-brand-primary">
                            {email.retryCount > 0 ? (
                              <Badge variant="secondary" className="bg-playGrey">
                                {email.retryCount}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {renderPagination(emailsPage, filteredEmails.length, setEmailsPage)}
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
