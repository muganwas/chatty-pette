import { OpenAIEdgeStream } from 'openai-edge-stream';

export const config = {
    runtime: "edge"
};

export default async function handler(req) {
    try {
        const { chatId: chatIdFromParam, message } = await req.json();
        let chatId = chatIdFromParam;
        const initialChatMessage = {
            role: "system",
            content: "Your name is Chatty Pette. An incredibly inteligent and quick thinking AI, that was created by Steven Muganwa. Your response must be formatted as markdown."
        };
        let newChat = false;
        let chatMessages = [];
        if (!!chatId) {
            const response = await fetch(`${req.headers.get("origin")}/api/chat/add_message_to_chat`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    cookie: req.headers.get("cookie")
                },
                body: JSON.stringify({ chatId, role: "user", content: message })
            });
            const json = await response.json();
            chatMessages = json.chat.messages || [];
        } else {
            const response = await fetch(`${req.headers.get("origin")}/api/chat/create_new_chat`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    cookie: req.headers.get("cookie")
                },
                body: JSON.stringify({ message })
            });
            const json = await response.json();
            chatId = json._id;
            newChat = true;
            chatMessages = json.messages || [];
        }

        const messagesToInclude = [];
        chatMessages.reverse();
        let usedTokens = 0;
        for (let chatMessage of chatMessages) {
            const messageTokens = chatMessage.content.length / 4;
            usedTokens = usedTokens + messageTokens;
            if (usedTokens <= 1200) {
                messagesToInclude.push(chatMessage);
            } else {
                break;
            }
        }

        messagesToInclude.reverse();

        const stream = await OpenAIEdgeStream("https://api.openai.com/v1/chat/completions", {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [initialChatMessage, ...messagesToInclude],
                stream: true
            })
        }, {
            onBeforeStream: ({ emit }) => {
                if (newChat)
                    emit(chatId, "newChatId");
            },
            onAfterStream: async ({ emit, fullContent }) => {
                await fetch(`${req.headers.get("origin")}/api/chat/add_message_to_chat`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        cookie: req.headers.get("cookie")
                    },
                    body: JSON.stringify({
                        chatId,
                        role: "assistant",
                        content: fullContent
                    })
                })
            }
        });
        return new Response(stream);
    } catch (e) {
        console.log("an error occured in send message: ", e)
    }
}