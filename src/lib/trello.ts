export async function createTrelloCard({
  name,
  desc,
  listId,
}: {
  name: string;
  desc: string;
  listId: string;
}) {
  const url = `https://api.trello.com/1/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idList: listId,
      name,
      desc,
    }),
  });

  return res.json();
}
