import { Router, type Response } from "express";
import type { FlowSourcesResponse } from "../../../shared/flow";
import { getFlowReportSourcePackages } from "../../services/flowService";

interface FlowSourcesRouterDependencies {
  setPrivateNoStore: (res: Response) => void;
}

export function createFlowSourcesRouter({
  setPrivateNoStore,
}: FlowSourcesRouterDependencies) {
  const router = Router();

  router.get("/", (_req, res) => {
    setPrivateNoStore(res);

    const payload: FlowSourcesResponse = {
      sources: getFlowReportSourcePackages(),
    };

    res.status(200).json(payload);
  });

  return router;
}
