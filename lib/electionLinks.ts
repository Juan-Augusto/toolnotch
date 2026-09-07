/**
 * Official TSE (Tribunal Superior Eleitoral) links used by the 2026 election
 * content batch (plans/25-election-2026). Centralized here so a URL change is
 * a one-line fix instead of a hunt through page components and i18n files.
 *
 * TSE_POLLING_PLACE_LOOKUP_URL — manually verified via live browser navigation
 * on 2026-08-27: opening this exact URL (including the hash route) lands on
 * TSE's "Autoatendimento Eleitoral" self-service tool with the "Onde votar"
 * (where to vote) authentication form displayed — fields for
 * título eleitoral / CPF / nome, data de nascimento, and nome da mãe. This is
 * the service that replaced the older "Título Net" system referenced in the
 * PRD. Confirmed on tse.jus.br (not a subdomain), 200s, no redirect to the
 * bare homepage.
 *
 * TSE reorganizes this site periodically — re-verify this URL again during
 * the pre-election QA pass close to each 2026 round (see progress.txt in the
 * plan folder). If it ever stops resolving to the "Onde votar" form, fall
 * back to TSE_HOME_URL and update this constant.
 */
export const TSE_POLLING_PLACE_LOOKUP_URL =
  'https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor/onde-votar'

/** Safe fallback if the deep link above ever breaks — always resolves. */
export const TSE_HOME_URL = 'https://www.tse.jus.br'
