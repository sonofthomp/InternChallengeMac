import { PROMPT_FORMAT } from "../data/PromptFormat";

export const CLAUDE_ERROR_CODES: Record<string, string> = {
  DATA_FETCH_ERROR: "Failed to fetch data from backend API endpoint",
  INVALID_RESPONSE: "Your prompt produced an invalid (non-CSV) output",
};

export const BACKEND_API_DOMAIN = "https://gabrielezrathompson.pythonanywhere.com/";

export async function getClaudeResponse(prompt: string | keyof typeof CLAUDE_ERROR_CODES) {
  const completePrompt = PROMPT_FORMAT + prompt;
  let resp, returnedObj;

  try {
    resp = await fetch(`${BACKEND_API_DOMAIN}get_claude_resp?prompt=${encodeURIComponent(completePrompt)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return "DATA_FETCH_ERROR";
  }

  try {
    returnedObj = await resp.json();
  } catch (error) {
    return "INVALID_RESPONSE";
  }

  return returnedObj.text;
}

export async function claudeCSVToTable(output: string) {
  try {
    await Excel.run(async (context) => {
      const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
      const lines = output.split("\n");

      for (const line of lines) {
        const lineData = line.split(",");
        if (lineData.length < 3) continue; // Skip past the bad guys

        const cellBolding = lineData[0];
        const cellID = lineData[1];
        const cellVal = lineData.slice(2, lineData.length).join(" ");

        const targettingCell = currentWorksheet.getRange(cellID);
        targettingCell.values = [[cellVal]];
        targettingCell.format.font.bold = cellBolding === "bolded";
      }

      await context.sync();
    });
    return 0;
  } catch (error) {
    return 1;
  }
}
