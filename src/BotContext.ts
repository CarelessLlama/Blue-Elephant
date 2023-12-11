import { Scenes, Context, session } from 'telegraf';
import { Project } from './models/Project';

interface SessionData extends Scenes.WizardSessionData {
    project: Project;
    projectMap: Map<String, Number>;
}

interface BotContext extends Context {
    scene: Scenes.SceneContextScene<BotContext, SessionData>;

    wizard: Scenes.WizardContextWizard<BotContext>;
}

export { BotContext };
