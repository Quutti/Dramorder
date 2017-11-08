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
    name: { label: "Bottle name", required: true },
    price: { label: "Price per unit", validator: validators.numberValidator, required: true },
    quantity: { label: "Quantity", validator: validators.integerValidator, required: true },
    href: { label: "Http/https link to bottle", validator: validators.hrefValidator, required: true }
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
        let saveButtonEnabled = this._allInputsValid();

        const inputs = Object.keys(this.state).map((name, index) => {
            const schema = inputSchema[name];
            const { label, validator, required } = schema;

            return (
                <TextInput
                    key={index}
                    name={name}
                    label={label}
                    onChange={this._handleInputChange}
                    validator={validator}
                    required={required}
                />
            )
        });

        return (
            <form onSubmit={this._handleSubmit}>
                {inputs}
                <div className="text-right">
                    <button className="btn btn-primary" type="submit" disabled={!saveButtonEnabled}>Save</button>
                </div>
            </form>
        )
    }

    private _handleSubmit(evt) {
        evt.preventDefault();
        this.props.onSubmit(this.state);
    }

    private _allInputsValid(): boolean {
        const { name, price, quantity, href } = this.state;

        const nameOk = name !== "";
        const hrefOk = href !== "";
        const priceOk = typeof price === "number" && price > 0;
        const quantityOk = typeof quantity === "number" && price > 0;

        return nameOk && hrefOk && priceOk && quantityOk;
    }

    private _handleInputChange(value: string, name: string) {
        if (["quantity", "price"].indexOf(name) > -1) {
            const intValue = parseInt(value, 10) || 0;
            this.setState({ [name]: intValue } as any);
        } else {
            this.setState({ [name]: value } as any)
        }
    }

}