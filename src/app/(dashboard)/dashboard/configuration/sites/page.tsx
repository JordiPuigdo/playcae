"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useAuthStore } from "@/hooks/useAuthStore";
import { CompanyService } from "@/services/companies.service";
import { CompanySiteAssignmentsService } from "@/services/company-site-assignments.service";
import { HttpClient } from "@/services/http-client";
import { SitesService } from "@/services/sites.service";
import { UserSitePermissionsService } from "@/services/user-site-permissions.service";
import { UserService } from "@/services/user.services";
import { Company } from "@/types/company";
import { CompanySiteAssignment } from "@/types/companySiteAssignment";
import { Site } from "@/types/site";
import { UserRole } from "@/types/user";
import { UserManagementItem, UserSitePermission } from "@/types/userSitePermission";

const roleLabel = (role: number) => {
  if (role === UserRole.SuperAdmin) return "SuperAdmin";
  if (role === UserRole.Admin) return "Admin";
  if (role === UserRole.Company) return "Company";
  if (role === UserRole.Supplier) return "Supplier";
  if (role === UserRole.PRLManager) return "PRLManager";
  return "Other";
};

const getMainCompanyId = (companies: Company[]): string | null => {
  if (!companies.length) return null;

  const mainByFlag = companies.find((c) => (c as Company & { isMainCompany?: boolean }).isMainCompany);
  if (mainByFlag?.id) return mainByFlag.id;

  const mainByParent = companies.find((c) => !c.parentCompanyId);
  if (mainByParent?.id) return mainByParent.id;

  return companies[0].id || null;
};

export default function ConfigurationSitesPage() {
  const { user } = useAuthStore();

  const httpClient = useMemo(() => new HttpClient(), []);
  const sitesService = useMemo(() => new SitesService(httpClient), [httpClient]);
  const companyService = useMemo(() => new CompanyService(httpClient), [httpClient]);
  const assignmentService = useMemo(
    () => new CompanySiteAssignmentsService(httpClient),
    [httpClient]
  );
  const permissionService = useMemo(
    () => new UserSitePermissionsService(httpClient),
    [httpClient]
  );
  const userService = useMemo(() => new UserService(), []);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [adminCompanyId, setAdminCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [assignments, setAssignments] = useState<CompanySiteAssignment[]>([]);
  const [permissions, setPermissions] = useState<UserSitePermission[]>([]);

  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteAddress, setNewSiteAddress] = useState("");
  const [editSiteId, setEditSiteId] = useState<string | null>(null);
  const [editSiteName, setEditSiteName] = useState("");
  const [editSiteAddress, setEditSiteAddress] = useState("");

  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState("");
  const [selectedAssignmentCompanyIds, setSelectedAssignmentCompanyIds] = useState<string[]>([]);
  const [permissionUserId, setPermissionUserId] = useState<string>("");
  const [permissionRole, setPermissionRole] = useState("PRLManager");
  const [newPrlEmail, setNewPrlEmail] = useState("");
  const [newPrlPassword, setNewPrlPassword] = useState("");

  const isAdmin = user?.role === UserRole.Admin || user?.role === UserRole.SuperAdmin;

  const relatedCompanies = useMemo(() => {
    return companies.filter((c) => c.id && c.id !== adminCompanyId);
  }, [companies, adminCompanyId]);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId) || null,
    [sites, selectedSiteId]
  );
  const assignedCompanyIds = useMemo(
    () =>
      new Set(
        assignments
          .map((assignment) => assignment.companyId)
          .filter((companyId): companyId is string => !!companyId)
      ),
    [assignments]
  );
  const availableAssignmentCompanies = useMemo(
    () =>
      relatedCompanies.filter(
        (company) => !!company.id && !assignedCompanyIds.has(company.id as string)
      ),
    [relatedCompanies, assignedCompanyIds]
  );
  const filteredAssignmentCompanies = useMemo(() => {
    const term = assignmentSearchTerm.trim().toLowerCase();
    if (!term) return availableAssignmentCompanies;

    return availableAssignmentCompanies.filter((company) =>
      (company.name || "").toLowerCase().includes(term)
    );
  }, [availableAssignmentCompanies, assignmentSearchTerm]);
  const allFilteredSelected = useMemo(
    () =>
      filteredAssignmentCompanies.length > 0 &&
      filteredAssignmentCompanies.every(
        (company) => !!company.id && selectedAssignmentCompanyIds.includes(company.id)
      ),
    [filteredAssignmentCompanies, selectedAssignmentCompanyIds]
  );

  const refreshSiteScopedData = useCallback(
    async (siteId: string) => {
      const [assignmentResponse, permissionResponse] = await Promise.all([
        assignmentService.getBySiteId(siteId),
        permissionService.getBySiteId(siteId),
      ]);

      setAssignments(assignmentResponse.data || []);
      setPermissions(permissionResponse.data || []);
    },
    [assignmentService, permissionService]
  );

  const refreshSites = useCallback(
    async (companyId: string) => {
      const response = await sitesService.getByCompanyId(companyId);
      const nextSites = (response.data || []).filter((s) => !!s.id);
      setSites(nextSites);

      setSelectedSiteId((prev) => {
        if (prev && nextSites.some((s) => s.id === prev)) return prev;
        return nextSites[0]?.id || "";
      });
    },
    [sitesService]
  );

  const loadInitialData = useCallback(async () => {
    if (!user?.userId || !isAdmin) return;

    setIsLoading(true);
    setError(null);

    try {
      const [companyResponse, usersResponse] = await Promise.all([
        companyService.getByUserId(user.userId),
        userService.getPrlByAdmin(user.userId),
      ]);

      const companyRows = companyResponse.data || [];
      const adminMainCompanyId = getMainCompanyId(companyRows);

      setCompanies(companyRows);
      setUsers(usersResponse.data || []);
      setAdminCompanyId(adminMainCompanyId);

      if (!adminMainCompanyId) {
        setSites([]);
        setSelectedSiteId("");
        return;
      }

      await refreshSites(adminMainCompanyId);
    } catch (e) {
      setError("No se pudo cargar la configuracion de sedes.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, isAdmin, companyService, userService, refreshSites]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAdmin) return;
    void loadInitialData();
  }, [mounted, isAdmin, loadInitialData]);

  useEffect(() => {
    if (!selectedSiteId) {
      setAssignments([]);
      setPermissions([]);
      return;
    }
    void refreshSiteScopedData(selectedSiteId);
  }, [selectedSiteId, refreshSiteScopedData]);

  useEffect(() => {
    setSelectedAssignmentCompanyIds((prev) =>
      prev.filter((companyId) =>
        availableAssignmentCompanies.some((company) => company.id === companyId)
      )
    );
  }, [availableAssignmentCompanies]);

  useEffect(() => {
    if (users.length === 0) {
      setPermissionUserId("");
      return;
    }

    if (!permissionUserId) {
      setPermissionUserId(users[0].id || "");
    }
  }, [permissionUserId, users]);

  const handleCreateSite = async () => {
    if (!adminCompanyId || !newSiteName.trim()) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await sitesService.create({
        name: newSiteName.trim(),
        address: newSiteAddress.trim() || null,
        companyId: adminCompanyId,
        isDefault: false,
      });

      setNewSiteName("");
      setNewSiteAddress("");
      setSuccess("Sede creada correctamente.");
      await refreshSites(adminCompanyId);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo crear la sede.");
    } finally {
      setIsBusy(false);
    }
  };

  const startEditSite = (site: Site) => {
    setEditSiteId(site.id || null);
    setEditSiteName(site.name);
    setEditSiteAddress(site.address || "");
  };

  const handleSaveSite = async () => {
    if (!editSiteId || !editSiteName.trim() || !adminCompanyId) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await sitesService.update(editSiteId, {
        name: editSiteName.trim(),
        address: editSiteAddress.trim() || null,
      });
      setEditSiteId(null);
      setSuccess("Sede actualizada correctamente.");
      await refreshSites(adminCompanyId);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo actualizar la sede.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!adminCompanyId) return;
    if (!window.confirm("¿Eliminar esta sede?")) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await sitesService.remove(siteId);
      setSuccess("Sede eliminada correctamente.");
      await refreshSites(adminCompanyId);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo eliminar la sede.");
    } finally {
      setIsBusy(false);
    }
  };

  const toggleAssignmentCompanySelection = (companyId: string) => {
    setSelectedAssignmentCompanyIds((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleToggleSelectAllFilteredCompanies = () => {
    const filteredIds = filteredAssignmentCompanies
      .map((company) => company.id)
      .filter((companyId): companyId is string => !!companyId);

    if (filteredIds.length === 0) return;

    setSelectedAssignmentCompanyIds((prev) => {
      if (allFilteredSelected) {
        return prev.filter((id) => !filteredIds.includes(id));
      }

      return Array.from(new Set([...prev, ...filteredIds]));
    });
  };

  const handleCreateAssignment = async () => {
    if (!selectedSiteId || selectedAssignmentCompanyIds.length === 0 || !user?.userId) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await assignmentService.createBulk({
        companyIds: selectedAssignmentCompanyIds,
        siteId: selectedSiteId,
        createdByUserId: user.userId,
      });

      const summary = response.data;
      setSuccess(
        `Asignacion masiva completada: ${summary?.createdCount || 0} creadas, ${summary?.alreadyAssignedCount || 0} ya existentes, ${summary?.invalidCompanyCount || 0} invalidas.`
      );
      setSelectedAssignmentCompanyIds([]);
      await refreshSiteScopedData(selectedSiteId);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo crear la asignacion.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!selectedSiteId) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await assignmentService.remove(assignmentId);
      setSuccess("Asignacion eliminada correctamente.");
      await refreshSiteScopedData(selectedSiteId);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo eliminar la asignacion.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreatePermission = async () => {
    if (!selectedSiteId || !permissionUserId || !permissionRole.trim()) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await permissionService.create({
        userId: permissionUserId,
        siteId: selectedSiteId,
        permissionRole: permissionRole.trim(),
      });
      setSuccess("Permiso de usuario creado correctamente.");
      await refreshSiteScopedData(selectedSiteId);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo crear el permiso.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreatePrlUser = async () => {
    if (!user?.userId || !newPrlEmail.trim() || !newPrlPassword.trim()) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await userService.createPrl(user.userId, {
        email: newPrlEmail.trim(),
        password: newPrlPassword.trim(),
      });

      const createdUser = response.data;
      if (createdUser?.id) {
        setUsers((prev) => {
          const exists = prev.some((u) => u.id === createdUser.id);
          if (exists) return prev;
          return [...prev, createdUser].sort((a, b) => a.email.localeCompare(b.email));
        });
        setPermissionUserId(createdUser.id);
      }

      setNewPrlEmail("");
      setNewPrlPassword("");
      setSuccess("Usuario PRL creado correctamente. Ahora puedes asignarlo a una sede.");
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo crear el usuario PRL.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (!selectedSiteId) return;

    setIsBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await permissionService.remove(permissionId);
      setSuccess("Permiso eliminado correctamente.");
      await refreshSiteScopedData(selectedSiteId);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message || "No se pudo eliminar el permiso.");
    } finally {
      setIsBusy(false);
    }
  };

  if (!mounted) return null;

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta seccion.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-playOrange" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-brand-primary" />
          <div>
            <h1 className="text-3xl font-bold text-brand-primary">
              Sedes y permisos PRL
            </h1>
            <p className="text-muted-foreground">
              Configuracion unica para gestionar sedes, asignaciones de empresas y
              permisos por sede.
            </p>
          </div>
        </div>

        <Button asChild variant="outline">
          <Link href="/dashboard/configuration">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a configuracion
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-white border border-playBlueLight/30">
        <CardHeader>
          <CardTitle className="text-brand-primary">Sede seleccionada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
            <SelectTrigger className="w-full md:w-[420px] border-playBlueLight/50">
              <SelectValue placeholder="Selecciona una sede" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id || ""}>
                  {site.name}
                  {site.isDefault ? " (principal)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSite && (
            <div className="text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-brand-primary">Direccion:</span>{" "}
                {selectedSite.address || "-"}
              </p>
              <p>
                <span className="font-medium text-brand-primary">Tipo:</span>{" "}
                {selectedSite.isDefault ? "Sede principal" : "Sede secundaria"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="sites" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-[720px] bg-playGrey border border-playBlueLight">
          <TabsTrigger value="sites">
            <MapPin className="h-4 w-4 mr-2" />
            Sedes
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <Building2 className="h-4 w-4 mr-2" />
            Empresas por sede
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Users className="h-4 w-4 mr-2" />
            Usuarios por sede
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sites">
          <Card className="bg-white border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="text-brand-primary">Gestion de sedes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <Input
                  placeholder="Nombre de sede"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="border-playBlueLight/50"
                />
                <Input
                  placeholder="Direccion (opcional)"
                  value={newSiteAddress}
                  onChange={(e) => setNewSiteAddress(e.target.value)}
                  className="border-playBlueLight/50"
                />
                <Button onClick={handleCreateSite} disabled={isBusy || !newSiteName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear sede
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-playGrey">
                    <TableHead className="text-brand-primary">Nombre</TableHead>
                    <TableHead className="text-brand-primary">Direccion</TableHead>
                    <TableHead className="text-brand-primary">Tipo</TableHead>
                    <TableHead className="text-brand-primary">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => {
                    const isEditing = editSiteId === site.id;
                    return (
                      <TableRow key={site.id}>
                        <TableCell className="text-brand-primary font-medium">
                          {isEditing ? (
                            <Input
                              value={editSiteName}
                              onChange={(e) => setEditSiteName(e.target.value)}
                              className="border-playBlueLight/50"
                            />
                          ) : (
                            site.name
                          )}
                        </TableCell>
                        <TableCell className="text-brand-primary">
                          {isEditing ? (
                            <Input
                              value={editSiteAddress}
                              onChange={(e) => setEditSiteAddress(e.target.value)}
                              className="border-playBlueLight/50"
                            />
                          ) : (
                            site.address || "-"
                          )}
                        </TableCell>
                        <TableCell className="text-brand-primary">
                          {site.isDefault ? "Principal" : "Secundaria"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={handleSaveSite}
                                  disabled={isBusy || !editSiteName.trim()}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Guardar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditSiteId(null)}
                                  disabled={isBusy}
                                >
                                  Cancelar
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditSite(site)}
                                  disabled={isBusy}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteSite(site.id || "")}
                                  disabled={isBusy || site.isDefault}
                                  title={
                                    site.isDefault
                                      ? "La sede principal no se puede eliminar"
                                      : "Eliminar sede"
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card className="bg-white border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="text-brand-primary">
                Asignaciones empresa-sede
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 border border-playBlueLight/30 rounded-md p-4">
                <div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-3">
                  <Input
                    value={assignmentSearchTerm}
                    onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                    placeholder="Buscar empresa por nombre"
                    className="border-playBlueLight/50"
                  />
                  <Button
                    variant="outline"
                    onClick={handleToggleSelectAllFilteredCompanies}
                    disabled={isBusy || filteredAssignmentCompanies.length === 0}
                  >
                    {allFilteredSelected ? "Quitar visibles" : "Seleccionar visibles"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAssignmentCompanyIds([])}
                    disabled={isBusy || selectedAssignmentCompanyIds.length === 0}
                  >
                    Limpiar
                  </Button>
                  <Button
                    onClick={handleCreateAssignment}
                    disabled={isBusy || !selectedSiteId || selectedAssignmentCompanyIds.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Asignar seleccionadas ({selectedAssignmentCompanyIds.length})
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  {selectedSite ? `Sede: ${selectedSite.name}` : "Selecciona una sede"}
                  {" | "}
                  Disponibles: {availableAssignmentCompanies.length}
                  {" | "}
                  Filtradas: {filteredAssignmentCompanies.length}
                </div>

                <div className="max-h-56 overflow-y-auto border border-playBlueLight/20 rounded-md p-2 space-y-1">
                  {filteredAssignmentCompanies.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-2 py-1">
                      No hay empresas disponibles para asignar con el filtro actual.
                    </p>
                  ) : (
                    filteredAssignmentCompanies.map((company) => {
                      const companyId = company.id || "";
                      const checked = selectedAssignmentCompanyIds.includes(companyId);
                      return (
                        <label
                          key={companyId}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-playGrey cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAssignmentCompanySelection(companyId)}
                            disabled={isBusy}
                          />
                          <span className="text-sm text-brand-primary">{company.name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-playGrey">
                    <TableHead className="text-brand-primary">Empresa</TableHead>
                    <TableHead className="text-brand-primary">Sede</TableHead>
                    <TableHead className="text-brand-primary">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No hay asignaciones activas para esta sede.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="text-brand-primary">
                          {assignment.companyName || assignment.companyId}
                        </TableCell>
                        <TableCell className="text-brand-primary">
                          {assignment.siteName || assignment.siteId}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAssignment(assignment.id || "")}
                            disabled={isBusy}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="bg-white border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="text-brand-primary">Permisos por sede</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-playBlueLight/30 rounded-md p-4 space-y-3">
                <h3 className="text-sm font-semibold text-brand-primary">Crear usuario PRL</h3>
                <p className="text-xs text-muted-foreground">
                  Este bloque es independiente: primero creas el usuario PRL y después lo asignas a una sede.
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <Input
                    value={newPrlEmail}
                    onChange={(e) => setNewPrlEmail(e.target.value)}
                    placeholder="Email usuario PRL"
                    className="border-playBlueLight/50"
                  />
                  <Input
                    type="password"
                    value={newPrlPassword}
                    onChange={(e) => setNewPrlPassword(e.target.value)}
                    placeholder="Password temporal"
                    className="border-playBlueLight/50"
                  />
                  <Button
                    onClick={handleCreatePrlUser}
                    disabled={isBusy || !newPrlEmail.trim() || !newPrlPassword.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear usuario PRL
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-3">
                <Select value={permissionUserId} onValueChange={setPermissionUserId}>
                  <SelectTrigger className="border-playBlueLight/50">
                    <SelectValue placeholder="Selecciona usuario PRL" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length === 0 ? (
                      <SelectItem value="__no-users__" disabled>
                        No hay usuarios PRL vinculados
                      </SelectItem>
                    ) : (
                      users.map((row) => (
                        <SelectItem key={row.id} value={row.id || ""}>
                          {row.email} ({roleLabel(Number(row.role))})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Input
                  value={permissionRole}
                  onChange={(e) => setPermissionRole(e.target.value)}
                  placeholder="Rol de permiso (ej. PRLManager)"
                  className="border-playBlueLight/50"
                />

                <div className="text-sm text-muted-foreground flex items-center">
                  {selectedSite ? `Sede: ${selectedSite.name}` : "Selecciona una sede"}
                </div>

                <Button
                  onClick={handleCreatePermission}
                  disabled={
                    isBusy ||
                    !selectedSiteId ||
                    users.length === 0 ||
                    !permissionUserId ||
                    permissionUserId === "__no-users__" ||
                    !permissionRole.trim()
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear permiso
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-playGrey">
                    <TableHead className="text-brand-primary">Usuario</TableHead>
                    <TableHead className="text-brand-primary">Sede</TableHead>
                    <TableHead className="text-brand-primary">Rol</TableHead>
                    <TableHead className="text-brand-primary">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No hay permisos activos para esta sede.
                      </TableCell>
                    </TableRow>
                  ) : (
                    permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="text-brand-primary">
                          {permission.userEmail || permission.userId}
                        </TableCell>
                        <TableCell className="text-brand-primary">
                          {permission.siteName || permission.siteId}
                        </TableCell>
                        <TableCell className="text-brand-primary">
                          {permission.permissionRole}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePermission(permission.id || "")}
                            disabled={isBusy}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
