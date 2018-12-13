import addons, { makeDecorator } from '@storybook/addons';

export const KEY = 'DEMO_SOURCES';

export const withSource = makeDecorator({
    name: 'withSources',
    skipIfNoParametersOrOptions: false,
    wrapper: (getStory, context) => {
        const channel = addons.getChannel();
        const story = getStory(context);
        channel.emit(KEY, story.component.sources);
        return story;
    }
});
