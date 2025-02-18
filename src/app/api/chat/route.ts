import Groq from "groq-sdk";
import FirecrawlApp from "@mendable/firecrawl-js";
import {pool} from "../../../lib/db"
import {verifyJwt} from "../../../lib/auth"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function POST(req: Request) {
  const body = await req.json();
  const { message, model, chatId, title } = body;
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  try {
    let websiteContent = "";
    if (!token) {
      return Response.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyJwt(token); // Verifies the token and decodes it (e.g., userId)
    if(!decoded){
      console.log('Unauthorized request')
      return Response.json({ error: 'Unauthorized request' }, { status: 401 });
    }

    // Detect URLs
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = message.content?.match(urlRegex);
    const url = urls?.[0] || "";

    if (url) {
      const crawlResult = await app.crawlUrl(url, {
        limit: 10,
        scrapeOptions: { formats: ["markdown"] },
      });

      if (!crawlResult.success) {
        console.error(crawlResult.error);
        return Response.json({ error: crawlResult.error }, { status: 500 });
      }

      websiteContent = crawlResult.data[0].markdown ?? "";
      message.content = `Here is content from ${url}:\n\n${websiteContent}\n\nUser's question: ${message.content}`;
    }
    const chat_id = chatId || message.chatId;
    // Store new chat if it doesn't exist
    if (!chatId) {
      await pool.query(
        'INSERT INTO chats(id, title, userid) VALUES($1, $2, $3) RETURNING id',
        [chat_id, title, decoded.userid]);
    }

    await pool.query(
      'INSERT INTO messages(chatid, role, content) VALUES($1, $2, $3) RETURNING chatid',
      [message.chatId, message.role, message.content]
    )

    // Generate response from Groq
    const completion = await groq.chat.completions.create({
      messages: [{content:message.content, role: message.role}],
      model: model,
      stream: true,
      user:decoded.userid
    });

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    let accumulatedResponse = "";

    async function streamResponse() {
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || "";
        accumulatedResponse += content;
        await writer.write(encoder.encode(content));
      }

      await pool.query(
        'INSERT INTO messages(chatid, role, content) VALUES($1, $2, $3) RETURNING chatid',
        [message.chatId, 'assistant', accumulatedResponse]
      )
  
      writer.close();
    }

    streamResponse();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error }, { status: 500 });
  }
}


export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const chatId = searchParams.get('chatId');
  
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  try {
    // Token verification
    if (!token) {
      return Response.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyJwt(token); // Verifies the token and decodes it (e.g., userId)
    if(!decoded){
      return Response.json({ error: 'Unauthorized request' }, { status: 401 });
    }
    let result;

    // If chatId is provided, fetch the specific chat with messages
    if (chatId) {
      result = await pool.query(
        'SELECT c.*, m.* FROM chats c LEFT JOIN messages m ON c.id = m.chatid WHERE c.id = $1',
        [chatId]
      );
    } else {
      // If chatId is not provided, fetch all chats with their messages
      result = await pool.query(
        'SELECT * FROM chats where userid = $1', [decoded?.userid]
      );
    }

    return Response.json({ response: result.rows }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error || 'Internal Server Error' }, { status: 500 });
  }
}
