import type * as Chart from "$lib/components/ui/chart/index";

export const timelineChartConfig = {
	edits: { label: "Edits", color: "var(--chart-1)" },
} satisfies Chart.ChartConfig;

export const hourChartConfig = {
	edits: { label: "Edits", color: "var(--chart-2)" },
} satisfies Chart.ChartConfig;

export const pageChartConfig = {
	edits: { label: "Edits", color: "var(--chart-3)" },
} satisfies Chart.ChartConfig;

const KNOWN_NS = [
	"MediaWiki",
	"User",
	"File",
	"Template",
	"Category",
	"Help",
	"Talk",
	"Template talk",
	"User talk",
	"Module",
];

export function buildAnals(rawData: any[]) {
	if (!rawData?.length) return null;

	const hourCounts = Array(24).fill(0);
	const isoDateCounts: Record<string, number> = {};
	const nsCounts: Record<string, number> = {};
	const pageCounts: Record<string, number> = {};
	let totalAdded = 0,
		totalRemoved = 0;
	let typeEdit = 0,
		typeNew = 0,
		typeUpload = 0,
		typeRemoval = 0;

	for (const entry of rawData) {
		const d = new Date(entry.timestamp);
		hourCounts[d.getHours()]++;

		const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		isoDateCounts[iso] = (isoDateCounts[iso] || 0) + 1;

		const embed = entry.embeds?.[0];
		if (!embed) continue;
		const title: string = embed.title || "";

		// Edit type
		const isBlank =
			embed.description === "Blanked the page" ||
			(embed.fields || []).some((f: any) => f.value === "Blanking");
		if (title.startsWith("Uploaded")) typeUpload++;
		else if (title.includes("(N!)")) typeNew++;
		else if (isBlank) typeRemoval++;
		else typeEdit++;

		// Namespace
		let ns = "Main";
		if (title.startsWith("Uploaded")) {
			ns = "File";
		} else {
			const colon = title.indexOf(":");
			if (colon > 0) {
				const candidate = title.substring(0, colon);
				if (KNOWN_NS.includes(candidate)) ns = candidate;
			}
		}
		nsCounts[ns] = (nsCounts[ns] || 0) + 1;

		// Page name
		const cleanTitle = title
			.replace(/^Uploaded (?:a new version of )?/, "")
			.replace(/\s*\(\s*(?:\(N!\)\s+)?[+-]?\d+\s*\)\s*$/, "")
			.trim();
		if (cleanTitle) pageCounts[cleanTitle] = (pageCounts[cleanTitle] || 0) + 1;

		// Byte
		const m = title.match(/\(\s*(?:\(N!\)\s+)?([+-]?\d+)\s*\)\s*$/);
		if (m) {
			const n = parseInt(m[1]);
			if (!isNaN(n)) {
				if (n > 0) totalAdded += n;
				else if (n < 0) totalRemoved += Math.abs(n);
			}
		}
	}

	// Chart data
	const timelineData = Object.entries(isoDateCounts)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([iso, edits]) => ({
			day: new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
			edits,
		}));

	const hourChartData = hourCounts.map((edits, i) => ({
		hour: `${i.toString().padStart(2, "0")}h`,
		edits,
	}));

	const nsEntries = Object.entries(nsCounts).sort((a, b) => b[1] - a[1]);
	const nsChartData = nsEntries.map(([ns, count], i) => ({
		ns,
		count,
		color: `var(--chart-${(i % 5) + 1})`,
	}));
	const nsChartConfig = {
		count: { label: "Edits" },
		...Object.fromEntries(
			nsEntries.map(([ns], i) => [
				ns,
				{ label: ns, color: `var(--chart-${(i % 5) + 1})` },
			]),
		),
	} as Chart.ChartConfig;

	const editTypeData = [
		{ type: "Edit", count: typeEdit, color: "var(--chart-1)" },
		{ type: "New Page", count: typeNew, color: "var(--chart-2)" },
		{ type: "Upload", count: typeUpload, color: "var(--chart-3)" },
		{ type: "Delete", count: typeRemoval, color: "var(--chart-4)" },
	].filter((d) => d.count > 0);
	const editTypeConfig = {
		count: { label: "Count" },
		...Object.fromEntries(
			editTypeData.map((d) => [d.type, { label: d.type, color: d.color }]),
		),
	} as Chart.ChartConfig;

	const topPagesRaw = Object.entries(pageCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8);
	const pageChartData = topPagesRaw.map(([page, edits]) => ({
		page: (page.includes(":") ? page.split(":").slice(1).join(":") : page)
			.replace(/\s*\(.*\)$/, "")
			.trim()
			.slice(0, 22),
		fullPage: page,
		edits,
	}));

	return {
		timelineData,
		hourChartData,
		nsChartData,
		nsChartConfig,
		editTypeData,
		editTypeConfig,
		pageChartData,
		totalAdded,
		totalRemoved,
		netChange: totalAdded - totalRemoved,
		total: rawData.length,
	};
}

export type Analytics = NonNullable<ReturnType<typeof buildAnals>>;
