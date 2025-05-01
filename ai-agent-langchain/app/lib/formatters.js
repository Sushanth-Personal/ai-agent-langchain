import {
    HumanMessage,
    SystemMessage,
    AIMessage,
  } from "@langchain/core/messages";
  
  
  export function formatMessagesForSummary(messages) {
    return messages
      .filter((m, i) => {
        const type = m._type || m.constructor.name;
        return !(i === 0 && type === "SystemMessage");
      })
      .map((m) => {
        const type = m._type || m.constructor.name;
        if (type === "HumanMessage") return `USER: ${m.content}`;
        if (type === "AIMessage") return `ASSISTANT: ${m.content}`;
        if (type === "SystemMessage") return `SYSTEM: ${m.content}`;
        return "";
      })
      .join("\n")
      .trim();
  }
  
  export function convertMemoryToLangchain(messages, prompt) {
    const result = [new SystemMessage(getSystemPrompt())];
  
    for (const msg of messages) {
      if (msg.role === "user") result.push(new HumanMessage(msg.content));
      else if (msg.role === "assistant") result.push(new AIMessage(msg.content));
    }
  
    result.push(new HumanMessage(prompt));
    return result;
  }
  