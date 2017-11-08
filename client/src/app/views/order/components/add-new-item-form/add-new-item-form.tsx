import * as React from "react";

import { OrderItem } from "../../../../types";
import * as validators from "../../../../helpers/text-input-validators";

import { TextInput, TextInputValidator } from "../../../../components/text-input";

export type AddNewItemFormSubmitHandler = (item: OrderItem) => void;

interface OwnProps {
    onSubmit: AddNewItemFormSubmitHandler;
}

interface OwnState {
    name: string;
    price: number;
    quantity: number;
    href: string;
}

const inputSchema = {
    name: { label: "Bottle name" },
    price: { label: "Price per unit", validator: validators.numberValidator },
    quantity: { label: "Quantity", validator: validators.integerValidator },
    href: { label: "Http/https link to bottle", validator: validators.hrefValidator }
}

export class AddNewItemForm extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            price: 0,
            quantity: 1,
            href: ""
        }

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    public render(): JSX.Element {

        const inputs = Object.keys(this.state).map((name, index) => {
            const schema = inputSchema[name];
            const { label, validator } = schema;

            return (
                <TextInput
                    key={index}
                    name={name}
                    label={label}
                    onChange={this._handleInputChange}
                    validator={validator}
                />
            )
        });

        return (
            <form onSubmit={this._handleSubmit}>
                {inputs}
                <div>
                    <button className="btn btn-primary" type="submit">Save</button>
                </div>
            </form>
        )
    }

    private _handleSubmit(evt) {
        evt.preventDefault();
        this.props.onSubmit(this.state);
    }

    private _handleInputChange(value: string, name: string) {
        this.setState({
            [name]: value
        } as any)
    }

}