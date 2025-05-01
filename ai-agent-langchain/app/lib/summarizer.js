
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { formatMessagesForSummary } from "@/lib/formatters";
import { getSummaryPrompt } from "@/lib/prompts";



export async function summarizeConversation(conversation) {
  const input = Array.isArray(conversation)
    ? formatMessagesForSummary(conversation)
    : typeof conversation === "string"
    ? conversation
    : (() => {
        throw new Error("Invalid conversation format");
      })();
console.log("To be summarized", input);
  const summaryResult = await chatModel.invoke([
    new SystemMessage(getSummaryPrompt()),
    new HumanMessage(input),
  ]);

  return summaryResult.output || summaryResult;
}
