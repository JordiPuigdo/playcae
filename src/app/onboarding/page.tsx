"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";

import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Building,
  Users,
  CheckCircle,
} from "lucide-react";
import { CompanyFormData } from "@/types/company";
import { WorkerFormData } from "@/types/worker";
import { useToast } from "@/hooks/use-Toast";
import { useCompanies } from "@/hooks/useCompanies";
import Loader from "@/components/Loader";
import { useWorkers } from "@/hooks/useWorkers";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { EntityStatus } from "@/types/document";

interface OnboardingData {
  company: CompanyFormData;
  workers: WorkerFormData[];
}

export default function CompanyOnboarding() {
  const [token, setToken] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { getCompanyById, updateCompany, updateCompanyStatus } = useCompanies();
  const { createBulkWorkers, workers } = useWorkers(token!);
  const router = useRouter();
  const { logout } = useAuthStore();

  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      setToken(query.get("token"));
    }
  }, []);

  const fetchCompany = async (token: string) => {
    const company = await getCompanyById(token);

    if (!company) {
      setIsLoadingCompany(false);
      return;
    }
    setOnboardingData({
      company: {
        name: company.name,
        taxId: company.taxId,
        contactPerson: company.contactPerson,
        email: company.email,
        phone: company.phone,
      },
      workers: workers,
    });
    setIsLoadingCompany(false);
  };

  useEffect(() => {
    if (token) {
      fetchCompany(token);
    }
  }, [token]);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    company: {
      name: "",
      taxId: "",
      contactPerson: "",
      email: "",
      phone: "",
    },
    workers: [
      {
        firstName: "",
        lastName: "",
        cardId: "",
        position: "",
        companyId: "",
      },
    ],
  });

  const validateCompanyForm = () => {
    const newErrors: Record<string, string> = {};
    const { company } = onboardingData;

    if (!company.name.trim()) {
      newErrors.name = "Company name is required";
    }
    if (!company.taxId.trim()) {
      newErrors.cif = "CIF is required";
    }
    if (!company.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }
    if (!company.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateWorkersForm = () => {
    const newErrors: Record<string, string> = {};
    const { workers } = onboardingData;

    workers.forEach((worker, index) => {
      if (!worker.firstName.trim()) {
        newErrors[`worker-${index}-firstName`] = "First name is required";
      }
      if (!worker.lastName.trim()) {
        newErrors[`worker-${index}-lastName`] = "Last name is required";
      }
      if (!worker.cardId.trim()) {
        newErrors[`worker-${index}-dni`] = "DNI is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleWorkerChange = (
    index: number,
    field: keyof WorkerFormData,
    value: string
  ) => {
    setOnboardingData((prev) => ({
      ...prev,
      workers: prev.workers.map((worker, i) =>
        i === index ? { ...worker, [field]: value } : worker
      ),
    }));

    const errorKey = `worker-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const addWorker = () => {
    setOnboardingData((prev) => ({
      ...prev,
      workers: [
        ...prev.workers,
        {
          firstName: "",
          lastName: "",
          cardId: "",
          position: "",
          companyId: "",
        },
      ],
    }));
  };

  const removeWorker = (index: number) => {
    if (onboardingData.workers.length > 1) {
      setOnboardingData((prev) => ({
        ...prev,
        workers: prev.workers.filter((_, i) => i !== index),
      }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateCompanyForm()) {
      return;
    }
    if (currentStep === 1 && validateCompanyForm()) {
      updateCompany(token!, onboardingData.company);
    }

    if (currentStep === 2 && !validateWorkersForm()) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createBulkWorkers(onboardingData.workers);
      await updateCompanyStatus(token!, EntityStatus.Rejected);

      toast({
        title: "Empresa creada correctamente",
        description:
          "Tu empresa y trabajadores se han registrado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        logout();
        router.push("/login");
      }, 1500);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-8 h-0.5 ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompanyForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Empresa
        </CardTitle>
        <CardDescription>
          Porfavor, rellena los campos necesarios para empezar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nombre Empresa *</Label>
            <Input
              id="company-name"
              value={onboardingData.company.name}
              onChange={(e) => handleCompanyChange("name", e.target.value)}
              placeholder="Escriba el nombre de la empresa"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-cif">CIF *</Label>
            <Input
              id="company-cif"
              value={onboardingData.company.taxId}
              onChange={(e) => handleCompanyChange("taxId", e.target.value)}
              placeholder="Escriba su CIF"
            />
            {errors.cif && (
              <p className="text-sm text-destructive">{errors.cif}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-person">Contacto *</Label>
            <Input
              id="contact-person"
              value={onboardingData.company.contactPerson}
              onChange={(e) =>
                handleCompanyChange("contactPerson", e.target.value)
              }
              placeholder="Escriba un nombre de contacto"
            />
            {errors.contactPerson && (
              <p className="text-sm text-destructive">{errors.contactPerson}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-email">Email *</Label>
            <Input
              id="company-email"
              type="email"
              value={onboardingData.company.email}
              onChange={(e) => handleCompanyChange("email", e.target.value)}
              placeholder="Escriba su dirección de correo electrónico"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="company-phone">Teléfono (Opcional)</Label>
            <Input
              id="company-phone"
              value={onboardingData.company.phone}
              onChange={(e) => handleCompanyChange("phone", e.target.value)}
              placeholder="Escriba un número de teléfono"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderWorkersForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Añadir trabajadores
        </CardTitle>
        <CardDescription>
          Añade los trabajadores que se asociarán con tu empresa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {onboardingData.workers.map((worker, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Trabajador {index + 1}</h4>
              {onboardingData.workers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorker(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`worker-${index}-firstName`}>Nombre *</Label>
                <Input
                  id={`worker-${index}-firstName`}
                  value={worker.firstName}
                  onChange={(e) =>
                    handleWorkerChange(index, "firstName", e.target.value)
                  }
                  placeholder="Escriba su nombre"
                />
                {errors[`worker-${index}-firstName`] && (
                  <p className="text-sm text-destructive">
                    {errors[`worker-${index}-firstName`]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`worker-${index}-lastName`}>Apellidos *</Label>
                <Input
                  id={`worker-${index}-lastName`}
                  value={worker.lastName}
                  onChange={(e) =>
                    handleWorkerChange(index, "lastName", e.target.value)
                  }
                  placeholder="Escriba apellidos"
                />
                {errors[`worker-${index}-lastName`] && (
                  <p className="text-sm text-destructive">
                    {errors[`worker-${index}-lastName`]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`worker-${index}-dni`}>DNI *</Label>
                <Input
                  id={`worker-${index}-dni`}
                  value={worker.cardId}
                  onChange={(e) =>
                    handleWorkerChange(index, "cardId", e.target.value)
                  }
                  placeholder="Escriba DNI"
                />
                {errors[`worker-${index}-dni`] && (
                  <p className="text-sm text-destructive">
                    {errors[`worker-${index}-dni`]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`worker-${index}-position`}>
                  Posición (Opcional)
                </Label>
                <Input
                  id={`worker-${index}-position`}
                  value={worker.position}
                  onChange={(e) =>
                    handleWorkerChange(index, "position", e.target.value)
                  }
                  placeholder="Escriba posición"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addWorker}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir otro trabajador
        </Button>
      </CardContent>
    </Card>
  );

  const renderConfirmation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Confirmación
        </CardTitle>
        <CardDescription>
          Porfavor, revise que la información es correcta antes de enviar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Company Information</h4>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p>
              <strong>Nombre:</strong> {onboardingData.company.name}
            </p>
            <p>
              <strong>CIF:</strong> {onboardingData.company.taxId}
            </p>
            <p>
              <strong>Contacto:</strong> {onboardingData.company.contactPerson}
            </p>
            <p>
              <strong>Email:</strong> {onboardingData.company.email}
            </p>
            {onboardingData.company.phone && (
              <p>
                <strong>Teléfono:</strong> {onboardingData.company.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">
            Trabajadores ({onboardingData.workers.length})
          </h4>
          <div className="space-y-3">
            {onboardingData.workers.map((worker, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <p>
                  <strong>
                    {worker.firstName} {worker.lastName}
                  </strong>
                </p>
                <p>DNI: {worker.cardId}</p>
                {worker.position && <p>Posición: {worker.position}</p>}
              </div>
            ))}
          </div>
        </div>

        <Alert>
          <AlertDescription>
            Al enviar este formulario, confirma que toda la información
            proporcionada es correcta y que estás de acuerdo con nuestros
            términos y condiciones.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  if (!token && !isLoadingCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This onboarding link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {isLoadingCompany && <Loader />}
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Empresa Registrada</h1>
          <p className="text-muted-foreground mt-2">
            Completa tu registro de empresa en pocos pasos
          </p>
        </div>

        {renderStepIndicator()}

        <div className="mb-8">
          {currentStep === 1 && renderCompanyForm()}
          {currentStep === 2 && renderWorkersForm()}
          {currentStep === 3 && renderConfirmation()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Atrás
          </Button>

          {currentStep < 3 ? (
            <Button onClick={nextStep}>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar i completar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
