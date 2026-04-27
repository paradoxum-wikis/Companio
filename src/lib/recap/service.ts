import type { RecapData, DateInfo } from "../../types.js";

export type WikiMode = "aew" | "tdsw";

export class RecapService {
	static readonly fallbackAvatar =
		"https://vignette.wikia.nocookie.net/messaging/images/1/19/Avatar.jpg";
	private static readonly proxyBase = "https://api.tds-editor.com/?url=";
	private static readonly neoUserCacheKey = "recap-neo-users-v1";

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
		return `${wiki}-available-files-v5`;
	}

	// delete later
	private static async mergeStupidAvatars(
		wiki: WikiMode,
		dateString: string,
		data: any,
	): Promise<any> {
		if (
			!data?.isNeo ||
			!Array.isArray(data.contributors) ||
			data.contributors.length === 0
		) {
			return data;
		}
		const names = data.contributors.map(
			(c: { userName: string }) => c.userName,
		);
		const usersByName = await this.fetchNeoUsersByNames(names);
		const contributors = data.contributors.map(
			(c: {
				userName: string;
				userId: string;
				avatar: string;
				contributions: number;
				isAdmin: boolean;
			}) => {
				const info = usersByName.get(c.userName);
				return {
					...c,
					userId: info?.userId ?? c.userId,
					avatar: info?.avatar ?? c.avatar,
				};
			},
		);
		const merged = {
			...data,
			contributors,
			totalContributors: contributors.length,
		};
		this.setCachedData(wiki, dateString, merged);
		return merged;
	}

	private static async fetchNeoUsersByNames(
		userNames: string[],
	): Promise<Map<string, { userId: string; avatar: string }>> {
		if (userNames.length === 0) return new Map();

		const baseUrl = "https://alter-ego.fandom.com";
		const usersByName = new Map<string, { userId: string; avatar: string }>();
		const usersToFetch: string[] = [];
		const chunkSize = 50;
		const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
		const now = Date.now();
		let cache: Record<
			string,
			{ userId: string; avatar: string; cachedAt: number }
		> = {};

		try {
			const raw = localStorage.getItem(this.neoUserCacheKey);
			if (raw) cache = JSON.parse(raw);
		} catch (error) {
			cache = {};
		}

		for (const name of userNames) {
			const cached = cache[name];
			if (cached && now - cached.cachedAt < oneWeekMs) {
				usersByName.set(name, {
					userId: cached.userId,
					avatar: cached.avatar,
				});
			} else {
				usersToFetch.push(name);
			}
		}

		for (let i = 0; i < usersToFetch.length; i += chunkSize) {
			const batch = usersToFetch.slice(i, i + chunkSize);
			const usersUrl = `${baseUrl}/api.php?action=query&list=users&ususers=${encodeURIComponent(batch.join("|"))}&format=json`;
			const proxiedUsersUrl = `${this.proxyBase}${encodeURIComponent(usersUrl)}`;

			try {
				const usersResponse = await fetch(proxiedUsersUrl, {
					credentials: "omit",
				});
				if (!usersResponse.ok) continue;
				const usersData = await usersResponse.json();
				const users = usersData?.query?.users;
				if (!Array.isArray(users)) continue;

				const idToName = new Map<string, string>();
				for (const user of users) {
					if (
						typeof user?.name === "string" &&
						typeof user?.userid === "number"
					) {
						idToName.set(String(user.userid), user.name);
					}
				}

				const ids = Array.from(idToName.keys());
				if (ids.length === 0) continue;

				const detailsUrl = `${baseUrl}/wikia.php?controller=UserApi&method=getDetails&ids=${ids.join(",")}&format=json`;
				const proxiedDetailsUrl = `${this.proxyBase}${encodeURIComponent(detailsUrl)}`;
				const detailsResponse = await fetch(proxiedDetailsUrl, {
					credentials: "omit",
				});
				if (!detailsResponse.ok) continue;
				const detailsData = await detailsResponse.json();
				const items = detailsData?.items;
				if (!Array.isArray(items)) continue;

				for (const item of items) {
					if (
						typeof item?.user_id === "number" &&
						typeof item?.avatar === "string"
					) {
						const userId = String(item.user_id);
						const name =
							(typeof item?.name === "string" && item.name) ||
							idToName.get(userId);
						if (!name) continue;

						cache[name] = {
							userId,
							avatar: item.avatar,
							cachedAt: now,
						};
						usersByName.set(name, {
							userId,
							avatar: item.avatar,
						});
					}
				}
			} catch (error) {
				continue;
			}
		}

		try {
			localStorage.setItem(this.neoUserCacheKey, JSON.stringify(cache));
		} catch (error) {}

		return usersByName;
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

			const neoFolders = rootData.filter(
				(i: any) =>
					i.type === "dir" && i.name !== "legacy" && /^\d{4}$/.test(i.name),
			);
			await Promise.all(
				neoFolders.map(async (folder: any) => {
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
		if (cachedData) {
			if (cachedData.isNeo) {
				return this.mergeStupidAvatars(wiki, dateString, cachedData);
			}
			return cachedData;
		}

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

				if (!summaryRes.ok) throw new Error("Failed to fetch neo recap data");

				const summary = await summaryRes.json();
				const rawData = rawRes && rawRes.ok ? await rawRes.json() : [];
				const names = Object.keys(summary.counts || {});
				const usersByName = await this.fetchNeoUsersByNames(names);

				const contributors = Object.entries(summary.counts)
					.map(([name, count]) => {
						const userInfo = usersByName.get(name);
						const userId = userInfo?.userId || "N/A";
						const avatar = userInfo?.avatar || RecapService.fallbackAvatar;

						return {
							userName: name,
							userId: userId,
							avatar: avatar,
							contributions: count as number,
							isAdmin: false,
						};
					})
					.sort((a, b) => b.contributions - a.contributions);

				const data = {
					isNeo: true,
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
		if (!avatarSource) return this.fallbackAvatar;

		let extractedUrl = "";
		if (avatarSource.startsWith("http")) {
			extractedUrl = avatarSource;
		} else {
			const imgMatch = avatarSource.match(/src="([^"]+)"/);
			if (imgMatch && imgMatch[1]) {
				extractedUrl = imgMatch[1];
			} else {
				return this.fallbackAvatar;
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
