import * as React from "react";

const styles: any = require("./card.css");

interface OwnProps {
    heading: string;
}

export class Card extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {
        return (
            <div className={styles.root}>
                <div className={styles.heading}><h2>{this.props.heading}</h2></div>
                <div className={styles.body}>
                    {this.props.children}
                </div>
            </div>
        )
    }

}