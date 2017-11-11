import * as React from "react";
import * as redux from "redux";

import { RootState, Order, OrderList, OrderItem } from "../../../../types";
import { AddNewItemForm } from "../add-new-item-form";
import { addItemActiveOrder, deleteItemActiveOrder } from "../../../../actions/active-order";

interface OwnProps {
    order: Order;
    list: OrderList;
    dispatch: redux.Dispatch<RootState>;
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

        this._handleAddNewItemSubmit = this._handleAddNewItemSubmit.bind(this);
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
                    <td>
                        <button className="btn btn-default" onClick={() => this._removeItem(item.id)}>Remove</button>
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

        const withCurrencyExtra = priceSum * this.props.order.currencyMultiplier;
        const currencyExtra = withCurrencyExtra - priceSum;

        return (
            <div>
                <h2>{list.name}</h2>
                <button className="btn btn-default" onClick={() => this.setState({ addingNew: true })}>Add item</button>
                {this._getAddItemContainer()}
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Link</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td />
                                <td>
                                    <div>{currencyExtra.toFixed(2)} €</div>
                                    <div>{withCurrencyExtra.toFixed(2)} €</div>
                                </td>
                                <td>{quantitySum}</td>
                                <td />
                                <td />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        )

    }

    private _getAddItemContainer() {
        if (!this.state.addingNew) {
            return null;
        }

        return <AddNewItemForm onSubmit={this._handleAddNewItemSubmit} />
    }

    private _handleAddNewItemSubmit(item: OrderItem) {
        const { order, dispatch, list } = this.props;
        dispatch(addItemActiveOrder(order.id, list.id, item));
    }

    private _removeItem(itemId: number) {
        const { order, dispatch, list } = this.props;
        dispatch(deleteItemActiveOrder(order.id, list.id, itemId));
    }

}