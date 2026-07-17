const {
    Client,
    GatewayIntentBits,
    Events,
    REST,
    Routes,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const GUILD_ID = "1527691904785973290";

client.once(Events.ClientReady, async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder()
            .setName("setup")
            .setDescription("Créer le panneau Benny's")
            .toJSON()
    ];

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    await rest.put(
        Routes.applicationGuildCommands(client.application.id, GUILD_ID),
        { body: commands }
    );

    console.log("✅ Commande /setup enregistrée !");
});

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "setup") {

            const embed = new EmbedBuilder()
                .setColor("#d10000")
                .setTitle("🚗 Benny's Original Motor Works")
                .setDescription(
`Bienvenue dans le système de service.

Clique sur un bouton ci-dessous.`
                );

            const row = new ActionRowBuilder().addComponents(

                new ButtonBuilder()
                    .setCustomId("service_on")
                    .setLabel("Prendre mon service")
                    .setEmoji("🟢")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("service_off")
                    .setLabel("Fin de service")
                    .setEmoji("🔴")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("heures")
                    .setLabel("Mes heures")
                    .setEmoji("📊")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("staff")
                    .setLabel("En service")
                    .setEmoji("👥")
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }

    if (interaction.isButton()) {

        if (interaction.customId === "service_on")
            return interaction.reply({ content: "🟢 Service commencé !", ephemeral: true });

        if (interaction.customId === "service_off")
            return interaction.reply({ content: "🔴 Service terminé !", ephemeral: true });

        if (interaction.customId === "heures")
            return interaction.reply({ content: "📊 Tu as actuellement 0 heure.", ephemeral: true });

        if (interaction.customId === "staff")
            return interaction.reply({ content: "👥 Aucun employé en service.", ephemeral: true });

    }

});

client.login(process.env.TOKEN);
