const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parseBill = async (lines) => {
  const prompt = `
  This is a restaurant bill that might include non-English text. Parse this into a json format of the items, leave out anything that isnt an item

  Input:
  ${lines.join("\n")}

  Output:
  json format containing:
  string 'title' with the bill title (restaurant name etc.)
  array 'items' with every object having the following properties: 
  item // the item name
  amount // if none or null then 1)
  price // the total price
  `;

  console.log("Sending request to OpenAI API...");
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.7,
  });

  console.log("Received response from OpenAI API...");
  return response.choices[0].message.content.trim();
};

module.exports = {
  parseBill,
};
