import * as React from "react";

interface OwnProps {
    fluid?: boolean;
    className?: string;
}

export class Container extends React.Component<OwnProps, {}> {

    static defaultProps: Partial<OwnProps> = {
        fluid: false,
        className: ""
    }

    public render(): JSX.Element {

        const classes = [
            (this.props.fluid) ? "container-fluid" : "container",
            ...this.props.className.split(" ")
        ].join(" ");

        return <div className={classes}>{this.props.children}</div>
    }

}