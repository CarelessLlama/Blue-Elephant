import { Scenes, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

interface BotContext extends Context<Update> {
    counter: number;
  
    scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>;
  
    wizard: Scenes.WizardContextWizard<BotContext>;
}

export { BotContext };