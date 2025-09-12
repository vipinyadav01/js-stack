"use client";

import { useEffect, useState } from "react";

const NpmVersion = () => {
	const [version, setVersion] = useState("0.0.0");

	useEffect(() => {
		const getLatestVersion = async () => {
			try {
				const res = await fetch(
					"https://api.github.com/repos/vipinyadav01/create-js-stack-cli/releases",
				);
				if (!res.ok) throw new Error("Failed to fetch version");
				const data = await res.json();
				if (data && Array.isArray(data) && data.length > 0 && data[0]?.tag_name) {
					const latestVersion = data[0].tag_name.replace(/^v/, "");
					setVersion(latestVersion);
				} else {
					throw new Error("No releases found");
				}
			} catch (error) {
				console.error("Error fetching NPM version:", error);
				setVersion("latest");
			}
		};
		getLatestVersion();
	}, []);

	return (
		<div className="mt-2 flex items-center justify-center">
			<span className="mr-2 inline-block h-5 w-3 bg-primary" />
			<span className="text-muted-foreground text-xl">[v{version}]</span>
		</div>
	);
};

export default NpmVersion;

