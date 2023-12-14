import { Scenes, Context } from 'telegraf';
import { Project } from './models/Project';

interface SessionData extends Scenes.WizardSessionData {
    project: Project;
    projectMap: Map<string, number>;
}

interface BotContext extends Context {
    scene: Scenes.SceneContextScene<BotContext, SessionData>;
    wizard: Scenes.WizardContextWizard<BotContext>;
}

function updateSessionDataBetweenScenes(ctx: BotContext): void {
    try {
        const state = ctx.wizard.state as SessionData;
        ctx.scene.session.project = state.project;
        ctx.scene.session.projectMap = state.projectMap;
    } catch (error) {
        throw error;
    }
}

export { BotContext, SessionData, updateSessionDataBetweenScenes };
