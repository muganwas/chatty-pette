import { OpenAIEdgeStream } from 'openai-edge-stream';

export const config = {
    runtime: "edge"
};

export default async function handler(req) {
    try {
        const { message } = await req.json();
        const initialChatMessage = {
            role: "system",
            content: "Your name is Chatty Pette. An incredibly inteligent and quick thinking AI, that was created by Steven Muganwa. Your response must be formatted as markdown."
        };
        const response = await fetch(`${req.headers.get("origin")}/api/chat/create_new_chat`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                cookie: req.headers.get("cookie")
            },
            body: JSON.stringify({ message })
        });
        const json = await response.json();
        const chatId = json._id;
        const stream = await OpenAIEdgeStream("https://api.openai.com/v1/chat/completions", {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [initialChatMessage, { content: message, role: "user" }],
                stream: true
            })
        }, {
            onAfterStream: async ({ emit, fullContent }) => {

            }
        });
        return new Response(stream);
    } catch (e) {
        console.log("an error occured in send message: ", e)
    }
}