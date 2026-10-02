import { NextRequest, NextResponse } from "next/server";

const UF_TO_NAME: Record<string, { nome: string; regiao: string; ddd: string }> = {
  SP: { nome: "São Paulo", regiao: "Sudeste", ddd: "11" },
  RJ: { nome: "Rio de Janeiro", regiao: "Sudeste", ddd: "21" },
  MG: { nome: "Minas Gerais", regiao: "Sudeste", ddd: "31" },
  ES: { nome: "Espírito Santo", regiao: "Sudeste", ddd: "27" },
  PR: { nome: "Paraná", regiao: "Sul", ddd: "41" },
  RS: { nome: "Rio Grande do Sul", regiao: "Sul", ddd: "51" },
  SC: { nome: "Santa Catarina", regiao: "Sul", ddd: "48" },
  BA: { nome: "Bahia", regiao: "Nordeste", ddd: "71" },
  PE: { nome: "Pernambuco", regiao: "Nordeste", ddd: "81" },
  CE: { nome: "Ceará", regiao: "Nordeste", ddd: "85" },
  RN: { nome: "Rio Grande do Norte", regiao: "Nordeste", ddd: "84" },
  PB: { nome: "Paraíba", regiao: "Nordeste", ddd: "83" },
  AL: { nome: "Alagoas", regiao: "Nordeste", ddd: "82" },
  SE: { nome: "Sergipe", regiao: "Nordeste", ddd: "79" },
  MA: { nome: "Maranhão", regiao: "Nordeste", ddd: "98" },
  PI: { nome: "Piauí", regiao: "Nordeste", ddd: "86" },
  DF: { nome: "Distrito Federal", regiao: "Centro-Oeste", ddd: "61" },
  GO: { nome: "Goiás", regiao: "Centro-Oeste", ddd: "62" },
  MT: { nome: "Mato Grosso", regiao: "Centro-Oeste", ddd: "65" },
  MS: { nome: "Mato Grosso do Sul", regiao: "Centro-Oeste", ddd: "67" },
  AM: { nome: "Amazonas", regiao: "Norte", ddd: "92" },
  PA: { nome: "Pará", regiao: "Norte", ddd: "91" },
  RO: { nome: "Rondônia", regiao: "Norte", ddd: "69" },
  AC: { nome: "Acre", regiao: "Norte", ddd: "68" },
  AP: { nome: "Amapá", regiao: "Norte", ddd: "96" },
  RR: { nome: "Roraima", regiao: "Norte", ddd: "95" },
  TO: { nome: "Tocantins", regiao: "Norte", ddd: "63" },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cep: string }> }
) {
  const { cep } = await params;
  const cleanCep = (cep || "").replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    return NextResponse.json(
      { error: "CEP deve conter exatamente 8 dígitos numéricos." },
      { status: 400 }
    );
  }

  // 1. Try BrasilAPI (v2)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`, {
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
      const uf = (data.state || "").toUpperCase();
      const ufInfo = UF_TO_NAME[uf] || { nome: uf, regiao: "Brasil", ddd: "" };
      const formattedCep = cleanCep.replace(/^(\d{5})(\d{3})$/, "$1-$2");

      return NextResponse.json(
        {
          cep: formattedCep,
          cepUnformatted: cleanCep,
          logradouro: data.street || "",
          bairro: data.neighborhood || "",
          cidade: data.city || "",
          uf,
          estadoNome: ufInfo.nome,
          regiao: ufInfo.regiao,
          ddd: ufInfo.ddd,
          source: "brasilapi",
          coordinates: data.location?.coordinates || null,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
          },
        }
      );
    }
  } catch {
    // Continue to ViaCEP fallback
  }

  // 2. Fallback: ViaCEP
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
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
      if (!data.erro) {
        const uf = (data.uf || "").toUpperCase();
        const ufInfo = UF_TO_NAME[uf] || {
          nome: data.estado || uf,
          regiao: data.regiao || "Brasil",
          ddd: data.ddd || "",
        };
        const formattedCep = cleanCep.replace(/^(\d{5})(\d{3})$/, "$1-$2");

        return NextResponse.json(
          {
            cep: formattedCep,
            cepUnformatted: cleanCep,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            uf,
            estadoNome: ufInfo.nome,
            regiao: data.regiao || ufInfo.regiao,
            ddd: data.ddd || ufInfo.ddd,
            source: "viacep",
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
            },
          }
        );
      }
    }
  } catch {
    // Fallback failed
  }

  return NextResponse.json(
    { error: "CEP não encontrado nas bases oficiais dos Correios." },
    { status: 404 }
  );
}
