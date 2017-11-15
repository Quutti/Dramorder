import * as React from "react";

const styles: any = require("./summary.css");

export class Summary extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return <div className={styles.root}>{this.props.children}</div>
    }

}