import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppCpfGenerator from "@/components/dev/AppCpfGenerator";
import AppCnpjGenerator from "@/components/dev/AppCnpjGenerator";
import AppAddressGenerator from "@/components/dev/AppAddressGenerator";
import AppUuidGenerator from "@/components/dev/AppUuidGenerator";
import AppJsonFormatter from "@/components/dev/AppJsonFormatter";

describe("AppCpfGenerator Component", () => {
  test("renders CPF generator and generates new CPF on button click", () => {
    render(<AppCpfGenerator locale="pt" />);
    expect(screen.getByText(/Gerador de CPF|CPF Gerado/i)).toBeInTheDocument();

    const generateBtn = screen.getByRole("button", { name: /Gerar Novo CPF/i });
    expect(generateBtn).toBeInTheDocument();
    fireEvent.click(generateBtn);
  });

  test("validates input CPF in real time", () => {
    render(<AppCpfGenerator locale="pt" />);
    const input = screen.getByPlaceholderText(/Digite ou cole um CPF/i);
    fireEvent.change(input, { target: { value: "111.111.111-11" } });
    expect(screen.getByText(/CPF INVÁLIDO/i)).toBeInTheDocument();
  });
});

describe("AppCnpjGenerator Component", () => {
  test("renders CNPJ generator with company data view", () => {
    render(<AppCnpjGenerator locale="pt" />);
    expect(screen.getByText(/Razão Social:/i)).toBeInTheDocument();
    expect(screen.getByText(/Nome Fantasia:/i)).toBeInTheDocument();

    const generateBtn = screen.getByRole("button", { name: /Gerar Novo CNPJ/i });
    fireEvent.click(generateBtn);
  });
});

describe("AppAddressGenerator Component", () => {
  test("renders Brazilian address generator with details", () => {
    render(<AppAddressGenerator locale="pt" />);
    expect(screen.getByText(/Gerar Novo Endereço/i)).toBeInTheDocument();
    expect(screen.getByText(/Logradouro:/i)).toBeInTheDocument();
    expect(screen.getByText(/Bairro:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cidade:/i)).toBeInTheDocument();
  });
});

describe("AppUuidGenerator Component", () => {
  test("renders UUID generator and switches versions", () => {
    render(<AppUuidGenerator locale="pt" />);
    expect(screen.getByText(/Gerar Novo UUID/i)).toBeInTheDocument();
    expect(screen.getByText(/UUID v4/i)).toBeInTheDocument();
    expect(screen.getByText(/UUID v7/i)).toBeInTheDocument();
  });
});

describe("AppJsonFormatter Component", () => {
  test("renders JSON formatter, formats and minifies code", () => {
    render(<AppJsonFormatter locale="pt" />);
    expect(screen.getByRole("button", { name: /Formatar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Minificar/i })).toBeInTheDocument();

    const minifyBtn = screen.getByRole("button", { name: /Minificar/i });
    fireEvent.click(minifyBtn);

    const textarea = screen.getByPlaceholderText(/Cole ou digite seu código JSON/i) as HTMLTextAreaElement;
    expect(textarea.value).not.toContain("\n");
  });
});

import AppJwtDecoder from "@/components/dev/AppJwtDecoder";
import AppBase64Converter from "@/components/dev/AppBase64Converter";
import AppHashGenerator from "@/components/dev/AppHashGenerator";
import AppUrlParser from "@/components/dev/AppUrlParser";
import AppRegexTester from "@/components/dev/AppRegexTester";

describe("AppJwtDecoder Component", () => {
  test("renders JWT decoder and decodes standard token", () => {
    render(<AppJwtDecoder locale="pt" />);
    expect(screen.getByText(/Token JWT Codificado/i)).toBeInTheDocument();
    expect(screen.getByText(/HEADER:/i)).toBeInTheDocument();
    expect(screen.getByText(/PAYLOAD:/i)).toBeInTheDocument();
    expect(screen.getByText(/SIGNATURE:/i)).toBeInTheDocument();
  });
});

describe("AppBase64Converter Component", () => {
  test("renders Base64 converter and encodes text", () => {
    render(<AppBase64Converter locale="pt" />);
    expect(screen.getByText(/Texto ➔ Base64/i)).toBeInTheDocument();
    expect(screen.getByText(/Resultado Base64/i)).toBeInTheDocument();
  });
});

describe("AppHashGenerator Component", () => {
  test("renders Hash generator with MD5, SHA-256, and comparison tools", () => {
    render(<AppHashGenerator locale="pt" />);
    expect(screen.getByText(/Texto de Entrada/i)).toBeInTheDocument();
    expect(screen.getByText(/SHA-256/i)).toBeInTheDocument();
    expect(screen.getByText(/MD5/i)).toBeInTheDocument();
    expect(screen.getByText(/CRC-32/i)).toBeInTheDocument();
  });
});

describe("AppUrlParser Component", () => {
  test("renders URL parser and shows query parameters table", () => {
    render(<AppUrlParser locale="pt" />);
    expect(screen.getByText(/URL para Análise e Edição/i)).toBeInTheDocument();
    expect(screen.getByText(/Parâmetros de Consulta/i)).toBeInTheDocument();
    expect(screen.getByText(/Copiar URL/i)).toBeInTheDocument();

    const utmBtn = screen.getByRole("button", { name: /UTM \/ Ads/i });
    fireEvent.click(utmBtn);
    expect(screen.getByText(/Remover Rastreamento/i)).toBeInTheDocument();
  });
});

describe("AppRegexTester Component", () => {
  test("renders Regex tester with match visualizer and presets", () => {
    render(<AppRegexTester locale="pt" />);
    expect(screen.getByText(/Expressão Regular/i)).toBeInTheDocument();
    expect(screen.getByText(/Texto de Teste/i)).toBeInTheDocument();
    expect(screen.getByText(/Substituição \/ Replace/i)).toBeInTheDocument();
  });
});

