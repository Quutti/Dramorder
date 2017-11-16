import * as React from "react";
import { MouseEvent } from "react";

export type CheckboxChangeHandler = (value: boolean, name: string) => void;

interface OwnProps {
    label: string;
    name: string;
    onChange: CheckboxChangeHandler;
    value?: boolean;
}

interface OwnState {
    value: boolean;
}

export class Checkbox extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            value: false
        }

        this._handleInputChange = this._handleInputChange.bind(this);
    }

    public render(): JSX.Element {

        const { name, label } = this.props;

        return (
            <div className="form-check">
                <label className="form-check-label">
                    <input
                        className="form-check-input"
                        name={name} type="checkbox"
                        checked={this.state.value}
                        onChange={this._handleInputChange} />
                    {label}
                </label>
            </div>
        );

    }

    public componentWillReceiveProps(newProps: OwnProps) {
        if (this.props.value !== newProps.value) {
            this.setState({ value: newProps.value });
        }
    }

    private _handleInputChange(evt) {
        const checked: boolean = evt.target.checked;
        this.setState({ value: checked });
        this.props.onChange(checked, this.props.name);
    }

}