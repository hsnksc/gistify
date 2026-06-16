import crypto from "node:crypto";
import { Router, type Request, type Response } from "express";
import type { DailyReportRecord, FlowReportComment } from "../../../shared/dailyReports";
import type {
  FlowCommentsResponse,
  FlowReportCommentCreateRequestBody,
} from "../../../shared/flow";
import { PUBLIC_ACCESS_USER_ID } from "../../../shared/flow";
import { getViewerFlowReportById } from "../../services/flowService";

interface CommentAuthPayload {
  authenticated: boolean;
  user: {
    id: string;
    name: string;
    picture?: string;
  } | null;
}

interface FlowCommentsRouterDependencies {
  setPrivateNoStore: (res: Response) => void;
  getPublishedReports: () => DailyReportRecord[];
  listCommentsByReportId: (reportId: string) => FlowReportComment[];
  createComment: (comment: FlowReportComment) => void;
  readAuthPayload: (req: Request) => CommentAuthPayload;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function requireCommentActor(
  req: Request,
  res: Response,
  readAuthPayload: FlowCommentsRouterDependencies["readAuthPayload"]
) {
  const payload = readAuthPayload(req);

  if (!payload.authenticated || !payload.user) {
    res.status(401).json({ error: "Yorum yazmak icin uye girisi gerekli." });
    return null;
  }

  if (payload.user.id === PUBLIC_ACCESS_USER_ID) {
    res.status(403).json({
      error: "Public access oturumlari yorum yazamaz.",
      code: "AUTHENTICATION_REQUIRED",
    });
    return null;
  }

  return payload.user;
}

export function createFlowCommentsRouter({
  setPrivateNoStore,
  getPublishedReports,
  listCommentsByReportId,
  createComment,
  readAuthPayload,
}: FlowCommentsRouterDependencies) {
  const router = Router({ mergeParams: true });

  router.get("/", (req, res) => {
    setPrivateNoStore(res);
    const reportId = normalizeString(
      (req.params as { reportId?: string }).reportId
    );

    const report = getViewerFlowReportById(getPublishedReports(), reportId);

    if (!report) {
      res.status(404).json({ error: "Flow report bulunamadi." });
      return;
    }

    const payload: FlowCommentsResponse = {
      comments: listCommentsByReportId(report.id),
    };

    res.status(200).json(payload);
  });

  router.post("/", (req, res) => {
    setPrivateNoStore(res);

    const actor = requireCommentActor(req, res, readAuthPayload);
    if (!actor) {
      return;
    }
    const reportId = normalizeString(
      (req.params as { reportId?: string }).reportId
    );

    const report = getViewerFlowReportById(getPublishedReports(), reportId);

    if (!report) {
      res.status(404).json({ error: "Flow report bulunamadi." });
      return;
    }

    const body =
      req.body && typeof req.body === "object"
        ? (req.body as FlowReportCommentCreateRequestBody)
        : {};
    const commentBody = normalizeString(body.body);

    if (commentBody.length < 2) {
      res.status(400).json({ error: "Yorum en az 2 karakter olmali." });
      return;
    }

    if (commentBody.length > 1200) {
      res.status(400).json({ error: "Yorum 1200 karakteri gecemez." });
      return;
    }

    const nowIso = new Date().toISOString();
    const comment: FlowReportComment = {
      id: crypto.randomUUID(),
      reportId: report.id,
      userId: actor.id,
      userName: actor.name,
      userPicture: actor.picture,
      body: commentBody,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    createComment(comment);
    res.status(201).json({ comment });
  });

  return router;
}
