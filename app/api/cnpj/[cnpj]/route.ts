import { NextRequest, NextResponse } from "next/server";
import { formatCnpj, unformatCnpj, validateCnpj } from "@/lib/dev/cnpj";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  const { cnpj } = await params;
  const cleanCnpj = unformatCnpj(cnpj);

  if (cleanCnpj.length !== 14) {
    return NextResponse.json(
      { error: "CNPJ deve conter exatamente 14 dígitos." },
      { status: 400 }
    );
  }

  const validation = validateCnpj(cleanCnpj);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: validation.message || "Dígitos verificadores do CNPJ inválidos." },
      { status: 400 }
    );
  }

  // 1. Try BrasilAPI
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ToolNotch/2.0 (https://toolnotch.com)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();

      let formattedDate = data.data_inicio_atividade || "-";
      if (/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        const [y, m, d] = formattedDate.split("-");
        formattedDate = `${d}/${m}/${y}`;
      }

      const capitalNumber = Number(data.capital_social || 0);
      const capitalSocial = `R$ ${capitalNumber.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      let telefone = "-";
      if (data.ddd_telefone_1) {
        const ddd = data.ddd_telefone_1.slice(0, 2);
        const rest = data.ddd_telefone_1.slice(2);
        telefone = `(${ddd}) ${rest.length === 9 ? rest.replace(/(\d{5})(\d{4})/, "$1-$2") : rest.replace(/(\d{4})(\d{4})/, "$1-$2")}`;
      }

      let regimeTributario = "Demais (Lucro Presumido / Real)";
      if (data.opcao_pelo_simples) {
        regimeTributario = data.opcao_pelo_mei ? "Simples Nacional (MEI)" : "Simples Nacional";
      }

      const ie =
        data.inscricoes_estaduais && data.inscricoes_estaduais.length > 0
          ? data.inscricoes_estaduais[0].inscricao_estadual
          : "-";

      const logradouroFull = [
        data.descricao_tipo_de_logradouro,
        data.logradouro,
      ]
        .filter(Boolean)
        .join(" ");

      const companyDetails = {
        cnpj: formatCnpj(cleanCnpj),
        cnpjUnformatted: cleanCnpj,
        razaoSocial: data.razao_social || "-",
        nomeFantasia: data.nome_fantasia || data.razao_social || "-",
        inscricaoEstadual: ie,
        dataAbertura: formattedDate,
        situacaoCadastral: data.descricao_situacao_cadastral || "ATIVA",
        naturezaJuridica: data.natureza_juridica
          ? `${data.codigo_natureza_juridica || ""} - ${data.natureza_juridica}`
          : "-",
        regimeTributario,
        capitalSocial,
        cnaePrincipal: {
          codigo: String(data.cnae_fiscal || "-"),
          descricao: data.cnae_fiscal_descricao || "-",
        },
        telefone: telefone || "-",
        email: data.email ? String(data.email).toLowerCase() : "-",
        endereco: {
          logradouro: logradouroFull || "-",
          numero: data.numero || "-",
          complemento: data.complemento || "-",
          bairro: data.bairro || "-",
          cidade: data.municipio || "-",
          uf: data.uf || "-",
          cep: data.cep ? data.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2") : "-",
        },
        qsa: Array.isArray(data.qsa)
          ? data.qsa.map((s: { nome_socio?: string; qualificacao_socio?: string }) => ({
              nome: s.nome_socio || "-",
              qualificacao: s.qualificacao_socio || "-",
            }))
          : [],
      };

      return NextResponse.json(companyDetails, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      });
    }
  } catch {
    // Continue to fallback
  }

  // 2. Fallback to MinhaReceita
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://minhareceita.org/${cleanCnpj}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "ToolNotch/2.0 (https://toolnotch.com)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      let formattedDate = data.data_inicio_atividade || "-";
      if (/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        const [y, m, d] = formattedDate.split("-");
        formattedDate = `${d}/${m}/${y}`;
      }

      const capitalNumber = Number(data.capital_social || 0);
      const capitalSocial = `R$ ${capitalNumber.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      let telefone = "-";
      if (data.ddd_telefone_1) {
        const ddd = data.ddd_telefone_1.slice(0, 2);
        const rest = data.ddd_telefone_1.slice(2);
        telefone = `(${ddd}) ${rest.length === 9 ? rest.replace(/(\d{5})(\d{4})/, "$1-$2") : rest.replace(/(\d{4})(\d{4})/, "$1-$2")}`;
      }

      let regimeTributario = "Demais (Lucro Presumido / Real)";
      if (data.opcao_pelo_simples) {
        regimeTributario = data.opcao_pelo_mei ? "Simples Nacional (MEI)" : "Simples Nacional";
      }

      const logradouroFull = [
        data.descricao_tipo_de_logradouro,
        data.logradouro,
      ]
        .filter(Boolean)
        .join(" ");

      const companyDetails = {
        cnpj: formatCnpj(cleanCnpj),
        cnpjUnformatted: cleanCnpj,
        razaoSocial: data.razao_social || "-",
        nomeFantasia: data.nome_fantasia || data.razao_social || "-",
        inscricaoEstadual: "-",
        dataAbertura: formattedDate,
        situacaoCadastral: data.descricao_situacao_cadastral || "ATIVA",
        naturezaJuridica: data.natureza_juridica
          ? `${data.codigo_natureza_juridica || ""} - ${data.natureza_juridica}`
          : "-",
        regimeTributario,
        capitalSocial,
        cnaePrincipal: {
          codigo: String(data.cnae_fiscal || "-"),
          descricao: data.cnae_fiscal_descricao || "-",
        },
        telefone: telefone || "-",
        email: data.email ? String(data.email).toLowerCase() : "-",
        endereco: {
          logradouro: logradouroFull || "-",
          numero: data.numero || "-",
          complemento: data.complemento || "-",
          bairro: data.bairro || "-",
          cidade: data.municipio || "-",
          uf: data.uf || "-",
          cep: data.cep ? data.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2") : "-",
        },
        qsa: Array.isArray(data.qsa)
          ? data.qsa.map((s: { nome_socio?: string; qualificacao_socio?: string }) => ({
              nome: s.nome_socio || "-",
              qualificacao: s.qualificacao_socio || "-",
            }))
          : [],
      };

      return NextResponse.json(companyDetails, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      });
    }
  } catch {
    // Continue to error return
  }

  return NextResponse.json(
    { error: "CNPJ não encontrado nas bases de dados da Receita Federal." },
    { status: 404 }
  );
}
