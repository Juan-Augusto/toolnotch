import { shuffleArray } from "@/lib/random";

export interface ValidationResult {
  valid: boolean;
  errorKey: string | null;
  errorParams?: Record<string, string | number>;
}

export interface CustomNamedTeam {
  name: string;
  members: string[];
}

/**
 * Splits an array of names into a fixed number of teams using random round-robin distribution.
 */
export function splitIntoTeams(names: string[], teamCount: number): string[][] {
  if (names.length === 0 || teamCount < 1) return [];
  const shuffled = shuffleArray(names);
  const teams: string[][] = Array.from({ length: teamCount }, () => []);
  shuffled.forEach((name, i) => teams[i % teamCount].push(name));
  return teams;
}

/**
 * Splits participants across custom named teams.
 */
export function splitIntoCustomNamedTeams(
  participants: string[],
  teamNames: string[]
): CustomNamedTeam[] {
  if (participants.length === 0 || teamNames.length === 0) return [];
  const groups = splitIntoTeams(participants, teamNames.length);
  return teamNames.map((name, i) => ({
    name,
    members: groups[i] || [],
  }));
}

/**
 * Calculates optimal number of teams (K >= 2) for a given target team size.
 */
export function calculateTeamCountFromSize(total: number, targetSize: number): number {
  if (total < 2 || targetSize < 1) return 2;
  const k = Math.round(total / targetSize);
  return Math.min(total, Math.max(2, k));
}

/**
 * Splits an array of names into teams based on target team size.
 */
export function splitTeamsBySize(
  names: string[],
  teamSize: number
): { teams: string[][]; teamCount: number } {
  const k = calculateTeamCountFromSize(names.length, teamSize);
  return {
    teams: splitIntoTeams(names, k),
    teamCount: k,
  };
}

/**
 * Validates the teamCount input against participant count.
 */
export function validateTeamCount(total: number, teamCount: number): ValidationResult {
  if (total < 2) {
    return { valid: false, errorKey: "minParticipants" };
  }
  if (!teamCount || isNaN(teamCount) || teamCount < 2) {
    return { valid: false, errorKey: "invalidTeamCountMin" };
  }
  if (teamCount > total) {
    return {
      valid: false,
      errorKey: "invalidTeamCountMax",
      errorParams: { teams: teamCount, total },
    };
  }
  return { valid: true, errorKey: null };
}

/**
 * Validates the target teamSize input against participant count.
 */
export function validateTeamSize(total: number, teamSize: number): ValidationResult {
  if (total < 2) {
    return { valid: false, errorKey: "minParticipants" };
  }
  if (!teamSize || isNaN(teamSize) || teamSize < 1) {
    return { valid: false, errorKey: "invalidTeamSizeMin" };
  }
  if (teamSize >= total) {
    return {
      valid: false,
      errorKey: "invalidTeamSizeMax",
      errorParams: { size: teamSize, total },
    };
  }
  return { valid: true, errorKey: null };
}

/**
 * Validates the custom team names count against participant count.
 */
export function validateCustomTeamNames(
  totalParticipants: number,
  customTeamNamesCount: number
): ValidationResult {
  if (totalParticipants < 2) {
    return { valid: false, errorKey: "minParticipants" };
  }
  if (customTeamNamesCount < 2) {
    return { valid: false, errorKey: "invalidCustomTeamNamesMin" };
  }
  if (customTeamNamesCount > totalParticipants) {
    return {
      valid: false,
      errorKey: "invalidCustomTeamNamesMax",
      errorParams: { teams: customTeamNamesCount, total: totalParticipants },
    };
  }
  return { valid: true, errorKey: null };
}

/**
 * Checks if a specific team has fewer members than the largest team in the group.
 */
export function isTeamSmaller(team: string[], allTeams: string[][]): boolean {
  if (allTeams.length <= 1) return false;
  const maxSize = Math.max(...allTeams.map((t) => t.length));
  const minSize = Math.min(...allTeams.map((t) => t.length));
  return maxSize > minSize && team.length < maxSize;
}
