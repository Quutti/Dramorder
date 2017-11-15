import * as React from "react";
import * as classNames from "classnames";

const styles: any = require("./modal.css");

export interface ModalButton {
    text: string;
    onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
    primary?: boolean;
    disabled?: boolean;
}

interface OwnProps {
    heading: string;
    onCloseRequest: () => void;
    buttons?: ModalButton[];
    visible: boolean;
}

interface OwnState {
    visible: boolean;
    closing: boolean;
}

export class Modal extends React.Component<OwnProps, OwnState> {

    static defaultProps: Partial<OwnProps> = {
        buttons: []
    }

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            closing: false
        };

        this._close = this._close.bind(this);
        this._handleTransitionEnd = this._handleTransitionEnd.bind(this);
    }

    public render(): JSX.Element {

        const { visible, closing } = this.state;

        const rootClasses = classNames({
            [styles.root]: true,
            [styles.rootVisible]: visible || closing
        });

        const shroudClasses = classNames({
            [styles.shroud]: true,
            [styles.shroudVisible]: visible && !closing
        });

        const modalClasses = classNames({
            [styles.modal]: true,
            [styles.modalVisible]: visible && !closing
        })

        const buttons = this.props.buttons.map((btn, index) => {

            const btnClasses = classNames({
                "btn": true,
                "btn-default": !btn.primary,
                "btn-primary": btn.primary
            })

            return (
                <button key={index} disabled={btn.disabled} className={btnClasses} onClick={btn.onClick}>{btn.text}</button>
            )
        });

        return (
            <div className={rootClasses}>
                <div className={shroudClasses} onClick={this._close} onTransitionEnd={this._handleTransitionEnd} />
                <div className={modalClasses}>
                    <div className={styles.header}>
                        <h2>{this.props.heading}</h2>
                        <button onClick={this._close} className={styles.closeButton}>&times;</button>
                    </div>
                    <div className={styles.body}>
                        {this.props.children}
                    </div>
                    <div className={styles.footer}>{buttons}</div>
                </div>
            </div>
        );
    }

    public componentWillReceiveProps(newProps: OwnProps) {
        if (newProps.visible !== this.props.visible) {
            this.setState({ visible: newProps.visible })
        }
    }

    private _close() {
        this.setState({ closing: true });
        this.props.onCloseRequest();
    }

    private _handleTransitionEnd() {
        this.setState({ closing: false });
    }

}