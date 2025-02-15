import axios from 'axios';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export const maxDuration = 30;

export async function POST(req:Request) {

    const body = await req.json();
    try {
        // Check if the message contains a website URL
        const urlRegex = /https?:\/\/[^\s]+/g;
        // const websiteUrl = message.match(urlRegex)?.[0];

        let context = '';
        // if (websiteUrl) {
        //   // Fetch website content using Firecrawl
        //     const firecrawlResponse = await axios.get(`https://api.firecrawl.io/v1/crawl?url=${websiteUrl}`, {
        //     headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}` },
        //     });
        //     context = firecrawlResponse.data.content;
        // }

        // Send the message (with context) to the LLM
        const completion = await groq.chat.completions
        .create({
          messages: body.messages,
          model: body.model,
        })
      console.log(completion.choices[0].message.content);
      return  Response.json({data: completion}, {
        status: 200,
      })
        } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: 'An error occurred while processing your request' }, {status: 500});
        }
    

}