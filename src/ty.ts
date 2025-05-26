import { createConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

interface Count extends RowDataPacket {
  count: number;
}

export async function thank(interaction: any, env: Env): Promise<string> {
  const sender = interaction.member?.user?.id;
  if (!sender) {
    return "Missing sender information";
  }

  const options = interaction.data.options;
  if (!options || options.length < 2) {
    return "Unexpected input";
  }

  let person, message = "";
  for (const option of options) {
    switch (option.name) {
      case "person":
        person = option.value;
        break;
      case "message":
        message = option.value;
        break;
    }
  }

  if (!person || !message) {
    return "Missing person or message";
  }

  const connection = await createConnection({
    host: env.HYPERDRIVE.host,
    user: env.HYPERDRIVE.user,
    password: env.HYPERDRIVE.password,
    database: env.HYPERDRIVE.database,
    port: env.HYPERDRIVE.port,

    // Required to enable mysql2 compatibility for Workers
    disableEval: true,
  });

  let count = 0;
  try {
    // query instead of execute must be used as Hyperdrive does not support prepared statements
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO `thanks` (`sender_id`, `receiver_id`, `message`) VALUES (?, ?, ?)",
      [sender, person, message]
    );

    if (result.affectedRows === 0) {
      return "Failed to record thanks";
    }

    const [countResult] = await connection.query<Count[]>(
      "SELECT COUNT(*) AS count FROM `thanks` WHERE `receiver_id` = ?",
      [person]
    );
    count = countResult[0].count;
  } catch (error) {
    console.error("Database error:", error);
    return "Database error";
  } finally {
    await connection.end();
  }

  if (!count) {
    return `<@${sender}> thanked <@${person}>: "${message}"`;
  }

  return `<@${sender}> thanked <@${person}>: "${message}"
<@${person}> has now been thanked ${count} time${count === 1 ? "" : "s"}!`;
}