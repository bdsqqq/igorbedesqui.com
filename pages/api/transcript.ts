import type { NextApiRequest, NextApiResponse } from "next";
import { YoutubeTranscript } from "youtube-transcript";

type SupportedPlatforms = "yt";

function extractQueryParam(req: NextApiRequest, key: string): string | undefined {
	const value = req.query[key];
	if (Array.isArray(value)) return value[0];
	return value as string | undefined;
}

function segmentsToPlainText(segments: { text: string }[]): string {
	return segments
		.map((s) => s.text)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		// Supported query shapes:
		// /api/transcript?yt=<idOrUrl>&lang=en&format=text
		const yt = extractQueryParam(req, "yt");
		const lang = extractQueryParam(req, "lang") || "en";
		const format = (extractQueryParam(req, "format") || "text").toLowerCase();

		let platform: SupportedPlatforms | undefined;
		if (yt) platform = "yt";

		if (!platform) {
			return res.status(400).json({
				error: "Missing platform parameter. Use ?yt=<videoIdOrUrl>.",
			});
		}

		if (!yt) {
			return res.status(400).json({ error: "Missing 'yt' parameter (video id or URL)." });
		}

		if (platform === "yt") {
			const segments = await YoutubeTranscript.fetchTranscript(yt, { lang });
			if (!segments || segments.length === 0) {
				return res.status(404).json({ error: "Transcript not found." });
			}

			if (format === "json") {
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				return res.status(200).json({ segments });
			}

			const text = segmentsToPlainText(segments as { text: string }[]);
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			return res.status(200).send(text);
		}

		return res.status(400).json({ error: "Unsupported platform." });
	} catch (error: any) {
		const message = error?.message || "Unknown error";
		return res.status(500).json({ error: message });
	}
}

