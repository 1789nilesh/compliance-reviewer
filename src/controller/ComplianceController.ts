import { Request, Response } from "express";
import { complianceService } from "../service/ComplianceService";

class ComplianceController 
{
  public async checkCompliance(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const webUrl = String(req.query.WebUrl);
      const policyUrl = String(req.query.PolicyUrl);

      const response = await complianceService.webContentReviewAgainstPolicy(webUrl, policyUrl);
      res.json({ response });
    } 
    catch (error) 
    {
      res.status(500).json({ error: (error as Error).message || "An unexpected error occurred" });
    }
  }
}

export const complianceController =new ComplianceController();