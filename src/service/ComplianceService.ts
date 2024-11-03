import OpenAI from 'openai';
import { chromium } from "playwright";
import { encoding_for_model } from 'tiktoken';

export class ComplianceService {
    private openai;

    private encoding = encoding_for_model('gpt-4'); 

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    public async webCrawler(url: string): Promise<string> 
    {
        try 
        {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle' });
          
            // Extract text content from the body
            const pageContent = await page.innerText('body');

            await browser.close();
            return pageContent ? pageContent.trim() : "";
        } 
        catch (error) 
        {
            console.error(`Error scraping ${url}:`, (error as Error).message);
            return "";
        }
    }

    private stringSplitter(data: string, tokenLimit: number): string[] 
    {
        let splitDataArray: string[] = [];
        let currentChunk: string = '';

        // Split by sentence
        const sentences = data.split('. ');
        for( const sentence of sentences)
        {
            const sentenceTokenCount = this.countTokens(sentence);
            if (this.countTokens(currentChunk) + sentenceTokenCount > tokenLimit) 
            {
                if (currentChunk.length > 0) 
                {
                    splitDataArray.push(currentChunk.trim());
                }
                // Start a new chunk with the current sentence
                currentChunk = sentence; 
            } else 
            {
                // Add the sentence to the current chunk
                currentChunk += sentence + '. '; 
            }
        }
        splitDataArray.push(currentChunk.trim());
        return splitDataArray;
    }
    public async webContentReviewAgainstPolicy(webUrl: string, policyUrl: string): Promise<string>
    {
        try
        {
            const maxTokenVal = 8192; 
            const bufferForOutput = 1000;
            const policyTokenIteratorVal =2000;// diving policy to subpolicy to handle max token breach

            const webData = await complianceService.webCrawler(webUrl as string);
            const policyData = await complianceService.webCrawler(policyUrl as string);

            const tokenAvailable = maxTokenVal- policyTokenIteratorVal - bufferForOutput;

            const policyUnits = this.stringSplitter(policyData,policyTokenIteratorVal);
            const webDataUnits = this.stringSplitter(webData,tokenAvailable);

            let reviewedResponse ='';
            for(const webData of webDataUnits)
            {
                // iterates over all subpolicies to check for violations
                for(const policy of policyUnits)
                {
                    const subResponse =await this.contentValidatorAgainstPolicy(policy,webData);
                    reviewedResponse +=subResponse;
                }
            }
            if(reviewedResponse.length == 0)
            {
                reviewedResponse ='No non-compliant findings.';
            }
            return reviewedResponse;
        }
        catch(ex)
        {
            throw ex;
        }
    }

    private async  contentValidatorAgainstPolicy(policy: string, content: string): Promise<string>
    {
        try 
        {
            const prompt = `
                You are a compliance checker. Identify sections in the content that do not comply with the provided policy.

                Policy: "${policy}"
                Webpage Content: "${content}"

                Return a list of non-compliant sections, if any.
            `;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }]
            });
            const message = response.choices[0]?.message?.content || '';
            const formattedMessage = message.replace(/\n{2,}/g, '\n');
            return formattedMessage.trim();
        } 
        catch(error) 
        {
            console.error('Error using OpenAI API:', (error as Error).message);
            return "";
        }
    }

    // Function to count tokens in a given text
    private countTokens(text: string): number 
    {
        const tokens = this.encoding.encode(text);
        return tokens.length;
    }
}

export const complianceService = new ComplianceService();