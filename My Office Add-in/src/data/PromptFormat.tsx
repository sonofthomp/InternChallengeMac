export const PROMPT_FORMAT = `I'm going to give you a prompt for an excel spreadsheet and I want you to tell me the value for each of the cells of the sheets.

The following 12 lines are an example output for a table of peoples' first names, last names and ages:
bolded,A1,First name
bolded,B1,Last name
bolded,C1,Age
unbolded,A2,Gabriel
unbolded,B2,Thompson
unbolded,C2,19
unbolded,A3,Micah
unbolded,B3,Muttiah
unbolded,C3,17
unbolded,A4,Denis
unbolded,B4,Li Ping Kam
unbolded,C4,21

You should put Excel formulas in when necessary. For example, if one cell needs to be the sum of B1:B5, that item should be set to "=SUM(B1:B5)" instead of the hard value of it.

You can decide on what the best way to organize the data is if the user is unspecific.

DO NOT put anything in the output except for the data - no heading or closing paragraph please.

Here is your prompt: `;

// export const PROMPT_FORMAT = `I want you to output a two-item array to represent the cells in an Excel table given a prompt which I will later show. We'll say that this output table has height m and width n.

// In the first item of the output array, I want you to write a 1D array of strings to represent the header of each column. These will be shown in cells A1:n1 where n is the letter for the width.

// In the second item of the output array, I want you to write a 2D array of string to represent the content of the cells in the table (not including the header). These will be shown in cells B1:n(m+1).

// IMPORTANT NOTE: you should put Excel formulas in when necessary. For example, if one cell needs to be the sum of B1:B5, that item should be set to "=SUM(B1:B5)"

// What I want you to do is to print the entire array. DON'T print anything except for the array

// Prompt: `;
