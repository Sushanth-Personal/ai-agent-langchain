"use client";

import { useState, useEffect } from 'react';

type ChatMessage = {
  text: string;
  sender: 'user' | 'bot';
};

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add the user's message
    setMessages(m => [...m, { text: userInput, sender: 'user' }]);
    setUserInput('');
    setIsLoading(true);

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userInput,
        thread_id: threadId, // <-- use existing threadId or null
      }),
    });

    
    const data = await res.json();

    console.log(data.response.kwargs);
    const botText = data.response.kwargs.content || data.error;

    // Save thread_id if it's a new one
    if (data.thread_id && !threadId) {
      setThreadId(data.thread_id);
    }

    // Add the bot's reply
    setMessages(m => [...m, { text: botText, sender: 'bot' }]);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center">
        <div className="w-10 h-10 rounded-full bg-white text-purple-600 flex-center mr-3">
          🤖
        </div>
        <span className="font-bold">LeadBot</span>
      </div>

      <div className="bg-gray-100 p-4 h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`p-3 max-w-xs rounded-lg ${
                m.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="p-3 max-w-xs rounded-lg bg-white text-gray-800">
              Typing…
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center p-4 bg-white border-t border-gray-200">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Type a message…"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 bg-purple-600 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
