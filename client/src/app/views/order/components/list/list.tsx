import * as React from "react";
import * as redux from "redux";

import { Card, CardButton } from "../../../../components/card";
import { Summary, SummaryItem } from "../../../../components/summary";
import { Modal } from "../../../../components/modal";
import { RootState, Order, OrderList, OrderItem } from "../../../../types";

import { EditListModal } from "../edit-list-modal";
import { AddNewItemForm } from "../add-new-item-form";
import { addItemActiveOrder, deleteItemActiveOrder } from "../../../../actions/active-order";

const styles: any = require("./list.css");

interface OwnProps {
    order: Order;
    list: OrderList;
    dispatch: redux.Dispatch<RootState>;
}

interface OwnState {
    addingNew: boolean;
    editingList: boolean;
}

export class List extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);
        this.state = {
            addingNew: false,
            editingList: false
        }

        this._handleAddNewItemSubmit = this._handleAddNewItemSubmit.bind(this);
    }

    public render(): JSX.Element {

        const toPrice = (price: number) => `${price.toFixed(2)} €`;

        const { list, order } = this.props;

        const itemRows = list.items.map(item => {
            const nameElem = (item.href)
                ? <a href={item.href} target="_blank">{item.name}</a>
                : <span>{item.name}</span>;

            return (
                <tr key={item.id}>
                    <td className={styles.nowrap}>{item.price.toFixed(2)} €</td>
                    <td>{item.quantity}</td>
                    <td>{nameElem}</td>
                    <td>
                        <button className={`${styles.actionButton} fa fa-edit`}></button>

                    </td>
                    <td>
                        <button className={`${styles.actionButton} fa fa-trash-o`} onClick={() => this._removeItem(item.id)}></button>
                    </td>
                </tr >
            )
        });

        if (itemRows.length === 0) {
            itemRows.push(
                <tr key={0}>
                    <td className={styles.emptyRow} colSpan={5}>Nada!</td>
                </tr>
            );
        }

        let priceSum = 0;
        let quantitySum = 0;
        list.items.forEach(item => {
            quantitySum += item.quantity;
            priceSum += item.price * item.quantity;
        });

        const cardButtons: CardButton[] = [{
            icon: "plus-circle",
            text: "Add item",
            onClick: () => this.setState({ addingNew: true })
        }, {
            icon: "edit",
            text: "Edit list",
            onClick: () => this.setState({ editingList: true })
        }];

        const usesCurrencyMultiplier = order.currencyMultiplier !== 1;
        const shippingCost = 0;
        const pricePlusCurrencyMultiplierExtra = priceSum * order.currencyMultiplier;
        const currencyExtra = pricePlusCurrencyMultiplierExtra - priceSum;

        const totalSum = pricePlusCurrencyMultiplierExtra + shippingCost;

        return (
            <Card heading={list.name} buttons={cardButtons}>

                <AddNewItemForm
                    visible={this.state.addingNew}
                    onCloseRequest={() => this.setState({ addingNew: false })}
                    list={this.props.list}
                    onSubmit={this._handleAddNewItemSubmit}
                />

                <EditListModal
                    active={this.state.editingList}
                    list={list}
                    onCloseRequest={() => this.setState({ editingList: false })}
                    onSubmit={this._handleEditListSubmit}
                />

                <div className="table-responsive mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Price</th>
                                <th>Qty.</th>
                                <th>Name</th>
                                <th>Edit</th>
                                <th>Del.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemRows}
                        </tbody>
                    </table>
                </div>

                <Summary>
                    <SummaryItem label="Quantity sum" value={`${quantitySum} pieces`} />
                    <SummaryItem label="Items cost sum" value={toPrice(priceSum)} />
                    {usesCurrencyMultiplier && <SummaryItem label="Currency conversion extra" value={toPrice(currencyExtra)} />}
                    <SummaryItem label="Shipping" value={toPrice(shippingCost)} />
                    <SummaryItem label="Total sum" value={toPrice(totalSum)} big={true} />
                </Summary>

            </Card >
        )

    }

    private _handleAddNewItemSubmit(item: OrderItem) {
        const { order, dispatch, list } = this.props;
        dispatch(addItemActiveOrder(order.id, list.id, item));
    }

    private _handleEditListSubmit(remove: boolean, newListName: string) {

    }

    private _removeItem(itemId: number) {
        const { order, dispatch, list } = this.props;
        dispatch(deleteItemActiveOrder(order.id, list.id, itemId));
    }

}