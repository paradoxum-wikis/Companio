import type { Contributor } from "$lib/types";

export const palette = [
	"#FF1744",
	"#00E676",
	"#2979FF",
	"#FFD600",
	"#F50057",
	"#00B8D4",
	"#FF9100",
	"#C51162",
	"#76FF03",
	"#D500F9",
	"#FF3D00",
	"#64DD17",
	"#304FFE",
	"#FFEA00",
	"#00BFAE",
	"#AA00FF",
];

export function getPaletteColor(i: number) {
	return palette[i % palette.length];
}

export function getUserProfileUrl(
	userName: string,
	wikiMode: "aew" | "tdsw",
	weekDate?: string,
): string {
	if (wikiMode === "tdsw" && (!weekDate || weekDate >= "2026-09-14")) {
		return `https://tds.wiki/w/User:${encodeURIComponent(userName)}`;
	}
	const base =
		wikiMode === "tdsw"
			? "https://tds.fandom.com/wiki/User:"
			: "https://alter-ego.fandom.com/wiki/User:";
	return `${base}${encodeURIComponent(userName)}`;
}

export function getContributionTitle(contributor: Contributor): string {
	const relevant = Number(contributor.contributions) || 0;
	if (!contributor.hasRelevantContributions) {
		return `${contributor.userName} (${relevant.toLocaleString()})`;
	}

	const total = Number(
		contributor.totalContributions ?? contributor.contributions,
	);
	return `${contributor.userName} (${relevant.toLocaleString()} (${total.toLocaleString()}))`;
}

export function countUp(node: HTMLElement, target: string | number) {
	const n = Number(target);
	if (isNaN(n) || n === 0) return;
	let cur = 0;
	const inc = Math.max(1, Math.ceil(n / 30));
	const t = setInterval(() => {
		cur += inc;
		if (cur >= n) {
			node.textContent = n.toString();
			clearInterval(t);
		} else node.textContent = cur.toString();
	}, 20);
	return {
		destroy() {
			clearInterval(t);
		},
	};
}
