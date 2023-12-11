import { Scenes, session, Telegraf } from 'telegraf';
import { BotContext } from './BotContext';
import mongoose from 'mongoose';

import {
    about,
    countMessage,
    viewProject,
    editProject,
    deleteProject,
    addProjectScene,
    viewMainMenuScene,
    generateExistingProjectsScene,
} from './commands';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import {connectToDatabase} from '../db/functions';
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf<BotContext>(BOT_TOKEN);

// Set command suggestions
bot.telegram.setMyCommands([
    {
        command: 'about',
        description: 'About command',
    },
    {
        command: 'start',
        description: 'starts the bot',
    },
]);

const stage = new Scenes.Stage<BotContext>([
    addProjectScene,
    viewMainMenuScene,
    generateExistingProjectsScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.command('about', about());

bot.command('start', (ctx) => ctx.scene.enter('mainMenu'));

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await connectToDatabase();
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
connectToDatabase().catch(console.dir);
