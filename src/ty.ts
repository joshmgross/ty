import { createConnection, ResultSetHeader } from "mysql2/promise";

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

  try {
    // query instead of execute must be used as Hyperdrive does not support prepared statements
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO thanks (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [sender, person, message]
    );

    if (result.affectedRows === 0) {
      return "Failed to record thanks";
    }
  } catch (error) {
    console.error("Database error:", error);
    return "Database error";
  } finally {
    await connection.end();
  }
  return `<@${sender}> thanked <@${person}>: ${message}`;
}