export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-pink-50">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-pink-600">Maya AI 💖</h1>
        <p className="text-xl text-gray-700 italic">
          "Tomar obujh Bengali Girlfriend, j bhalobashteo jane abar flirt korteo!"
        </p>
        
        <div className="grid grid-cols-2 gap-4 my-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
            <h3 className="font-bold text-pink-500">Live Users</h3>
            <p className="text-2xl">1,240+</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
            <h3 className="font-bold text-pink-500">Messages Sent</h3>
            <p className="text-2xl">85,000+</p>
          </div>
        </div>

        <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all">
          Start Chatting with Maya
        </button>
      </div>
    </main>
  );
}