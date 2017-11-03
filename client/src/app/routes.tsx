import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

/* Views */
import { HomeView } from './views/home';


export class Routes extends React.Component<{}, {}> {

    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Switch>
                <Route exact path="/" component={HomeView} />
            </Switch>
        );
    }
}