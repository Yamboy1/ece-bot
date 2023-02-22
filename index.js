import { Client, Events, GatewayIntentBits } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import dotenv from "dotenv";
import rolesData from "./roles.json" assert { type: "json" };
import { ActionRowBuilder, SelectMenuBuilder } from "@discordjs/builders";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", () => {
  console.log("Bot is ready!");
});

const commands = [
  {
    name: "role",
    description: "Displays the role picker for the Discord server",
  },
];

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

try {
  await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
    body: commands,
  });

  console.log("Slash commands registered!");
} catch (error) {
  console.error(error);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "role") {
    const roles = rolesData.map((role) => ({
      label: role.name,
      value: role.id,
      description: role.description,
    }));

    const rolePickerEmbed = {
      title: "Select a role",
      description: "Click on the button to select a role",
    };

    await interaction.reply({
      embeds: [rolePickerEmbed],
      components: [
        new ActionRowBuilder().addComponents(
          new SelectMenuBuilder()
            .setCustomId("role-picker")
            .setPlaceholder("Select a role")
            .addOptions(roles)
        ),
      ],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === "role-picker") {
    const selectedRoles = interaction.values;
    const memberRoles = interaction.member.roles.cache;
    const rolesToAdd = selectedRoles.filter(
      (roleId) => !memberRoles.has(roleId)
    );
    const rolesToRemove = memberRoles
      .filter(
        (role) =>
          rolesData.find((r) => r.id === role.id) &&
          !selectedRoles.includes(role.id)
      )
      .map((role) => role.id);

    await interaction.member.roles.add(rolesToAdd);
    await interaction.member.roles.remove(rolesToRemove);

    const addedRoles = rolesData.filter((role) => rolesToAdd.includes(role.id));
    const removedRoles = rolesData.filter((role) =>
      rolesToRemove.includes(role.id)
    );

    let message = "";
    if (addedRoles.length > 0) {
      message += `Added the following role${
        addedRoles.length === 1 ? "" : "s"
      }: ${addedRoles.map((role) => role.name).join(", ")}\n`;
    }

    if (removedRoles.length > 0) {
      message += `Removed the following role${
        removedRoles.length === 1 ? "" : "s"
      }: ${removedRoles.map((role) => role.name).join(", ")}`;
    }

    if (message === "") {
      message = "No changes were made to your roles";
    }

    await interaction.reply({ content: message, ephemeral: true });
  }
});

client.login(DISCORD_TOKEN);
