const {
    Client,
    GatewayIntentBits,
    Events,
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Teste le bot")
            .toJSON()
    ];

    try {
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        await rest.put(
            Routes.applicationCommands(client.application.id),
            { body: commands }
        );

        console.log("✅ Commande enregistrée !");
    } catch (err) {
        console.error(err);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("🏎️ Le bot Benny's fonctionne !");
    }
});

client.login(process.env.TOKEN);
