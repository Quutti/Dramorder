import * as React from "react";

interface OwnProps {
    className?: string;
}

export class Row extends React.Component<OwnProps, {}> {

    static defaultProps: Partial<OwnProps> = {
        className: ""
    }

    public render(): JSX.Element {

        const classes = [
            "row",
            ...this.props.className.split(" ")
        ].join(" ");

        return <div className={classes}>{this.props.children}</div>
    }

}