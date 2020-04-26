#!/usr/bin/env node

require('dotenv').config();
const Table = require("cli-table");

const getLatestFile = require("./lib/get-latest");
const processBudgetFile = require("./lib/process-budget-file");

const FOLDER_PATH = process.env.ISAVEMONEY_BACKUP_PATH;

async function main() {
  try {
    const filePath = getLatestFile(FOLDER_PATH);

    if (!filePath) {
      console.error("No files in target folder");
      return;
    }

    const data = await processBudgetFile(filePath);
    const months = Object.keys(data);

    if (months.length === 0) {
      console.error("Budget file is empty");
      return;
    }

    const categories = Object.keys(data[months[0]]);
    const table = new Table({
      head: ["Month", ...categories],
    });

    Object.keys(data).forEach((month) => {
      table.push([
        month,
        ...categories.map(
          (cat) =>
            `${Math.floor(data[month][cat].expenses)} / ${Math.floor(
              data[month][cat].budget
            )}\n${Math.floor(
              data[month][cat].budget - data[month][cat].expenses
            )}`
        ),
      ]);
    });

    console.log(table.toString());
  } catch (error) {
    console.error(error.message);
    return {};
  }
}

main();
