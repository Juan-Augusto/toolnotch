"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ListChecks,
  Wrench,
  Bug,
  Compass,
  BookmarkPlus,
  CheckSquare,
  Layers,
} from "lucide-react";
import {
  AppButton,
  AppInput,
  AppTextarea,
  AppCard,
  AppBadge,
  AppTabsChips,
} from "@/components/ui";

interface BddScenario {
  id: string;
  title: string;
  given: string;
  when: string;
  then: string;
}

interface ChecklistItem {
  id: string;
  text: string;
}

interface BacklogStory {
  id: string;
  title: string;
  type: string;
  content: string;
}

interface Props {
  labels: Record<string, string>;
  locale?: string;
}

export default function UserStoryWriterClient({
  labels,
  locale = "pt",
}: Props) {
  // Story Type
  const [storyType, setStoryType] = useState<"userStory" | "technical" | "bug" | "spike">("userStory");

  // Standard User Story
  const [role, setRole] = useState("");
  const [feature, setFeature] = useState("");
  const [benefit, setBenefit] = useState("");

  // Technical Story
  const [techRole, setTechRole] = useState("");
  const [techAction, setTechAction] = useState("");
  const [techBenefit, setTechBenefit] = useState("");

  // Bug Story
  const [bugContext, setBugContext] = useState("");
  const [bugActual, setBugActual] = useState("");
  const [bugExpected, setBugExpected] = useState("");

  // Spike Story
  const [spikeTeam, setSpikeTeam] = useState("");
  const [spikeQuestion, setSpikeQuestion] = useState("");
  const [spikeOutcome, setSpikeOutcome] = useState("");
  const [spikeTimebox, setSpikeTimebox] = useState("");

  // Criteria Mode & Data
  const [criteriaMode, setCriteriaMode] = useState<"gherkin" | "checklist" | "freeText">("gherkin");
  const [scenarios, setScenarios] = useState<BddScenario[]>([
    {
      id: "1",
      title: "",
      given: "",
      when: "",
      then: "",
    },
  ]);
  const [checklistRules, setChecklistRules] = useState<ChecklistItem[]>([]);
  const [newRuleInput, setNewRuleInput] = useState("");
  const [freeTextCriteria, setFreeTextCriteria] = useState("");

  // INVEST Checklist
  const [investChecks, setInvestChecks] = useState({
    independent: true,
    negotiable: true,
    valuable: true,
    estimable: true,
    small: true,
    testable: true,
  });

  // Export format & Output
  const [exportFormat, setExportFormat] = useState<"markdown" | "jira" | "slack">("markdown");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Session Backlog
  const [sessionBacklog, setSessionBacklog] = useState<BacklogStory[]>([]);
  const [copiedBacklog, setCopiedBacklog] = useState(false);

  // Quick scenario templates
  function addScenario(custom?: Partial<BddScenario>) {
    const newScen: BddScenario = {
      id: String(Date.now() + Math.random()),
      title: custom?.title || "",
      given: custom?.given || "",
      when: custom?.when || "",
      then: custom?.then || "",
    };
    setScenarios((prev) => [...prev, newScen]);
  }

  function updateScenario(id: string, field: keyof BddScenario, value: string) {
    setScenarios((prev) =>
      prev.map((scen) => (scen.id === id ? { ...scen, [field]: value } : scen))
    );
  }

  function removeScenario(id: string) {
    setScenarios((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.length === 0
        ? [{ id: String(Date.now()), title: "", given: "", when: "", then: "" }]
        : filtered;
    });
  }

  function addQuickScenario(type: "happy" | "validation" | "auth") {
    if (type === "happy") {
      if (locale === "pt") {
        addScenario({
          title: "Caminho Feliz (Sucesso)",
          given: "o usuário preencheu todos os campos válidos",
          when: "confirma o envio da ação",
          then: "o sistema processa com sucesso e exibe confirmação visual",
        });
      } else if (locale === "es") {
        addScenario({
          title: "Caso de Éxito",
          given: "el usuario completó todos los campos válidos",
          when: "confirma el envío de la acción",
          then: "el sistema procesa con éxito y muestra confirmación visual",
        });
      } else {
        addScenario({
          title: "Happy Path",
          given: "user entered valid inputs in all fields",
          when: "submits the action",
          then: "system processes successfully and renders confirmation",
        });
      }
    } else if (type === "validation") {
      if (locale === "pt") {
        addScenario({
          title: "Erro de Validação",
          given: "campos obrigatórios estão em branco ou formato inválido",
          when: "tenta submeter o formulário",
          then: "o sistema destaca os campos com erro e bloqueia o envio",
        });
      } else if (locale === "es") {
        addScenario({
          title: "Error de Validación",
          given: "campos obligatorios están en blanco o con formato inválido",
          when: "intenta enviar el formulario",
          then: "el sistema resalta los campos con error y bloquea el envío",
        });
      } else {
        addScenario({
          title: "Validation Error",
          given: "required fields are blank or improperly formatted",
          when: "attempts to submit the form",
          then: "system highlights error fields and prevents submission",
        });
      }
    } else {
      if (locale === "pt") {
        addScenario({
          title: "Acesso Não Autorizado",
          given: "a sessão expirou ou usuário não possui permissão",
          when: "tenta acessar ou executar a funcionalidade",
          then: "o sistema redireciona para o login com aviso de autenticação",
        });
      } else if (locale === "es") {
        addScenario({
          title: "No Autorizado",
          given: "la sesión expiró o el usuario no tiene permisos",
          when: "intenta acceder o ejecutar la funcionalidad",
          then: "el sistema redirige al login con advertencia",
        });
      } else {
        addScenario({
          title: "Unauthorized Access",
          given: "session is expired or user lacks required roles",
          when: "attempts to access or trigger feature",
          then: "system redirects to authentication prompt with friendly notice",
        });
      }
    }
  }

  function handleAddRule() {
    const text = newRuleInput.trim();
    if (!text) return;
    setChecklistRules((prev) => [...prev, { id: String(Date.now()), text }]);
    setNewRuleInput("");
  }

  function handleRemoveRule(id: string) {
    setChecklistRules((prev) => prev.filter((r) => r.id !== id));
  }

  // Load Real Example
  function loadExample(exampleId: "ecommerce" | "auth" | "fintech" | "technical" | "bug") {
    if (exampleId === "ecommerce") {
      setStoryType("userStory");
      if (locale === "pt") {
        setRole("cliente da loja");
        setFeature("aplicar um cupom de desconto no checkout");
        setBenefit("economizar no valor final e concluir a compra com rapidez");
      } else if (locale === "es") {
        setRole("cliente de la tienda");
        setFeature("aplicar un cupón de descuento en el checkout");
        setBenefit("ahorrar en el monto total y completar la compra con rapidez");
      } else {
        setRole("store customer");
        setFeature("apply a discount coupon during checkout");
        setBenefit("save money on my order and finish purchases quickly");
      }
      setCriteriaMode("gherkin");
      setScenarios([
        {
          id: "1",
          title: locale === "pt" ? "Cupom válido aplicado" : locale === "es" ? "Cupón válido aplicado" : "Valid coupon applied",
          given: locale === "pt" ? "estou no carrinho com produtos e insiro cupom 'PROMO10'" : locale === "es" ? "estoy en el carrito con productos e ingreso cupón 'PROMO10'" : "I have items in cart and submit coupon code 'PROMO10'",
          when: locale === "pt" ? "clico no botão Aplicar Cupom" : locale === "es" ? "hago clic en Aplicar Cupón" : "I click Apply Coupon button",
          then: locale === "pt" ? "vejo o desconto de 10% deduzido do total da compra" : locale === "es" ? "veo el descuento del 10% restado del total" : "I see 10% discount subtracted from the order total",
        },
        {
          id: "2",
          title: locale === "pt" ? "Cupom expirado ou inválido" : locale === "es" ? "Cupón expirado o inválido" : "Expired or invalid coupon",
          given: locale === "pt" ? "estou no carrinho e digito um código vencido" : locale === "es" ? "estoy en el carrito y digito un cupón vencido" : "I enter an expired coupon code",
          when: locale === "pt" ? "clico em Aplicar Cupom" : locale === "es" ? "hago clic en Aplicar" : "I submit the coupon code",
          then: locale === "pt" ? "o sistema exibe alerta 'Cupom inválido ou expirado' mantendo o total original" : locale === "es" ? "el sistema muestra advertencia de cupón vencido manteniendo el total" : "system warns coupon is expired and retains the original subtotal",
        },
      ]);
    } else if (exampleId === "auth") {
      setStoryType("userStory");
      if (locale === "pt") {
        setRole("usuário com dados sensíveis");
        setFeature("ativar autenticação em duas etapas (2FA) com app autenticador");
        setBenefit("garantir que ninguém acesse minha conta mesmo se minha senha vazar");
      } else if (locale === "es") {
        setRole("usuario con datos sensibles");
        setFeature("activar autenticación de dos factores (2FA) con app autenticadora");
        setBenefit("asegurar mi cuenta incluso si mi contraseña es comprometida");
      } else {
        setRole("security-conscious user");
        setFeature("enable two-factor authentication (2FA) via authenticator app");
        setBenefit("protect my account from unauthorized access if my password leaks");
      }
      setCriteriaMode("gherkin");
      setScenarios([
        {
          id: "1",
          title: locale === "pt" ? "Ativação com QR Code" : locale === "es" ? "Activación con QR Code" : "QR Code Setup",
          given: locale === "pt" ? "estou na página de segurança do perfil" : locale === "es" ? "estoy en configuración de seguridad" : "I am on profile security settings",
          when: locale === "pt" ? "escaneio o QR Code e digito o código de 6 dígitos gerado" : locale === "es" ? "escaneo el QR y digito el código de 6 dígitos" : "I scan the QR Code and enter the 6-digit TOTP code",
          then: locale === "pt" ? "o 2FA é ativado e recebo 10 códigos de backup para download" : locale === "es" ? "el 2FA se activa y descargo 10 códigos de respaldo" : "2FA is enabled and 10 backup emergency codes are provided for download",
        },
      ]);
    } else if (exampleId === "fintech") {
      setStoryType("userStory");
      if (locale === "pt") {
        setRole("analista financeiro");
        setFeature("exportar extrato de transações filtrado em CSV");
        setBenefit("conciliar pagamentos mensais sem digitação manual de relatórios");
      } else if (locale === "es") {
        setRole("analista financiero");
        setFeature("exportar extracto de transacciones filtrado en CSV");
        setBenefit("conciliar pagos mensuales sin digitación manual de reportes");
      } else {
        setRole("financial analyst");
        setFeature("export filtered transaction history to CSV format");
        setBenefit("reconcile monthly accounts without tedious manual spreadsheet entry");
      }
      setCriteriaMode("checklist");
      setChecklistRules([
        { id: "1", text: locale === "pt" ? "Exportação deve respeitar os filtros de data e status aplicados na tela" : locale === "es" ? "La exportación debe respetar los filtros de fecha y estado aplicados" : "Export respects currently applied date range and status filters" },
        { id: "2", text: locale === "pt" ? "Arquivo CSV codificado em UTF-8 com cabeçalhos padronizados" : locale === "es" ? "Archivo CSV codificado en UTF-8 con encabezados estándar" : "CSV file encoded in UTF-8 with standard column headers" },
        { id: "3", text: locale === "pt" ? "Limite de até 50.000 registros por arquivo com download instantâneo" : locale === "es" ? "Límite de hasta 50.000 registros por archivo con descarga inmediata" : "Supports up to 50,000 records per export with instant streaming download" },
      ]);
    } else if (exampleId === "technical") {
      setStoryType("technical");
      if (locale === "pt") {
        setTechRole("Engenharia de Backend e Mensageria");
        setTechAction("implementar fila RabbitMQ/SQS com retry automático para e-mails transacionais");
        setTechBenefit("evitar travamentos no checkout causados por instabilidade da API externa de e-mail");
      } else if (locale === "es") {
        setTechRole("Ingeniería de Backend y Mensajería");
        setTechAction("implementar cola RabbitMQ/SQS con reintentos para correos transaccionales");
        setTechBenefit("evitar bloqueos en checkout causados por caídas en la API externa de correo");
      } else {
        setTechRole("Backend & Messaging Infrastructure");
        setTechAction("deploy a RabbitMQ/SQS asynchronous queue with exponential backoff for transactional emails");
        setTechBenefit("prevent checkout bottlenecks and isolate external email provider latency");
      }
      setCriteriaMode("checklist");
      setChecklistRules([
        { id: "1", text: locale === "pt" ? "Dead-letter queue (DLQ) configurada após 5 tentativas sem sucesso" : locale === "es" ? "Dead-letter queue (DLQ) configurada tras 5 intentos fallidos" : "Dead-letter queue (DLQ) configured after 5 failed attempts" },
        { id: "2", text: locale === "pt" ? "Métricas de consumo de mensagens visíveis no Prometheus/Grafana" : locale === "es" ? "Métricas de consumo visibles en Prometheus/Grafana" : "Queue latency and error rate metrics exported to Prometheus/Grafana" },
      ]);
    } else if (exampleId === "bug") {
      setStoryType("bug");
      if (locale === "pt") {
        setBugContext("ao fazer upload de imagem de avatar em formato PNG transparente ou JPG maiúsculo");
        setBugActual("a imagem de perfil fica distorcida com fundo preto e gera erro HTTP 500 no log");
        setBugExpected("o serviço redimensiona mantendo transparência em WebP e extensão normalizada em minúsculas");
      } else if (locale === "es") {
        setBugContext("al subir imagen de perfil en PNG transparente o JPG con extensión en mayúsculas");
        setBugActual("la foto de perfil queda distorsionada con fondo negro y causa error HTTP 500");
        setBugExpected("el servicio redimensiona manteniendo transparencia y normaliza la extensión");
      } else {
        setBugContext("when uploading user profile avatar as transparent PNG or uppercase .JPG");
        setBugActual("avatar renders corrupted with black background artifacts and triggers HTTP 500");
        setBugExpected("image service normalizes extension and preserves alpha transparency with WebP conversion");
      }
      setCriteriaMode("gherkin");
      setScenarios([
        {
          id: "1",
          title: locale === "pt" ? "Upload de avatar transparente" : locale === "es" ? "Subida de avatar transparente" : "Transparent Avatar Upload",
          given: locale === "pt" ? "o usuário seleciona uma imagem PNG com transparência" : locale === "es" ? "el usuario selecciona una imagen PNG con transparencia" : "user selects a PNG avatar with alpha channel",
          when: locale === "pt" ? "salva as alterações de perfil" : locale === "es" ? "guarda los cambios de perfil" : "saves profile changes",
          then: locale === "pt" ? "o avatar é exibido com transparência preservada e status HTTP 200" : locale === "es" ? "el avatar se visualiza con transparencia y status HTTP 200" : "avatar renders with transparent background intact and HTTP 200",
        },
      ]);
    }
  }

  // Calculate INVEST score
  const investScore = useMemo(() => {
    return Object.values(investChecks).filter(Boolean).length;
  }, [investChecks]);

  // Validation
  const canGenerate = useMemo(() => {
    if (storyType === "userStory") {
      return role.trim().length > 0 && feature.trim().length > 0 && benefit.trim().length > 0;
    }
    if (storyType === "technical") {
      return techRole.trim().length > 0 && techAction.trim().length > 0 && techBenefit.trim().length > 0;
    }
    if (storyType === "bug") {
      return bugContext.trim().length > 0 && bugActual.trim().length > 0 && bugExpected.trim().length > 0;
    }
    if (storyType === "spike") {
      return spikeTeam.trim().length > 0 && spikeQuestion.trim().length > 0 && spikeOutcome.trim().length > 0;
    }
    return false;
  }, [
    storyType,
    role,
    feature,
    benefit,
    techRole,
    techAction,
    techBenefit,
    bugContext,
    bugActual,
    bugExpected,
    spikeTeam,
    spikeQuestion,
    spikeOutcome,
  ]);

  // Generate output text based on format
  function generateStoryText(format: "markdown" | "jira" | "slack") {
    let mainStoryTitle = "";
    let mainStoryBody = "";

    if (storyType === "userStory") {
      mainStoryTitle = labels.storyLabel || "User Story";
      if (locale === "pt") {
        mainStoryBody = `Como ${role.trim()}, eu quero ${feature.trim()}, para que ${benefit.trim()}.`;
      } else if (locale === "es") {
        mainStoryBody = `Como ${role.trim()}, quiero ${feature.trim()}, para que ${benefit.trim()}.`;
      } else {
        mainStoryBody = `As a ${role.trim()}, I want to ${feature.trim()}, so that ${benefit.trim()}.`;
      }
    } else if (storyType === "technical") {
      mainStoryTitle = labels.tabTechnical || "Technical Enabler";
      if (locale === "pt") {
        mainStoryBody = `Como equipe de ${techRole.trim()}, precisamos ${techAction.trim()}, para ${techBenefit.trim()}.`;
      } else if (locale === "es") {
        mainStoryBody = `Como equipo de ${techRole.trim()}, necesitamos ${techAction.trim()}, para ${techBenefit.trim()}.`;
      } else {
        mainStoryBody = `As the ${techRole.trim()} team, we need to ${techAction.trim()}, so that ${techBenefit.trim()}.`;
      }
    } else if (storyType === "bug") {
      mainStoryTitle = labels.tabBug || "Bug Fix";
      if (format === "markdown") {
        mainStoryBody = `- **${labels.bugContextLabel || "Contexto"}:** ${bugContext.trim()}\n- **${labels.bugActualLabel || "Comportamento Atual"}:** ${bugActual.trim()}\n- **${labels.bugExpectedLabel || "Comportamento Esperado"}:** ${bugExpected.trim()}`;
      } else if (format === "jira") {
        mainStoryBody = `* *${labels.bugContextLabel || "Contexto"}:* ${bugContext.trim()}\n* *${labels.bugActualLabel || "Comportamento Atual"}:* ${bugActual.trim()}\n* *${labels.bugExpectedLabel || "Comportamento Esperado"}:* ${bugExpected.trim()}`;
      } else {
        mainStoryBody = `• *${labels.bugContextLabel || "Contexto"}:* ${bugContext.trim()}\n• *${labels.bugActualLabel || "Comportamento Atual"}:* ${bugActual.trim()}\n• *${labels.bugExpectedLabel || "Comportamento Esperado"}:* ${bugExpected.trim()}`;
      }
    } else {
      mainStoryTitle = labels.tabSpike || "Spike / Investigação";
      if (format === "markdown") {
        mainStoryBody = `- **${labels.spikeTeamLabel || "Equipe"}:** ${spikeTeam.trim()}\n- **${labels.spikeQuestionLabel || "Incerteza"}:** ${spikeQuestion.trim()}\n- **${labels.spikeOutcomeLabel || "Entregável"}:** ${spikeOutcome.trim()}${spikeTimebox.trim() ? `\n- **${labels.spikeTimeboxLabel || "Timebox"}:** ${spikeTimebox.trim()}` : ""}`;
      } else if (format === "jira") {
        mainStoryBody = `* *${labels.spikeTeamLabel || "Equipe"}:* ${spikeTeam.trim()}\n* *${labels.spikeQuestionLabel || "Incerteza"}:* ${spikeQuestion.trim()}\n* *${labels.spikeOutcomeLabel || "Entregável"}:* ${spikeOutcome.trim()}${spikeTimebox.trim() ? `\n* *${labels.spikeTimeboxLabel || "Timebox"}:* ${spikeTimebox.trim()}` : ""}`;
      } else {
        mainStoryBody = `• *${labels.spikeTeamLabel || "Equipe"}:* ${spikeTeam.trim()}\n• *${labels.spikeQuestionLabel || "Incerteza"}:* ${spikeQuestion.trim()}\n• *${labels.spikeOutcomeLabel || "Entregável"}:* ${spikeOutcome.trim()}${spikeTimebox.trim() ? `\n• *${labels.spikeTimeboxLabel || "Timebox"}:* ${spikeTimebox.trim()}` : ""}`;
      }
    }

    // Criteria formatting
    let criteriaSection = "";
    const criteriaTitle = labels.acceptanceCriteriaLabel || "Critérios de Aceitação";

    if (criteriaMode === "gherkin") {
      const validScenarios = scenarios.filter(
        (s) => s.given.trim() || s.when.trim() || s.then.trim() || s.title.trim()
      );
      if (validScenarios.length > 0) {
        if (format === "markdown") {
          criteriaSection = `\n\n### ${criteriaTitle}\n` +
            validScenarios
              .map((s, idx) => {
                const titleStr = s.title.trim() ? `: ${s.title.trim()}` : "";
                return `**${labels.scenarioNumber || "Cenário"} ${idx + 1}${titleStr}**\n- **${labels.givenPrefix || "Dado que"}** ${s.given.trim()}\n- **${labels.whenPrefix || "Quando"}** ${s.when.trim()}\n- **${labels.thenPrefix || "Então"}** ${s.then.trim()}`;
              })
              .join("\n\n");
        } else if (format === "jira") {
          criteriaSection = `\n\nh3. ${criteriaTitle}\n` +
            validScenarios
              .map((s, idx) => {
                const titleStr = s.title.trim() ? `: ${s.title.trim()}` : "";
                return `* *${labels.scenarioNumber || "Cenário"} ${idx + 1}${titleStr}*\n** *${labels.givenPrefix || "Dado que"}* ${s.given.trim()}\n** *${labels.whenPrefix || "Quando"}* ${s.when.trim()}\n** *${labels.thenPrefix || "Então"}* ${s.then.trim()}`;
              })
              .join("\n\n");
        } else {
          criteriaSection = `\n\n*${criteriaTitle}:*\n` +
            validScenarios
              .map((s, idx) => {
                const titleStr = s.title.trim() ? `: ${s.title.trim()}` : "";
                return `• *${labels.scenarioNumber || "Cenário"} ${idx + 1}${titleStr}*\n  - ${labels.givenPrefix || "Dado que"}: ${s.given.trim()}\n  - ${labels.whenPrefix || "Quando"}: ${s.when.trim()}\n  - ${labels.thenPrefix || "Então"}: ${s.then.trim()}`;
              })
              .join("\n\n");
        }
      }
    } else if (criteriaMode === "checklist") {
      if (checklistRules.length > 0) {
        if (format === "markdown") {
          criteriaSection = `\n\n### ${criteriaTitle}\n` +
            checklistRules.map((r) => `- [ ] ${r.text}`).join("\n");
        } else if (format === "jira") {
          criteriaSection = `\n\nh3. ${criteriaTitle}\n` +
            checklistRules.map((r) => `* [ ] ${r.text}`).join("\n");
        } else {
          criteriaSection = `\n\n*${criteriaTitle}:*\n` +
            checklistRules.map((r) => `• [ ] ${r.text}`).join("\n");
        }
      }
    } else {
      if (freeTextCriteria.trim()) {
        if (format === "markdown") {
          criteriaSection = `\n\n### ${criteriaTitle}\n${freeTextCriteria.trim()}`;
        } else if (format === "jira") {
          criteriaSection = `\n\nh3. ${criteriaTitle}\n${freeTextCriteria.trim()}`;
        } else {
          criteriaSection = `\n\n*${criteriaTitle}:*\n${freeTextCriteria.trim()}`;
        }
      }
    }

    // Top title formatting
    if (format === "markdown") {
      return `### ${mainStoryTitle}\n${mainStoryBody}${criteriaSection}`;
    } else if (format === "jira") {
      return `h3. ${mainStoryTitle}\n${mainStoryBody}${criteriaSection}`;
    } else {
      return `*${mainStoryTitle}*\n${mainStoryBody}${criteriaSection}`;
    }
  }

  function handleGenerate() {
    const text = generateStoryText(exportFormat);
    setOutput(text);
  }

  function handleFormatChange(fmt: "markdown" | "jira" | "slack") {
    setExportFormat(fmt);
    if (output) {
      setOutput(generateStoryText(fmt));
    }
  }

  function handleClear() {
    setRole("");
    setFeature("");
    setBenefit("");
    setTechRole("");
    setTechAction("");
    setTechBenefit("");
    setBugContext("");
    setBugActual("");
    setBugExpected("");
    setSpikeTeam("");
    setSpikeQuestion("");
    setSpikeOutcome("");
    setSpikeTimebox("");
    setScenarios([{ id: "1", title: "", given: "", when: "", then: "" }]);
    setChecklistRules([]);
    setNewRuleInput("");
    setFreeTextCriteria("");
    setOutput("");
    setCopied(false);
  }

  async function copyToClipboard() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveToBacklog() {
    if (!output) return;
    const title =
      storyType === "userStory"
        ? (role.trim() && feature.trim() ? `${role} - ${feature}` : "User Story")
        : storyType === "technical"
          ? (techRole.trim() && techAction.trim() ? `${techRole} - ${techAction}` : "Enabler")
          : storyType === "bug"
            ? (bugContext.trim() ? `Bug: ${bugContext}` : "Bug Fix")
            : (spikeQuestion.trim() ? `Spike: ${spikeQuestion}` : "Spike");

    const newStory: BacklogStory = {
      id: String(Date.now()),
      title: title.slice(0, 60),
      type: storyType,
      content: output,
    };

    setSessionBacklog((prev) => [...prev, newStory]);
  }

  function handleRemoveBacklogItem(id: string) {
    setSessionBacklog((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleCopyAllBacklog() {
    if (sessionBacklog.length === 0) return;
    const separator = "\n\n---\n\n";
    const fullText = sessionBacklog.map((s, idx) => `## #${idx + 1} - ${s.title}\n\n${s.content}`).join(separator);
    await navigator.clipboard.writeText(fullText);
    setCopiedBacklog(true);
    setTimeout(() => setCopiedBacklog(false), 2000);
  }

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <AppTabsChips
          items={[
            {
              id: "userStory",
              label: labels.tabUserStory || "História de Usuário",
              icon: <FileText className="w-4 h-4" />,
            },
            {
              id: "technical",
              label: labels.tabTechnical || "Enabler Técnico",
              icon: <Wrench className="w-4 h-4" />,
            },
            {
              id: "bug",
              label: labels.tabBug || "Correção de Bug",
              icon: <Bug className="w-4 h-4" />,
            },
            {
              id: "spike",
              label: labels.tabSpike || "Spike de Investigação",
              icon: <Compass className="w-4 h-4" />,
            },
          ]}
          value={storyType}
          onChange={(val) => setStoryType(val as "userStory" | "technical" | "bug" | "spike")}
        />

        {/* Example Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {labels.exampleLabel || "Exemplos:"}
          </span>
          <button
            type="button"
            onClick={() => loadExample("ecommerce")}
            className="px-2.5 py-1 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-[2px] transition-colors border border-border/60"
          >
            {labels.exampleEcommerce || "E-commerce"}
          </button>
          <button
            type="button"
            onClick={() => loadExample("auth")}
            className="px-2.5 py-1 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-[2px] transition-colors border border-border/60"
          >
            {labels.exampleAuth || "Login 2FA"}
          </button>
          <button
            type="button"
            onClick={() => loadExample("fintech")}
            className="px-2.5 py-1 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-[2px] transition-colors border border-border/60"
          >
            {labels.exampleFintech || "Extrato CSV"}
          </button>
          <button
            type="button"
            onClick={() => loadExample("technical")}
            className="px-2.5 py-1 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-[2px] transition-colors border border-border/60"
          >
            {labels.exampleTechnical || "DevOps Queue"}
          </button>
          <button
            type="button"
            onClick={() => loadExample("bug")}
            className="px-2.5 py-1 bg-tertiary hover:bg-primary/20 hover:text-primary rounded-[2px] transition-colors border border-border/60"
          >
            {labels.exampleBug || "Upload Bug"}
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview & Session Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dynamic Story Fields */}
          <AppCard border cornerAccents className="p-4 sm:p-6 bg-tertiary space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="font-bold text-sm sm:text-base text-foreground uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                {storyType === "userStory"
                  ? labels.tabUserStory || "História de Usuário"
                  : storyType === "technical"
                    ? labels.tabTechnical || "Enabler Técnico"
                    : storyType === "bug"
                      ? labels.tabBug || "Correção de Bug"
                      : labels.tabSpike || "Spike de Investigação"}
              </h3>
              <AppBadge bg="bg-primary/10" text="text-primary" className="text-xs border border-primary/30">
                {labels.badgeInvest || "Critérios INVEST"}
              </AppBadge>
            </div>

            {storyType === "userStory" && (
              <div className="space-y-4">
                <AppInput
                  label={labels.roleLabel || "Papel / Persona"}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={labels.rolePlaceholder || "ex: cliente da loja, administrador"}
                  className="text-sm sm:text-base"
                />
                <AppInput
                  label={labels.featureLabel || "Funcionalidade / Ação"}
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  placeholder={labels.featurePlaceholder || "ex: aplicar cupom de desconto no carrinho"}
                  className="text-sm sm:text-base"
                />
                <AppInput
                  label={labels.benefitLabel || "Benefício / Objetivo"}
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                  placeholder={labels.benefitPlaceholder || "ex: economizar no total e finalizar a compra"}
                  className="text-sm sm:text-base"
                />
              </div>
            )}

            {storyType === "technical" && (
              <div className="space-y-4">
                <AppInput
                  label={labels.techRoleLabel || "Componente / Área Técnica"}
                  value={techRole}
                  onChange={(e) => setTechRole(e.target.value)}
                  placeholder={labels.techRolePlaceholder || "ex: Backend, Infraestrutura, Banco de Dados"}
                  className="text-sm sm:text-base"
                />
                <AppInput
                  label={labels.techActionLabel || "Necessidade Técnica / Mudança"}
                  value={techAction}
                  onChange={(e) => setTechAction(e.target.value)}
                  placeholder={labels.techActionPlaceholder || "ex: implementar índices particionados e cache Redis"}
                  className="text-sm sm:text-base"
                />
                <AppInput
                  label={labels.techBenefitLabel || "Impacto / Ganho Técnico"}
                  value={techBenefit}
                  onChange={(e) => setTechBenefit(e.target.value)}
                  placeholder={labels.techBenefitPlaceholder || "ex: reduzir latência de 800ms para 40ms"}
                  className="text-sm sm:text-base"
                />
              </div>
            )}

            {storyType === "bug" && (
              <div className="space-y-4">
                <AppInput
                  label={labels.bugContextLabel || "Contexto / Pré-condição do Erro"}
                  value={bugContext}
                  onChange={(e) => setBugContext(e.target.value)}
                  placeholder={labels.bugContextPlaceholder || "ex: ao salvar avatar com imagem PNG transparente"}
                  className="text-sm sm:text-base"
                />
                <AppInput
                  label={labels.bugActualLabel || "Comportamento Atual (Com Falha)"}
                  value={bugActual}
                  onChange={(e) => setBugActual(e.target.value)}
                  placeholder={labels.bugActualPlaceholder || "ex: a imagem fica com fundo preto distorcido"}
                  className="text-sm sm:text-base"
                />
                <AppInput
                  label={labels.bugExpectedLabel || "Comportamento Esperado"}
                  value={bugExpected}
                  onChange={(e) => setBugExpected(e.target.value)}
                  placeholder={labels.bugExpectedPlaceholder || "ex: transparência deve ser preservada normalmente"}
                  className="text-sm sm:text-base"
                />
              </div>
            )}

            {storyType === "spike" && (
              <div className="space-y-4">
                <AppInput
                  label={labels.spikeTeamLabel || "Equipe / Especialista Responsável"}
                  value={spikeTeam}
                  onChange={(e) => setSpikeTeam(e.target.value)}
                  placeholder={labels.spikeTeamPlaceholder || "ex: equipe de arquitetura e pagamentos"}
                  className="text-sm sm:text-base"
                />
                <AppInput
                  label={labels.spikeQuestionLabel || "Incerteza ou Hipótese a Investigar"}
                  value={spikeQuestion}
                  onChange={(e) => setSpikeQuestion(e.target.value)}
                  placeholder={labels.spikeQuestionPlaceholder || "ex: comparar migração do Stripe Checkout para Elements"}
                  className="text-sm sm:text-base"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AppInput
                    label={labels.spikeOutcomeLabel || "Entregável / Decisão"}
                    value={spikeOutcome}
                    onChange={(e) => setSpikeOutcome(e.target.value)}
                    placeholder={labels.spikeOutcomePlaceholder || "ex: documento de arquitetura e POC"}
                    className="text-sm sm:text-base"
                  />
                  <AppInput
                    label={labels.spikeTimeboxLabel || "Timebox Estimado"}
                    value={spikeTimebox}
                    onChange={(e) => setSpikeTimebox(e.target.value)}
                    placeholder={labels.spikeTimeboxPlaceholder || "ex: 2 dias úteis (16h)"}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
            )}
          </AppCard>

          {/* Acceptance Criteria Section */}
          <AppCard border cornerAccents={false} className="p-4 sm:p-6 bg-tertiary space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
              <h3 className="font-bold text-sm sm:text-base text-foreground uppercase flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-primary" />
                {labels.acceptanceCriteriaLabel || "Critérios de Aceitação"}
              </h3>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-background p-1 border border-border rounded-[2px] text-xs">
                <button
                  type="button"
                  onClick={() => setCriteriaMode("gherkin")}
                  className={`px-2.5 py-1 rounded-[2px] transition-colors ${
                    criteriaMode === "gherkin"
                      ? "bg-primary text-background font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  BDD / Gherkin
                </button>
                <button
                  type="button"
                  onClick={() => setCriteriaMode("checklist")}
                  className={`px-2.5 py-1 rounded-[2px] transition-colors ${
                    criteriaMode === "checklist"
                      ? "bg-primary text-background font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setCriteriaMode("freeText")}
                  className={`px-2.5 py-1 rounded-[2px] transition-colors ${
                    criteriaMode === "freeText"
                      ? "bg-primary text-background font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Texto Livre
                </button>
              </div>
            </div>

            {/* Mode 1: BDD Gherkin */}
            {criteriaMode === "gherkin" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">
                    {labels.quickScenariosLabel || "Atalhos rápidos:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => addQuickScenario("happy")}
                    className="px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-[2px] hover:bg-emerald-500/20 transition-colors"
                  >
                    {labels.quickHappyPath || "+ Caminho Feliz"}
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuickScenario("validation")}
                    className="px-2.5 py-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px] hover:bg-amber-500/20 transition-colors"
                  >
                    {labels.quickValidationError || "+ Validação de Erro"}
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuickScenario("auth")}
                    className="px-2.5 py-1 text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 rounded-[2px] hover:bg-sky-500/20 transition-colors"
                  >
                    {labels.quickAuthError || "+ Não Autorizado"}
                  </button>
                </div>

                <div className="space-y-4">
                  {scenarios.map((scen, idx) => (
                    <div
                      key={scen.id}
                      className="p-3.5 bg-background border border-border rounded-[2px] space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase text-primary">
                          {labels.scenarioNumber || "Cenário"} {idx + 1}
                        </span>
                        {scenarios.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeScenario(scen.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                            title={labels.removeScenarioButton || "Remover"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <AppInput
                        label={labels.scenarioTitleLabel || "Título do Cenário (opcional)"}
                        value={scen.title}
                        onChange={(e) => updateScenario(scen.id, "title", e.target.value)}
                        placeholder="ex: Cupom com desconto de primeira compra"
                        className="text-xs sm:text-sm"
                      />

                      <div className="space-y-2">
                        <AppInput
                          label={labels.scenarioGivenLabel || "Dado que (Precondição)"}
                          value={scen.given}
                          onChange={(e) => updateScenario(scen.id, "given", e.target.value)}
                          placeholder="ex: o usuário está na página de checkout com itens no carrinho"
                          className="text-xs sm:text-sm"
                        />
                        <AppInput
                          label={labels.scenarioWhenLabel || "Quando (Ação)"}
                          value={scen.when}
                          onChange={(e) => updateScenario(scen.id, "when", e.target.value)}
                          placeholder="ex: insere um cupom válido e clica em aplicar"
                          className="text-xs sm:text-sm"
                        />
                        <AppInput
                          label={labels.scenarioThenLabel || "Então (Resultado Esperado)"}
                          value={scen.then}
                          onChange={(e) => updateScenario(scen.id, "then", e.target.value)}
                          placeholder="ex: o desconto é calculado e o valor total atualizado"
                          className="text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <AppButton
                  type="button"
                  onClick={() => addScenario()}
                  color="tertiary"
                  className="w-full text-xs sm:text-sm h-[38px]"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>{labels.addScenarioButton || "Adicionar Cenário BDD"}</span>
                </AppButton>
              </div>
            )}

            {/* Mode 2: Checklist */}
            {criteriaMode === "checklist" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <AppInput
                    value={newRuleInput}
                    onChange={(e) => setNewRuleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
                    placeholder={labels.checklistItemPlaceholder || "Descreva uma regra de negócio ou critério..."}
                    className="flex-1 text-xs sm:text-sm"
                  />
                  <AppButton
                    type="button"
                    onClick={handleAddRule}
                    color="secondary"
                    className="h-[42px] px-4 text-xs sm:text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span>{labels.addChecklistItem || "Adicionar"}</span>
                  </AppButton>
                </div>

                {checklistRules.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {checklistRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-2.5 bg-background border border-border rounded-[2px] text-xs sm:text-sm"
                      >
                        <span className="text-foreground leading-relaxed flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                          {rule.text}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(rule.id)}
                          className="text-muted-foreground hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-3 text-center">
                    Nenhuma regra adicionada. Digite uma regra acima e clique em Adicionar.
                  </p>
                )}
              </div>
            )}

            {/* Mode 3: FreeText */}
            {criteriaMode === "freeText" && (
              <div>
                <AppTextarea
                  value={freeTextCriteria}
                  onChange={(e) => setFreeTextCriteria(e.target.value)}
                  placeholder={
                    labels.criteriaPlaceholder ||
                    "Um critério por linha, ex:\nDado que estou na página de login\nQuando clico em Esqueci a Senha\nEntão recebo um e-mail em até 1 minuto"
                  }
                  rows={5}
                  className="text-xs sm:text-sm"
                />
              </div>
            )}
          </AppCard>

          {/* INVEST Quality Checklist */}
          <AppCard border cornerAccents={false} className="p-4 sm:p-5 bg-background border-border/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h4 className="font-bold text-xs sm:text-sm uppercase text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {labels.investHeading || "Avaliação de Qualidade INVEST"}
              </h4>

              <AppBadge
                bg={investScore === 6 ? "bg-emerald-500/10" : investScore >= 4 ? "bg-amber-500/10" : "bg-muted"}
                text={investScore === 6 ? "text-emerald-500" : investScore >= 4 ? "text-amber-500" : "text-muted-foreground"}
                className="text-xs font-bold"
              >
                {investScore}/6 INVEST
              </AppBadge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-muted-foreground">
              <label className="flex items-start gap-2 cursor-pointer hover:text-foreground transition-colors select-none">
                <input
                  type="checkbox"
                  checked={investChecks.independent}
                  onChange={(e) => setInvestChecks((p) => ({ ...p, independent: e.target.checked }))}
                  className="mt-0.5 rounded-[2px] accent-primary"
                />
                <span>{labels.investIndependent || "Independente: entrega valor isoladamente"}</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer hover:text-foreground transition-colors select-none">
                <input
                  type="checkbox"
                  checked={investChecks.negotiable}
                  onChange={(e) => setInvestChecks((p) => ({ ...p, negotiable: e.target.checked }))}
                  className="mt-0.5 rounded-[2px] accent-primary"
                />
                <span>{labels.investNegotiable || "Negociável: foca no objetivo e valor"}</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer hover:text-foreground transition-colors select-none">
                <input
                  type="checkbox"
                  checked={investChecks.valuable}
                  onChange={(e) => setInvestChecks((p) => ({ ...p, valuable: e.target.checked }))}
                  className="mt-0.5 rounded-[2px] accent-primary"
                />
                <span>{labels.investValuable || "Valiosa: benefício claro para o cliente ou negócio"}</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer hover:text-foreground transition-colors select-none">
                <input
                  type="checkbox"
                  checked={investChecks.estimable}
                  onChange={(e) => setInvestChecks((p) => ({ ...p, estimable: e.target.checked }))}
                  className="mt-0.5 rounded-[2px] accent-primary"
                />
                <span>{labels.investEstimable || "Estimável: escopo compreensível pela equipe"}</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer hover:text-foreground transition-colors select-none">
                <input
                  type="checkbox"
                  checked={investChecks.small}
                  onChange={(e) => setInvestChecks((p) => ({ ...p, small: e.target.checked }))}
                  className="mt-0.5 rounded-[2px] accent-primary"
                />
                <span>{labels.investSmall || "Pequena: cabe dentro de uma única sprint"}</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer hover:text-foreground transition-colors select-none">
                <input
                  type="checkbox"
                  checked={investChecks.testable}
                  onChange={(e) => setInvestChecks((p) => ({ ...p, testable: e.target.checked }))}
                  className="mt-0.5 rounded-[2px] accent-primary"
                />
                <span>{labels.investTestable || "Testável: critérios de aceitação verificáveis"}</span>
              </label>
            </div>
          </AppCard>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <AppButton
              onClick={handleGenerate}
              disabled={!canGenerate}
              color="primary"
              className="text-xs sm:text-base flex-1 h-[44px]"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>{labels.generateButton || "Gerar História"}</span>
            </AppButton>

            <AppButton
              onClick={handleClear}
              color="tertiary"
              className="text-xs sm:text-sm px-5 h-[44px]"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>{labels.clearButton || "Limpar"}</span>
            </AppButton>
          </div>
        </div>

        {/* Right Output & Session Backlog (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Output Card */}
          <AppCard border cornerAccents className="p-4 sm:p-5 bg-tertiary space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm uppercase text-foreground">
                  {labels.outputHeading || "História Formatada"}
                </h3>
                <AppBadge
                  bg={investScore === 6 ? "bg-emerald-500/10" : "bg-amber-500/10"}
                  text={investScore === 6 ? "text-emerald-500" : "text-amber-500"}
                  className="text-xs"
                >
                  {investScore}/6 INVEST
                </AppBadge>
              </div>

              {/* Format pills */}
              <div className="flex items-center gap-1 bg-background p-0.5 border border-border rounded-[2px] text-xs">
                <button
                  type="button"
                  onClick={() => handleFormatChange("markdown")}
                  className={`px-2 py-0.5 rounded-[2px] transition-colors ${
                    exportFormat === "markdown"
                      ? "bg-primary text-background font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Markdown
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatChange("jira")}
                  className={`px-2 py-0.5 rounded-[2px] transition-colors ${
                    exportFormat === "jira"
                      ? "bg-primary text-background font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Jira
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatChange("slack")}
                  className={`px-2 py-0.5 rounded-[2px] transition-colors ${
                    exportFormat === "slack"
                      ? "bg-primary text-background font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Slack
                </button>
              </div>
            </div>

            {/* Output Display */}
            {output ? (
              <div className="space-y-3">
                <AppCard
                  border
                  cornerAccents={false}
                  className="p-3.5 sm:p-4 bg-background text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap select-all border-border max-h-[360px] overflow-y-auto"
                >
                  {output}
                </AppCard>

                <div className="flex flex-wrap gap-2">
                  <AppButton
                    onClick={copyToClipboard}
                    color="secondary"
                    className="flex-1 text-xs sm:text-sm h-[38px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1 text-emerald-500" />
                        <span>{labels.copiedButton || "Copiado!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        <span>{labels.copyButton || "Copiar"}</span>
                      </>
                    )}
                  </AppButton>

                  <AppButton
                    onClick={handleSaveToBacklog}
                    color="tertiary"
                    className="text-xs sm:text-sm h-[38px] px-3.5"
                    title={labels.saveToBacklogButton || "Salvar no Backlog"}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-1 text-primary" />
                    <span>{labels.saveToBacklogButton || "Salvar"}</span>
                  </AppButton>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-background/50 border border-dashed border-border/70 rounded-[2px] space-y-2">
                <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Preencha os campos à esquerda e clique em &quot;{labels.generateButton || "Gerar História"}&quot; para visualizar a formatação pronta.
                </p>
              </div>
            )}
          </AppCard>

          {/* Session Backlog Manager */}
          <AppCard border cornerAccents={false} className="p-4 sm:p-5 bg-tertiary space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-xs sm:text-sm uppercase text-foreground">
                  {labels.sessionBacklogTitle || "Histórias Criadas"}
                </h4>
              </div>
              <AppBadge bg="bg-primary/10" text="text-primary" className="text-xs">
                {sessionBacklog.length}
              </AppBadge>
            </div>

            {sessionBacklog.length > 0 ? (
              <div className="space-y-2">
                <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                  {sessionBacklog.map((story, i) => (
                    <div
                      key={story.id}
                      className="p-2.5 bg-background border border-border rounded-[2px] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <span className="text-primary font-bold mr-1.5">#{i + 1}</span>
                        <span className="text-foreground">{story.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBacklogItem(story.id)}
                        className="text-muted-foreground hover:text-red-500 p-1 shrink-0 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                  <AppButton
                    onClick={handleCopyAllBacklog}
                    color="secondary"
                    className="flex-1 text-xs h-[36px]"
                  >
                    {copiedBacklog ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        <span>{labels.allBacklogCopied || "Backlog Copiado!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>{labels.copyAllBacklog || "Copiar Todas (Markdown)"}</span>
                      </>
                    )}
                  </AppButton>

                  <AppButton
                    onClick={() => setSessionBacklog([])}
                    color="tertiary"
                    className="text-xs h-[36px] px-3"
                    title={labels.clearBacklog || "Limpar"}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </AppButton>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-2 text-center">
                {labels.sessionBacklogEmpty ||
                  "Nenhuma história salva na sessão ainda. Gere uma história e clique em salvar para acumular seu refinamento."}
              </p>
            )}
          </AppCard>
        </div>
      </div>
    </div>
  );
}

