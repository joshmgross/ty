import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import { AutoRouter, IRequest } from "itty-router";
import { TY_COMMAND } from "./commands";

const router = AutoRouter()

router.get('/', (_request, _env) => {
	return new Response(`👋`);
});

router.post('/', async (request, env) => {
	const interaction = await getInteraction(request, env);
	if (!interaction) {
		return new Response('Unauthorized', { status: 401 });
	}

	switch (interaction.type) {
		case InteractionType.PING:
			return new Response(
				JSON.stringify({ type: InteractionResponseType.PONG }),
				{ headers: { 'Content-Type': 'application/json' } }
			);
		case InteractionType.APPLICATION_COMMAND:
			switch (interaction.data.name.toLowerCase()) {
				case TY_COMMAND.name:
					return new Response(
						JSON.stringify({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: "You're welcome!" } }),
						{ headers: { 'Content-Type': 'application/json' } }
					);
				default:
					return new Response('Unknown command.', { status: 400 });
			}

		default:
			return new Response('Unknown interaction type.', { status: 400 });
	}
});

router.all('*', () => new Response('Not Found.', { status: 404 }));

async function getInteraction(request: IRequest, env: Env): Promise<any | undefined> {
	const signature = request.headers.get('X-Signature-Ed25519');
	const timestamp = request.headers.get('X-Signature-Timestamp');
	if (!signature || !timestamp) {
		return;
	}

	const body = await request.text();
	if (!await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY)) {
		return;
	}

	return JSON.parse(body);
}

export default {
	fetch: router.fetch,
} satisfies ExportedHandler<Env>;
