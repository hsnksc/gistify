import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createAiRouter } from "../../server/routes/ai";

describe("ai router smoke", () => {
  let server: ReturnType<express.Express["listen"]> | null = null;

  afterEach(async () => {
    if (!server) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      server?.close(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    server = null;
  });

  it("handles translate, image generate, and chart generate flows", async () => {
    const app = express();
    app.use(express.json());
    app.use(
      "/api",
      createAiRouter({
        generateDailyReportOpenAiCharts: async payload => ({
          ok: true,
          sourceId: payload.sourceId,
        }),
        generateOpenAiImage: async payload => ({
          ok: true,
          prompt: payload.prompt,
        }),
        isOpenAiImageStudioConfigured: () => true,
        normalizeDailyReportOpenAiChartGenerateRequest: value => {
          const input =
            value && typeof value === "object"
              ? (value as Record<string, unknown>)
              : {};
          return {
            prompt: typeof input.prompt === "string" ? input.prompt.trim() : "",
            sourceId:
              typeof input.sourceId === "string" ? input.sourceId.trim() : "",
          };
        },
        normalizeOpenAiImageGenerateRequest: value => {
          const input =
            value && typeof value === "object"
              ? (value as Record<string, unknown>)
              : {};
          return {
            prompt: typeof input.prompt === "string" ? input.prompt.trim() : "",
          };
        },
        normalizeString: value => (typeof value === "string" ? value.trim() : ""),
        normalizeTranslationItems: value =>
          Array.isArray(value)
            ? value.filter((item): item is { id: string; text: string; context?: string } =>
                item && typeof item === "object" && "id" in item && "text" in item
              )
            : [],
        normalizeTranslationTexts: value =>
          Array.isArray(value)
            ? value.filter((item): item is string => typeof item === "string")
            : [],
        requireWeeklyReportAdmin: (req, res) => {
          if (req.headers["x-admin"] === "1") {
            return true;
          }

          res.status(401).json({ error: "admin required" });
          return false;
        },
        setPrivateNoStore: res => {
          res.setHeader("Cache-Control", "private, no-store");
        },
        translateTexts: async (texts, _source, _target) =>
          Object.fromEntries(texts.map(text => [text, `${text}-en`])),
      })
    );

    server = app.listen(0);
    await new Promise<void>(resolve => {
      server?.once("listening", () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected an ephemeral TCP port.");
    }

    const translateResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/i18n/translate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "tr",
          target: "en",
          texts: ["Merhaba"],
        }),
      }
    );
    expect(translateResponse.status).toBe(200);
    expect(translateResponse.headers.get("cache-control")).toContain("no-store");
    const translatePayload = (await translateResponse.json()) as {
      translations?: Record<string, string>;
    };
    expect(translatePayload.translations?.Merhaba).toBe("Merhaba-en");

    const imageResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/openai/image-generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin": "1",
        },
        body: JSON.stringify({
          prompt: "  chart prompt  ",
        }),
      }
    );
    expect(imageResponse.status).toBe(200);
    const imagePayload = (await imageResponse.json()) as {
      prompt?: string;
    };
    expect(imagePayload.prompt).toBe("chart prompt");

    const chartResponse = await fetch(
      `http://127.0.0.1:${address.port}/api/admin/daily-report-charts/openai`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin": "1",
        },
        body: JSON.stringify({
          sourceId: "daily-source",
          prompt: "make chart",
        }),
      }
    );
    expect(chartResponse.status).toBe(200);
    const chartPayload = (await chartResponse.json()) as {
      sourceId?: string;
    };
    expect(chartPayload.sourceId).toBe("daily-source");
  });
});
