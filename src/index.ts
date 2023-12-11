import { session, Telegraf, Context } from 'telegraf';
import mongoose from 'mongoose';

import { about, countMessage } from './commands';
import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { Project } from '../db/schema/project';
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

interface SessionData {
  counter: number
}

interface BotContext extends Context {
  session?: SessionData
}


const bot = new Telegraf<BotContext>(BOT_TOKEN);

// Set command suggestions
bot.telegram.setMyCommands([
  {
    command: 'about',
    description: 'About command',
  },
  {
    command: 'count',
    description: 'Count command',
  }
]);

bot.use(session());

bot.command('count', countMessage());
bot.command('about', about());
bot.on('message', greeting());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  // connect to MongoDB
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  await mongoose.connect(dbUri);
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
// console.log(BOT_TOKEN);