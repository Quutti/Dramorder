import * as React from "react";

import { OrderList } from "../../../../types";
import { AddNewItemForm } from "../add-new-item-form";

interface OwnProps {
    currencyMultiplier: number;
    list: OrderList;
}

interface OwnState {
    addingNew: boolean;
}

export class List extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);
        this.state = {
            addingNew: false
        }
    }

    public render(): JSX.Element {

        const { list } = this.props;

        const itemRows = list.items.map(item => {
            return (
                <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price.toFixed(2)} €</td>
                    <td>{item.quantity}</td>
                    <td>
                        {item.href && <a href={item.href} target="_blank">Link</a>}
                    </td>
                </tr>
            )
        });

        let priceSum = 0;
        let quantitySum = 0;
        list.items.forEach(item => {
            quantitySum += item.quantity;
            priceSum += item.price * item.quantity;
        });

        const withCurrencyExtra = priceSum * this.props.currencyMultiplier;
        const currencyExtra = withCurrencyExtra - priceSum;

        return (
            <div>
                <h2>{list.name}</h2>
                <button className="btn btn-default" onClick={() => this.setState({ addingNew: true })}>Add item</button>
                {this.getAddItemContainer()}
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td>
                                    <div>{currencyExtra.toFixed(2)} €</div>
                                    <div>{withCurrencyExtra.toFixed(2)} €</div>
                                </td>
                                <td>{quantitySum}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        )

    }

    public getAddItemContainer() {
        if (!this.state.addingNew) {
            return null;
        }

        return <AddNewItemForm onSubmit={(item) => console.log(item)} />

    }

}