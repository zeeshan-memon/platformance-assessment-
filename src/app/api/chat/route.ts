import Groq from "groq-sdk";
import FirecrawlApp from '@mendable/firecrawl-js';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

export const maxDuration = 30;

export async function POST(req:Request) {

    const body = await req.json();
    try {
        // Check if the message contains a website URL
        const urlRegex = /https?:\/\/[^\s]+/g;
        // const websiteUrl = message.match(urlRegex)?.[0];
        const content:String = body.message.content; // Get last user message

        // Regex to detect URLs
        const urls = content?.match(urlRegex);
        let websiteContent = "";
        let url = "";
        if (urls) {
            url = urls[0];
        const crawlResult = await app.crawlUrl(url, {
            limit: 10,
            scrapeOptions: {
                formats: [ "markdown" ],
            }
        })
        if (!crawlResult.success) {
            console.error(crawlResult.error);
            return Response.json({ error: crawlResult.error }, {status: 500});
        }
        
        websiteContent =  crawlResult.data[0].markdown?? "";
        }
        // Send the message (with context) to the LLM
        if(websiteContent)
            body.message.content =`Here is content from ${url}:\n\n${websiteContent}\n\nUser's question: ${body.message.content}`;
        
        const completion = await groq.chat.completions
        .create({
          messages: [body.message],
          model: body.model,
        })
      return  Response.json({data: completion}, {
        status: 200,
      })
        } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error }, {status: 500});
        }
    

}