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

const { initDatabase } = require("./database");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = "1527691904785973290";
const SERVICE_ROLE = "1527730077213659136";

client.once(Events.ClientReady, async () => {

 await initDatabase();
    
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder()
            .setName("setup")
            .setDescription("Créer le panneau Benny's")
            .toJSON()
    ];

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(client.application.id, GUILD_ID),
            { body: commands }
        );

        console.log("✅ Commande /setup enregistrée !");
    } catch (error) {
        console.error(error);
    }
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

            return interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }

    if (interaction.isButton()) {

        if (interaction.customId === "service_on") {

            if (!interaction.member.roles.cache.has(SERVICE_ROLE)) {
                await interaction.member.roles.add(SERVICE_ROLE);
            }

            return interaction.reply({
                content: "🟢 Tu es maintenant en service !",
                ephemeral: true
            });
        }

        if (interaction.customId === "service_off") {

            if (interaction.member.roles.cache.has(SERVICE_ROLE)) {
                await interaction.member.roles.remove(SERVICE_ROLE);
            }

            return interaction.reply({
                content: "🔴 Tu as terminé ton service !",
                ephemeral: true
            });
        }

        if (interaction.customId === "heures") {

            return interaction.reply({
                content: "📊 Le compteur d'heures arrive à l'étape suivante.",
                ephemeral: true
            });
        }

        if (interaction.customId === "staff") {

            const role = interaction.guild.roles.cache.get(SERVICE_ROLE);

            const membres = role.members.map(m => `• ${m.user.username}`);

            return interaction.reply({
                content: membres.length
                    ? `👥 Employés en service :\n\n${membres.join("\n")}`
                    : "👥 Aucun employé n'est actuellement en service.",
                ephemeral: true
            });
        }

    }

});

client.login(TOKEN);
