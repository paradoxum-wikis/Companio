import type { RecapData, DateInfo } from "../types.js";

export type WikiMode = "aew" | "tdsw";

export class RecapService {
	private static availableFiles: Record<WikiMode, Set<string> | null> = {
		aew: null,
		tdsw: null,
	};

	private static getApiBase(wiki: WikiMode) {
		return `https://api.github.com/repos/paradoxum-wikis/automation/contents/data/recap/${wiki}`;
	}
	private static getRawBase(wiki: WikiMode) {
		return `https://raw.githubusercontent.com/paradoxum-wikis/automation/main/data/recap/${wiki}`;
	}

	static isLegacyFormat(wiki: WikiMode, dateString: string): boolean {
		if (wiki === "tdsw") return false;
		return dateString <= "2026-04-12";
	}

	static formatDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	static parseDate(dateString: string): DateInfo {
		const [year, month, day] = dateString.split("-").map(Number);
		return { year, month, day, dateString };
	}

	static formatDisplayDate(dateString: string): string {
		const date = new Date(dateString + "T00:00:00");
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	static addDays(dateString: string, days: number): string {
		const date = new Date(dateString + "T00:00:00");
		date.setDate(date.getDate() + days);
		return this.formatDate(date);
	}

	static subtractDays(dateString: string, days: number): string {
		return this.addDays(dateString, -days);
	}

	private static getCacheKey(wiki: WikiMode, dateString: string): string {
		return `${wiki}-recap-${dateString}`;
	}

	private static getIndexCacheKey(wiki: WikiMode): string {
		return `${wiki}-available-files-v4`;
	}

	private static getCachedData(
		wiki: WikiMode,
		dateString: string,
	): RecapData | null {
		try {
			const cacheKey = this.getCacheKey(wiki, dateString);
			const cached = localStorage.getItem(cacheKey);
			if (!cached) return null;
			return JSON.parse(cached);
		} catch (error) {
			return null;
		}
	}

	private static setCachedData(
		wiki: WikiMode,
		dateString: string,
		data: any,
	): void {
		try {
			localStorage.setItem(
				this.getCacheKey(wiki, dateString),
				JSON.stringify(data),
			);
		} catch (error) {
			this.clearOldestEntries();
		}
	}

	private static clearOldestEntries(): void {
		try {
			const cacheEntries: { key: string; date: string }[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (
					key &&
					(key.startsWith("aew-recap-") || key.startsWith("tdsw-recap-"))
				) {
					cacheEntries.push({ key, date: key });
				}
			}
			const entriesToRemove = Math.ceil(cacheEntries.length * 0.25);
			for (let i = 0; i < entriesToRemove && i < cacheEntries.length; i++) {
				localStorage.removeItem(cacheEntries[i].key);
			}
		} catch (error) {}
	}

	private static async fetchAvailableFiles(
		wiki: WikiMode,
	): Promise<Set<string>> {
		try {
			const indexKey = this.getIndexCacheKey(wiki);
			const cached = localStorage.getItem(indexKey);
			if (cached) {
				const { timestamp, files } = JSON.parse(cached);
				if (Date.now() - timestamp < 1 * 24 * 60 * 60 * 1000) {
					return new Set(files);
				}
			}

			const availableFiles = new Set<string>();
			const rootResponse = await fetch(this.getApiBase(wiki));
			if (!rootResponse.ok)
				throw new Error(`Failed to fetch root: ${rootResponse.status}`);
			const rootData = await rootResponse.json();

			const modernFolders = rootData.filter(
				(i: any) =>
					i.type === "dir" && i.name !== "legacy" && /^\d{4}$/.test(i.name),
			);
			await Promise.all(
				modernFolders.map(async (folder: any) => {
					const res = await fetch(folder.url);
					if (!res.ok) return;
					const data = await res.json();
					data.forEach((item: any) => {
						const match = item.name.match(/^(\d{4}-\d{2}-\d{2})\.json$/);
						if (match) availableFiles.add(match[1]);
					});
				}),
			);

			const legacyFolder = rootData.find((i: any) => i.name === "legacy");
			if (legacyFolder) {
				const legacyRes = await fetch(legacyFolder.url);
				if (legacyRes.ok) {
					const legacyData = await legacyRes.json();
					legacyData.forEach((item: any) => {
						if (item.type === "file") {
							const match = item.name.match(
								/^recap-(\d{4}-\d{2}-\d{2})\.json$/,
							);
							if (match) availableFiles.add(match[1]);
						}
					});

					const legacyYearFolders = legacyData.filter(
						(i: any) => i.type === "dir" && /^\d{4}$/.test(i.name),
					);
					await Promise.all(
						legacyYearFolders.map(async (folder: any) => {
							const res = await fetch(folder.url);
							if (!res.ok) return;
							const data = await res.json();
							data.forEach((item: any) => {
								const match = item.name.match(
									/^recap-(\d{4}-\d{2}-\d{2})\.json$/,
								);
								if (match) availableFiles.add(match[1]);
							});
						}),
					);
				}
			}

			try {
				localStorage.setItem(
					indexKey,
					JSON.stringify({
						timestamp: Date.now(),
						files: Array.from(availableFiles),
					}),
				);
			} catch (e) {}

			return availableFiles;
		} catch (error) {
			return new Set<string>();
		}
	}

	private static async ensureAvailableFiles(wiki: WikiMode): Promise<void> {
		if (!this.availableFiles[wiki]) {
			this.availableFiles[wiki] = await this.fetchAvailableFiles(wiki);
		}
	}

	static async getAvailableDates(wiki: WikiMode): Promise<string[]> {
		await this.ensureAvailableFiles(wiki);
		const files = this.availableFiles[wiki];
		return files ? Array.from(files).sort() : [];
	}

	static async getPreviousDate(
		wiki: WikiMode,
		currentDate: string,
	): Promise<string> {
		const dates = await this.getAvailableDates(wiki);
		if (dates.length === 0) return this.subtractDays(currentDate, 7);
		const prev = [...dates].reverse().find((d) => d < currentDate);
		return prev || this.subtractDays(currentDate, 7);
	}

	static async getNextDate(
		wiki: WikiMode,
		currentDate: string,
	): Promise<string> {
		const dates = await this.getAvailableDates(wiki);
		if (dates.length === 0) return this.addDays(currentDate, 7);
		const next = dates.find((d) => d > currentDate);
		return next || this.addDays(currentDate, 7);
	}

	static async fetchRecapData(
		wiki: WikiMode,
		dateString: string,
	): Promise<any> {
		const cachedData = this.getCachedData(wiki, dateString);
		if (cachedData) return cachedData;

		const { year } = this.parseDate(dateString);
		const isLegacy = this.isLegacyFormat(wiki, dateString);

		try {
			if (isLegacy) {
				const filename = `recap-${dateString}.json`;
				const yearUrl = `${this.getRawBase(wiki)}/legacy/${year}/${filename}`;
				const directUrl = `${this.getRawBase(wiki)}/legacy/${filename}`;

				let response = await fetch(yearUrl);
				if (!response.ok) response = await fetch(directUrl);
				if (!response.ok) throw new Error(`Failed to fetch legacy data`);

				const data = await response.json();
				this.setCachedData(wiki, dateString, data);
				return data;
			} else {
				const summaryUrl = `${this.getRawBase(wiki)}/${year}/${dateString}.json`;
				const rawUrl = `${this.getRawBase(wiki)}/${year}/${dateString}.raw.json`;

				const [summaryRes, rawRes] = await Promise.all([
					fetch(summaryUrl),
					fetch(rawUrl).catch(() => null),
				]);

				if (!summaryRes.ok)
					throw new Error("Failed to fetch modern recap data");

				const summary = await summaryRes.json();
				const rawData = rawRes && rawRes.ok ? await rawRes.json() : [];

				const contributors = Object.entries(summary.counts)
					.map(([name, count]) => {
						const userEvent = rawData.find(
							(e: any) => e.embeds[0]?.author?.name === name,
						);
						const avatar = userEvent?.embeds[0]?.author?.iconURL || "";

						return {
							userName: name,
							userId: "N/A",
							avatar: avatar,
							contributions: count as number,
							isAdmin: false,
						};
					})
					.sort((a, b) => b.contributions - a.contributions);

				const data = {
					isModern: true,
					totalContributors: contributors.length,
					contributors: contributors,
					rawData: rawData,
				};

				this.setCachedData(wiki, dateString, data);
				return data;
			}
		} catch (error) {
			throw error;
		}
	}

	static extractAvatarUrl(avatarSource: string): string {
		const fallbackAvatar =
			"https://vignette.wikia.nocookie.net/messaging/images/1/19/Avatar.jpg";
		if (!avatarSource) return fallbackAvatar;

		let extractedUrl = "";
		if (avatarSource.startsWith("http")) {
			extractedUrl = avatarSource;
		} else {
			const imgMatch = avatarSource.match(/src="([^"]+)"/);
			if (imgMatch && imgMatch[1]) {
				extractedUrl = imgMatch[1];
			} else {
				return fallbackAvatar;
			}
		}

		return extractedUrl.replace(
			/width\/\d+\/height\/\d+/,
			"width/128/height/128",
		);
	}

	static async getCurrentWeekDate(
		wiki: WikiMode,
		forceLatest = false,
	): Promise<string> {
		if (!forceLatest) {
			const urlParams = new URLSearchParams(window.location.search);
			const dateParam = urlParams.get("date");
			if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return dateParam;
		}

		await this.ensureAvailableFiles(wiki);
		const files = this.availableFiles[wiki];
		if (files && files.size > 0) {
			const sortedDates = Array.from(files).sort().reverse();
			return sortedDates[0];
		}
		return this.formatDate(new Date());
	}

	static updateUrlWithDate(dateString: string, wiki: WikiMode): void {
		const url = new URL(window.location.href);
		url.searchParams.set("date", dateString);
		url.searchParams.set("wiki", wiki);
		window.history.pushState({}, "", url.toString());
	}
}
