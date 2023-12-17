import createDebug from 'debug';

import { BotContext, updateSessionDataBetweenScenes } from '../../BotContext';
import {
    askForProjectDescription,
    handleEditProjectDescriptionFactory,
    makeSceneWithErrorHandling,
    returnToPreviousMenuFactory,
    saveProject,
} from '../../util/scene';

const debug = createDebug('bot:edit_project_description_command');
const previousMenu = 'editProject';

const editProjectDescription = async (ctx: BotContext) => {
    debug('Entered editProjectDescription scene.');
    updateSessionDataBetweenScenes(ctx);
    return ctx.wizard.next();
};

const editProjectDescriptionScene = makeSceneWithErrorHandling(
    'editProjectDescription',
    debug,
    editProjectDescription,
    askForProjectDescription,
    handleEditProjectDescriptionFactory(debug, previousMenu),
    saveProject,
    returnToPreviousMenuFactory(previousMenu),
);

export { editProjectDescriptionScene };
