import assert from "assert";

const chatURL = process.argv[2];
const text = process.argv[3];

assert(chatURL, "Teams Chat URL is a required");
assert(text, "Message is required");

const body = {
  title: "Ueberschrift",
  type: "AdaptiveCard",
  attachments: [
    {
      contentType: "application/vnd.microsoft.card.adaptive",
      contentUrl: null,
      content: {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.2",
        body: [
          {
            type: "TextBlock",
            size: "Medium",
            weight: "Bolder",
            wrap: "true",
            text,
          },
        ],
      },
    },
  ],
};

console.log(JSON.stringify(body, null, 2));

const response = await fetch(chatURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

assert(response.ok, "❌ ERROR: Notification Failed");
console.log("✅ Teams Notification Successfully Sent");
