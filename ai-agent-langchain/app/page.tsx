import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4">LangChain Chatbot</h1>
      <Chatbot />
    </main>
  );
}
