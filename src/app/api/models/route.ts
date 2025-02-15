import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export const maxDuration = 30;

export async function GET(req:Request) {
    try {
        const models = await groq.models.list();
        let modelsIds= models.data.map((model)=>model.id);
        return  Response.json({models: modelsIds}, {
        status: 200,
        })
        } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: 'An error occurred while processing your request' }, {status: 500});
        }
    

}