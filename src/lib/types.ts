import type { Analytics } from "$lib/recap/analytics";

export interface Contributor {
	userName: string;
	userId: string;
	avatar: string;
	profileUrl: string;
	userContactPage: string;
	isAdmin: boolean;
	isCurrent: boolean;
	contributions: string | number;
	totalContributions?: number;
	hasRelevantContributions?: boolean;
	latestRevision: string | null;
	index: number;
}

export interface RecapData {
	totalContributors: number;
	contributors: Contributor[];
	isNeo?: boolean;
	analytics?: Analytics | null;
}

export interface DateInfo {
	year: number;
	month: number;
	day: number;
	dateString: string;
}

export interface BattleStats {
	userId: string;
	userTag: string;
	wins: number;
	losses: number;
	totalBattles: number;
	winRate: number;
	weightedScore: number;
	lastCasualBattleAt?: string;
	rankedWins: number;
	rankedLosses: number;
	rankedTotalBattles: number;
	rankedWinRate: number;
	rankedWeightedScore: number;
	lastRankedBattleAt?: string;
}

export interface BattleRecord {
	battleId: string;
	winnerId: string;
	winnerTag: string;
	loserId: string;
	loserTag: string;
	battleDate: string;
	turns: number;
	winnerHpRemaining: number;
	winnerMaxHp: number;
	isRanked: boolean;
	guildId?: string;
}

export interface TourneyCombatant {
	userId: string;
	tag: string;
	displayName: string;
}

export interface TourneyGame {
	gameIndex: number;
	winnerId: string;
	loserId: string;
	turns: number;
	scores: Record<string, TourneyScore>;
	playedAt: string;
}

export interface TourneyScore {
	damageDealt: number;
	hpRemaining: number;
	maxHp: number;
}

export interface TourneyBet {
	userId: string;
	pickId: string;
}

export interface TourneyRef {
	userId: string;
	tag: string;
	displayName: string;
}

export interface TourneyRefPick {
	userId: string;
	refIndex: number;
	subgroup: number;
	arcana: string;
}

export interface TourneySeries {
	id: string;
	round: string;
	subgroup?: number;
	conference?: "exo" | "two_x";
	slotA?: number;
	slotB?: number;
	feedsFrom?: string[];
	fighterAId: string | null;
	fighterBId: string | null;
	winsNeeded: number;
	wins: Record<string, number>;
	games: TourneyGame[];
	bets: TourneyBet[];
	status: "ready" | "in_progress" | "complete" | "pending";
	refIds: string[];
	betsClosedAt?: string;
	winnerId?: string | null;
}

export interface TourneyAwards {
	tournamentChampion: string;
	exoChampion: string;
	twoXChampion: string;
	manOfTheTournament: string;
	refOfTheTournament: string;
	gamblingAddict: string;
}

export interface TourneyLogEntry {
	at: string;
	kind: string;
	detail?: Record<string, unknown>;
}

export interface TournamentData {
	id: string;
	guildId: string;
	createdAt: string;
	updatedAt: string;
	phase: "active" | "complete" | "aborted";
	combatants: TourneyCombatant[];
	referees: TourneyRef[];
	refPicks: TourneyRefPick[];
	slots: string[];
	series: TourneySeries[];
	motScores: Record<string, number>;
	betPoints: Record<string, number>;
	refGamesOfficiated: Record<string, number>;
	log: TourneyLogEntry[];
	currentSeriesId?: string;
}

export interface TourneyLog {
	version: number;
	active: Record<string, unknown>;
	history: TournamentData[];
}
