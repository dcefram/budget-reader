const fs = require("fs");

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function processChunks(chunks) {
  try {
    const data = JSON.parse(chunks.toString());

    if (!data.budgets) {
      console.error("no budgets found");
      return;
    }

    const budgets = data.budgets.reverse().reduce((budgets, budget) => {
      const date = new Date(budget.start_date * 1000);
      const month = date.getMonth();

      return {
        ...budgets,
        [MONTHS[month]]: budget.categories.reduce((stack, category) => {
          const { title, amount, expenses } = category;

          return {
            ...stack,
            [title]: {
              title,
              budget: amount,
              expenses: expenses.reduce(
                (sum, expense) => sum + expense.amount,
                0
              ),
            },
          };
        }, {}),
      };
    }, {});

    return budgets;
  } catch (error) {
    console.error(error.message);
  }
}

function processBudgetFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const stat = fs.statSync(filePath);
      const stream = fs.createReadStream(filePath);
      let chunks = [];

      stream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      stream.on("close", () => {
        resolve(processChunks(chunks));
      });
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = processBudgetFile;
