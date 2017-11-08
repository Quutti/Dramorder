import * as React from "react";

interface OwnProps {
    fluid?: boolean;
}

export class Container extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {
        const classes = (this.props.fluid) ? "container-fluid" : "container";
        return <div className={classes}>{this.props.children}</div>
    }

}