import * as React from "react";
import * as _ from "lodash";
import * as classNames from "classnames";

export type TextInputChangeHandler = (value: string, name: string) => void;

export type TextInputValidator = (value: string) => string;

interface OwnProps {
    label?: string;
    name: string;
    value?: string;
    validator?: TextInputValidator;
    placeholder?: string;
    required?: boolean;
    onChange: TextInputChangeHandler;
    marginBottom?: string | number;
}

interface OwnState {
    value: string;
    errorText: string;
}

export class TextInput extends React.Component<OwnProps, OwnState> {

    private _id: string;

    static defaultProps: Partial<OwnProps> = {
        marginBottom: "1rem",
        placeholder: "",
        label: "",
        value: ""
    }

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

        const { name, label, required, placeholder, marginBottom } = this.props;
        const { value, errorText } = this.state;
        const isInvalid = !!errorText;

        const rootStyles = { marginBottom };

        const inputClasses = classNames({
            "form-control": true,
            "is-invalid": isInvalid
        });

        return (
            <div style={rootStyles}>
                {label && <label htmlFor={this._id}>{label}</label>}
                <input
                    className={inputClasses}
                    type="text"
                    name={name}
                    value={value}
                    id={this._id}
                    placeholder={placeholder}
                    onChange={this._handleOnChange}
                    required={required} />
                {isInvalid && <div className="invalid-feedback">{errorText}</div>}
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

        if (value === this.state.value) {
            return;
        }

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