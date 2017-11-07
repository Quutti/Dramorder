import * as React from "react";
import * as _ from "lodash";
import * as classNames from "classnames";

export type TextInputChangeHandler = (value: string, name: string) => void;

export type TextInputValidator = (value: string) => string;

interface OwnProps {
    label: string;
    name: string;
    value?: string;
    validator?: TextInputValidator;
    onChange: TextInputChangeHandler;
}

interface OwnState {
    value: string;
    errorText: string;
}

export class TextInput extends React.Component<OwnProps, OwnState> {

    private _id: string;

    constructor(props) {
        super(props);

        this.state = {
            value: "",
            errorText: ""
        }

        this._id = _.uniqueId("text-input");

        this._handleOnChange = this._handleOnChange.bind(this);
    }

    public render(): JSX.Element {

        const { name, label } = this.props;

        const rootClasses = classNames({
            "form-group": true,
            "has-danger": !!this.state.errorText
        });

        const inputClasses = classNames({
            "form-control": true,
            "form-control-danger": !!this.state.errorText
        });

        return (
            <div className={rootClasses}>
                <label htmlFor={this._id}>{label}</label>
                <input
                    className={inputClasses}
                    type="text"
                    name={name}
                    value={this.state.value}
                    id={this._id}
                    onChange={this._handleOnChange} />
            </div>
        )
    }

    public componentWillReceiveProps(newProps: OwnProps) {
        if (this.props.value !== newProps.value) {
            this.setState({ value: newProps.value });
        }
    }

    private _handleOnChange(evt) {

        const { value, name } = evt.target;

        const errorText = (this.props.validator)
            ? this.props.validator(value)
            : "";

        this.setState({
            value: evt.target.value,
            errorText
        });

        this.props.onChange(
            (errorText) ? "" : value,
            name
        );
    }

}