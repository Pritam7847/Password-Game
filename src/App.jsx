import { useState, useEffect, useMemo } from "react";

const getToday = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
};

const generateMathExpression = () => {
  const operators = ["+", "-", "*"];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let result;
  switch (operator) {
    case "+": result = num1 + num2; break;
    case "-": result = num1 - num2; break;
    case "*": result = num1 * num2; break;
  }

  return {
    expression: `${num1}${operator}${num2}=${result}`,
    result: result.toString()
  };
};

const riddles = [
  { question: "I’m tall when I’m young, short when I’m old. What am I?", answer: "candle" },
  { question: "What has to be broken before you can use it?", answer: "egg" },
  { question: "The more you take, the more you leave behind. What are they?", answer: "footsteps" }
];

export default function App() {
  const [password, setPassword] = useState("");
  const [solvedRulesCount, setSolvedRulesCount] = useState(0);

  const selectedRiddle = useMemo(() => {
    return riddles[Math.floor(Math.random() * riddles.length)];
  }, []);

  const mathData = useMemo(() => generateMathExpression(), []);

  // ✅ Get current hour dynamically
  const currentHour = new Date().getHours().toString();

  const rules = useMemo(() => [
    { id: 1, text: "At least 8 characters", check: (pwd) => pwd.length >= 8 },
    { id: 2, text: "Contains a number", check: (pwd) => /\d/.test(pwd) },
    { id: 3, text: "Contains an uppercase letter", check: (pwd) => /[A-Z]/.test(pwd) },
    { id: 4, text: "Contains a special character", check: (pwd) => /[!@#$%^&*]/.test(pwd) },
    {
      id: 5,
      text: `Riddle: ${selectedRiddle.question}`,
      check: (pwd) => pwd.toLowerCase().includes(selectedRiddle.answer.toLowerCase())
    },
    {
      id: 6,
      text: `Includes today's day name`,
      check: (pwd) => pwd.toLowerCase().includes(getToday().toLowerCase())
    },
    {
      id: 7,
      text: "Must include current year",
      check: (pwd) => pwd.includes("2025")
    },
    {
      id: 8,
      text: `Include the result of this expression: ${mathData.expression.split("=")[0]}=?`,
      check: (pwd) => pwd.includes(mathData.result)
    },
    {
      id: 9,
      text: "Must include at least one emoji 😎",
      check: (pwd) =>
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F900}-\u{1F9FF}]/u.test(pwd)
    },
    {
      id: 10,
      text: 'Must contain a palindrome (like "madam", "level", or whole password)',
      check: (pwd) => {
        const cleaned = pwd.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleaned.length > 2 && cleaned === cleaned.split("").reverse().join("")) {
          return true;
        }
        for (let i = 0; i < cleaned.length; i++) {
          for (let j = i + 3; j <= cleaned.length; j++) {
            const sub = cleaned.slice(i, j);
            if (sub === sub.split("").reverse().join("")) return true;
          }
        }
        return false;
      }
    },
    {
      id: 11,
      text: `Must include current hour (If time = 21:47 → password must contain "21")`,
      check: (pwd) => pwd.includes(currentHour)
    }
  ], [mathData, selectedRiddle, currentHour]);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].check(password)) count++;
      else break;
    }
    setSolvedRulesCount(count);
  }, [password, rules]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-slate-900 overflow-hidden">
      {/* Aurora Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Game Card */}
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl flex flex-col items-center shadow-2xl w-[28rem] mt-14">
        <h1 className="text-3xl font-bold text-white mb-6">🧠 The Password Game</h1>

        <input
          type="text"
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:border-pink-400"
        />

        <ul className="text-left space-y-3 w-full">
          {rules.slice(0, solvedRulesCount + 1).map((rule) => (
            <li
              key={rule.id}
              className={`p-2 rounded-lg transition duration-500 ${
                rule.check(password)
                  ? "bg-green-500/20 text-green-300 border border-green-400/30"
                  : "bg-red-500/20 text-red-300 border border-red-400/30"
              }`}
            >
              {rule.check(password) ? "✅" : "❌"} {rule.text}
            </li>
          ))}
        </ul>

        {solvedRulesCount === rules.length && (
          <p className="mt-6 text-green-300 font-semibold animate-bounce">
            🎉 You cracked all the rules!
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="relative w-full flex justify-center mt-10 z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-md shadow-md rounded-md py-4 px-4 text-center text-sm text-gray-200">
          Made with ❤️ by{" "}
          <span className="font-semibold text-yellow-300">Pritam Anand</span> <br />
          Inspired from the Trend (17-07-2025)
        </div>
      </footer>
    </div>
  );
}
