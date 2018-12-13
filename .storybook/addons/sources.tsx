import * as React from 'react';
import addons from '@storybook/addons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';

import styled from 'styled-components';

import { KEY } from '.';

export interface Sources {
    template: string;
    component: string;
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  > pre {
    flex: 1;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    margin: 0;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    &:last-child {
      border: none;
    }
  }
`;

export class SourcesPanel extends React.Component<any, SourcesPanel> {
    unmounted: boolean;
    stopListeningOnStory: any;

    state = {
        template: '',
        component: ''
    };

    onAddHello = (sources: Sources) => {
        this.setState(sources);
    }

    componentDidMount() {
        const { channel, api } = this.props;

        channel.on(KEY, this.onAddHello);

        this.stopListeningOnStory = api.onStory(() => {
            this.onAddHello({ template: '', component: '' });
        });
    }

    render() {
        const { active } = this.props;
        // const

        return active ? (
            <Container>
                <SyntaxHighlighter style={docco}>
                    {this.state.template}
                </SyntaxHighlighter>
                <SyntaxHighlighter style={docco}>
                    {this.state.component}
                </SyntaxHighlighter>
            </Container>
        ) : null;
    }

    componentWillUnmount() {
        if (this.stopListeningOnStory) {
            this.stopListeningOnStory();
        }

        this.unmounted = true;
        const { channel, api } = this.props;
        channel.removeListener(KEY, this.onAddHello);
    }
}

addons.register(KEY, api => {
    addons.addPanel(`${KEY}/Panel`, {
        title: 'Source',
        render: ({ active }) => (
            <SourcesPanel channel={addons.getChannel()} api={api} active={active} />
        )
    });
});