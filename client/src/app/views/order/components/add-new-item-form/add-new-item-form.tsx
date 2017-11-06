import * as React from "react";
import * as _ from "lodash";

import { OrderItem } from "../../../../types";

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
    price: { label: "Price per unit" },
    quantity: { label: "Quantity", type: "number" },
    href: { label: "Http/https link to bottle" }
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
            const id = _.uniqueId("add-new-item-form");
            const schema = inputSchema[name];
            const { label, type } = schema;
            const inputType = (type) ? type : "text";

            return (
                <div className="form-group" key={index}>
                    <label htmlFor={id}>{label}</label>
                    <input className="form-control" name={name} type={inputType} onChange={this._handleInputChange} />
                </div>
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

    private _handleInputChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

}