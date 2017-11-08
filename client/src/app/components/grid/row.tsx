import * as React from "react";

export class Row extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return <div className="row">{this.props.children}</div>
    }

}