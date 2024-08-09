"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Chat() {
    const user = useAuth();
    const router = useRouter();

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello, I'm the HeartSpeak Assistant. How can I help you today?",
        },
    ]);

    const [message, setMessage] = useState("");
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user === null) {
            router.push("/auth/signin");
        }
    }, [user, router]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        // Add user message to the chat
        setMessages((messages) => [
            ...messages,
            {
                role: "user",
                content: message,
            },
            {
                role: "assistant",
                content: "Typing...",
            },
        ]);
        setMessage("");

        // Fetch AI response from the Next.js API route
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: message,
        }).then(async (res) => {
            const text = await res.text();

            setMessages((messages) => {
                let lastMessage = messages[messages.length - 1];
                let otherMessages = messages.slice(0, messages.length - 1);
                return [
                    ...otherMessages,
                    { ...lastMessage, content: text },
                ];
            });
        });
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col w-full max-w-lg h-3/4 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                        >
                            <div
                                className={`p-4 rounded-lg max-w-xs ${message.role === "assistant"
                                    ? "bg-blue-100 text-blue-900"
                                    : "bg-green-100 text-green-900"
                                    } shadow-md`}
                            >
                                <p className="whitespace-pre-wrap text-lg font-medium">{message.content.toString()}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
                <div className="flex p-4 border-t bg-gray-50">
                    <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button
                        type="button"
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}
