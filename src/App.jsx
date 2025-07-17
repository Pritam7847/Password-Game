import { useState, useEffect, useMemo } from 'react';

const getToday = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

const generateMathExpression = () => {
  const operators = ['+', '-', '*'];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let result;
  switch (operator) {
    case '+': result = num1 + num2; break;
    case '-': result = num1 - num2; break;
    case '*': result = num1 * num2; break;
  }

  return {
    expression: `${num1}${operator}${num2}=${result}`,
    result: result.toString()
  };
};

export default function App() {
  const [password, setPassword] = useState("");
  const [solvedRulesCount, setSolvedRulesCount] = useState(0);

  const mathData = useMemo(() => generateMathExpression(), []);
  const rules = useMemo(() => [
    { id: 1, text: 'At least 8 characters', check: (pwd) => pwd.length >= 8 },
    { id: 2, text: 'Contains a number', check: (pwd) => /\d/.test(pwd) },
    { id: 3, text: 'Contains an uppercase letter', check: (pwd) => /[A-Z]/.test(pwd) },
    { id: 4, text: 'Contains a special character', check: (pwd) => /[!@#$%^&*]/.test(pwd) },
    {
      id: 5,
      text: 'Includes all letters missing from "jumpwizardflexbot"',
      check: (pwd) => ['c', 'n', 'h', 'y'].every(letter => pwd.toLowerCase().includes(letter))
    },
    {
      id: 6,
      text: `Includes today's day name`,
      check: (pwd) => pwd.toLowerCase().includes(getToday().toLowerCase())
    },
    {
      id: 7,
      text: 'Must include current year',
      check: (pwd) => pwd.includes('2025')
    },
    {
      id: 8,
      text: `Include the result of this expression: ${mathData.expression.split('=')[0]}=?`,
      check: (pwd) => pwd.includes(mathData.result)
    },
    {
      id: 9,
      text: 'Must include at least one emoji 😎',
      check: (pwd) =>
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F900}-\u{1F9FF}]/u.test(pwd)
    }
  ], [mathData]);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].check(password)) count++;
      else break;
    }
    setSolvedRulesCount(count);
  }, [password, rules]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-green-100 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">🧠 The Password Game</h1>

        <div className="bg-red-300 p-4 rounded-xl flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-80 mb-4"
          />

          <ul className="text-left space-y-3 w-80 transition-all">
            {rules.slice(0, solvedRulesCount + 1).map((rule) => (
              <li
                key={rule.id}
                className={`p-2 rounded transition-opacity duration-500 ease-in-out ${
                  rule.check(password)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {rule.check(password) ? '✅' : '❌'} {rule.text}
              </li>
            ))}
          </ul>

          {solvedRulesCount === rules.length && (
            <p className="mt-6 text-black-600 font-semibold">
              🎉 You cracked all the rules!
            </p>
          )}
        </div>
      </div>
          <div className="w-full flex justify-center mt-10">
  <footer className="bg-gray-800 w-full max-w-md shadow-md rounded-md py-4 px-4">
    <div className="text-center text-sm text-white">
      Made with ❤️ by <span className="font-semibold text-yellow-300">Pritam Anand</span> <br />
      Inspired from the Trend (17-07-2025)
    </div>
  </footer>
</div>
</div>

  );
}
