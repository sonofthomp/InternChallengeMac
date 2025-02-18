Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    // This is for assigning event handlers (not using it at the moment)
  }
});

async function createTable() {
  await Excel.run(async (context) => {
    const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
    const expensesTable = currentWorksheet.tables.add("A1:D1", true /*hasHeaders*/);
    expensesTable.name = "ExpensesTable";

    expensesTable.getHeaderRowRange().values = [["Date", "Merchant", "Category", "Amount"]];

    expensesTable.rows.add(null /*add at the end*/, [
      ["1/1/2017", "The Phone Company", "Communications", "120"],
      ["1/2/2017", "Northwind Electric Cars", "Transportation", "142.33"],
      ["1/5/2017", "Best For You Organics Company", "Groceries", "27.9"],
      ["1/10/2017", "Coho Vineyard", "Restaurant", "33"],
      ["1/11/2017", "Bellows College", "Education", "350.1"],
      ["1/15/2017", "Trey Research", "Other", "135"],
      ["1/15/2017", "Best For You Organics Company", "Groceries", "97.88"],
    ]);

    expensesTable.columns.getItemAt(3).getRange().numberFormat = [["\u20AC#,##0.00"]];
    expensesTable.getRange().format.autofitColumns();
    expensesTable.getRange().format.autofitRows();

    await context.sync();
  });
}

/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
  try {
    await callback();
  } catch (error) {
    // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
    console.error(error);
  }
}

function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatBox = document.getElementById("chat");
  const userText = inputField.value.trim();

  if (!userText) return;

  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.textContent = userText;
  chatBox.appendChild(userMessage);

  setTimeout(() => {
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = getClaudeReply(userText);
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 500);

  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
