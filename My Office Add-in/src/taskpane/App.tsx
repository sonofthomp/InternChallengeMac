import * as React from "react";
import { useState } from "react";
import { PROMPT_FORMAT } from "../data/prompt_format";

const BACKEND_API_DOMAIN = "https://gabrielezrathompson.pythonanywhere.com/";

const CLAUDE_ERROR_CODES: Record<string, string> = {
  DATA_FETCH_ERROR: "Failed to fetch data from backend API endpoint",
  INVALID_RESPONSE: "Your prompt produced an invalid (non-JSON) output",
};

const App: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Function to handle sending the messages
  const sendMessage = async () => {
    if (userInput.trim() === "") return; // Don't send empty messages

    // Add user message to the chat
    const newMessage = { text: userInput, sender: "user" };
    setMessages([...messages, newMessage]);
    setMessages((prevMessages) => [...prevMessages, { text: "Generating", sender: "computer" }]);

    const claudeResp = await getClaudeResponse(userInput);

    setMessages((prevMessages) => prevMessages.slice(0, prevMessages.length - 1));
    if (claudeResp in CLAUDE_ERROR_CODES) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Error: ${CLAUDE_ERROR_CODES[claudeResp]}`, sender: "computer" },
      ]);
      return;
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Successfully got response from Claude! Now updating spreadsheet...", sender: "computer" },
      ]);
    }

    setUserInput("");

    const tableAddRespCode = await claudeCSVToTable(claudeResp);
    if (tableAddRespCode != null) {
      setMessages((prevMessages) => [...prevMessages, { text: "Failed to add to spreadsheet.", sender: "computer" }]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Updated the spreadsheet (starting at A1)!", sender: "computer" },
      ]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "0px 10px 10px 10px",
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p className="text-red-400 text-sm">
          <center>
            Type whatever you want to generate into the spreadsheet in the box below, and it will get displayed on the
            spreadsheet! -Gabriel
          </center>
        </p>

        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...{
                maxWidth: "60%",
                margin: "5px 0",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "16px",
              },
              ...(message.sender === "user"
                ? {
                    backgroundColor: "#5ca7f5",
                    alignSelf: "flex-end", // Aligns user message to the right
                    textAlign: "right",
                  }
                : {
                    backgroundColor: "#e9e9eb",
                    alignSelf: "flex-start", // Aligns other messages to the left
                    textAlign: "left",
                  }),
            }}
          >
            {message.text == "Generating" ? (
              <img
                src="https://cdn.pixabay.com/animation/2024/04/02/07/57/07-57-40-974_512.gif"
                width="65"
                height="50"
              />
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          padding: "10px",
          backgroundColor: "#fff",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "20px",
            padding: "10px 25px 10px 20px",
            backgroundColor: "#0077b6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

async function getClaudeResponse(prompt: string | keyof typeof CLAUDE_ERROR_CODES) {
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

async function claudeCSVToTable(output: string) {
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
  } catch (error) {
    return error;
  }
}

export default App;
