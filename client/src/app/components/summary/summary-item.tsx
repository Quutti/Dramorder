import * as React from "react";
import * as classNames from "classnames";

const styles: any = require("./summary-item.css");

interface OwnProps {
    label: string;
    value: string;
    big?: boolean;
}

export class SummaryItem extends React.Component<OwnProps, {}> {

    public render(): JSX.Element {

        const { label, value, big } = this.props;

        const valueClasses = classNames({
            [styles.value]: true,
            [styles.valueBig]: big
        });

        return (
            <div className={styles.root}>
                <div className={styles.label}>{label}</div>
                <div className={valueClasses}>{value}</div>
            </div>
        )
    }

}