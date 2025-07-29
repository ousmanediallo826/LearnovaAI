import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const baseConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
        ],
    },
    webpack(config) {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "@": path.resolve(__dirname),
        };
        return config;
    },
};

const { experimental, ...cleanedConfig } = baseConfig;

const sentryWebpackOptions = {
    org: "learnovaai",
    project: "javascript-nextjs",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    disableLogger: true,
    automaticVercelMonitors: true,
};

export default withSentryConfig(cleanedConfig, sentryWebpackOptions);
