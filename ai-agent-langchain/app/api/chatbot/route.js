import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { getSystemPrompt } from "@/lib/prompts";
import { readMemory, writeMemory } from "@/lib/memory";
import { summarizeConversation } from "@/lib/summarizer";
import { formatMessagesForSummary } from "@/lib/formatters";
import { chatModel } from "@/lib/chatModel";
import { emailTool } from "@/tools/sendMail";

// Bind email tool to model
const modelWithTools = chatModel.bind({
  tools: [emailTool],
});

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const {
      prompt: userPrompt,
      thread_id,
      max_tokens_per_message = 100,
      max_total_tokens = 1300,
      memory_window = 5,
    } = body;

    if (!userPrompt || typeof userPrompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid prompt" },
        { status: 400 }
      );
    }

    const threadId = thread_id || uuidv4();
    const memory = await readMemory();
    const past = memory[threadId] || [];

    const messages = [new SystemMessage(getSystemPrompt())];

    for (const msg of past) {
      if (msg.role === "user")
        messages.push(new HumanMessage(msg.content));
      else if (msg.role === "assistant")
        messages.push(new AIMessage(msg.content));
    }

    messages.push(new HumanMessage(userPrompt));
    console.log("Latest message sent to LLM:", messages);

    // Use the tool-bound model
    const response = await modelWithTools.invoke(messages);
    const finalResponse = response.output || response;

    console.log(finalResponse);

    // Check if the model wants to call any tools (email tool in this case)
    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        if (toolCall.name === "send_email") {
          const { to, subject, textContent } = toolCall.args;

          // Call the sendEmail function manually when the model decides to send the email
          const emailResponse = await emailTool.func({
            to,
            subject,
            textContent,
          });

          console.log("Email sent:", emailResponse);

          // Mark email tool execution as completed in the conversation history
          const emailExecutionMessage = {
            role: "assistant",
            content: `Email sent successfully to ${to}.`,
          };

          // Add this message to memory and to past conversation history
          past.push(emailExecutionMessage);

          // Save the updated history to memory
          memory[threadId] = past;
          await writeMemory(memory);

          console.log("Email execution message saved to memory.");

          // Add the email execution message to the final response content
          finalResponse.content = emailExecutionMessage.content;

          // Return the updated final response including the email execution message
          return NextResponse.json({
            response: finalResponse,
            thread_id: threadId,
          });
        }
      }
    }

    // Update memory with optional summarization
    const inputTokens =
      finalResponse?.response_metadata?.tokenUsage?.totalTokens || 0;

    console.log(inputTokens, max_total_tokens);
    let updatedThread;

    if (inputTokens > max_total_tokens) {
      const summaryInput = formatMessagesForSummary(messages);
      const summary = await summarizeConversation(summaryInput);

      const summaryText =
        typeof summary === "string"
          ? summary
          : summary?.content || "Summary could not be generated.";

      const summaryMessage = {
        role: "user",
        content: `CONVERSATION SUMMARY: ${summaryText}`,
      };

      const lastPair = past
        .slice(-1)
        .filter(
          (msg) =>
            !(
              msg.role === "user" &&
              msg.content.startsWith("CONVERSATION SUMMARY:")
            )
        );

      updatedThread = [
        summaryMessage,
        ...lastPair,
        { role: "user", content: userPrompt },
        { role: "assistant", content: finalResponse.content },
      ];
    } else {
      const updatedHistory = [
        ...past,
        { role: "user", content: userPrompt },
        { role: "assistant", content: finalResponse.content },
      ];

      const shouldWindow =
        updatedHistory.length > memory_window * 2 + 1;
      const first = updatedHistory[0];
      const withSummary =
        first.role === "user" &&
        first.content.startsWith("CONVERSATION SUMMARY:");

      updatedThread = shouldWindow
        ? withSummary
          ? [first, ...updatedHistory.slice(-memory_window * 2)]
          : updatedHistory.slice(-memory_window * 2)
        : updatedHistory;
    }

    memory[threadId] = updatedThread;
    await writeMemory(memory);

    return NextResponse.json({
      response: finalResponse,
      thread_id: threadId,
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
