import { Response, Request } from "express";


class HealthController
{
    public async Health(req: Request, res: Response)
    {
        let response;
        try
        {
            
            response = 
            { 
                Code: 1,
                Payload :{
                    Time: Date.now() 
                }
            };
            res.send(response);
            return;
        }
        catch (ex)
        {

            res.status(500).send(response);
            return;
        }
    }
}

export const controller = new HealthController();
