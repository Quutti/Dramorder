import * as React from "react";
import * as classNames from "classnames";

const styles: any = require("./card.css");

export interface CardButton {
    text: string;
    icon: string;
    onClick: () => void;
}

interface OwnProps {
    heading: string;
    buttons?: CardButton[];
}

export class Card extends React.Component<OwnProps, {}> {

    static defaultProps: Partial<OwnProps> = {
        buttons: []
    }

    public render(): JSX.Element {
        return (
            <div className={styles.root}>
                <div className={styles.heading}>
                    <h2>{this.props.heading}</h2>
                </div>
                <div className={styles.body}>
                    {this.props.children}
                </div>
                {this._getFooter()}
            </div>
        )
    }

    private _getFooter() {
        if (this.props.buttons.length === 0) {
            return null;
        }

        const buttons = this.props.buttons.map((btnSchema, index) => {
            const iconClasses = classNames({
                [styles.footerButtonIcon]: true,
                "fa": true,
                [`fa-${btnSchema.icon}`]: true
            });

            return (
                <button key={index} className={styles.footerButton} onClick={btnSchema.onClick}>
                    <span className={iconClasses} />
                    <span className={styles.footerButtonText}>{btnSchema.text}</span>
                </button>
            )
        });

        return <div className={styles.footer}>{buttons}</div>;
    }

}