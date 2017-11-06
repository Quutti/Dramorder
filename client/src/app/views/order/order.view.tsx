import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import { RouteComponentProps } from "react-router-dom";

import { fetchActiveOrder, loginActiveOrder } from "../../actions/active-order";
import { RootState, PrunedOrder, Order } from "../../types";

import { LoginForm } from "./components/login-form";
import { List } from "./components/list";

interface StoreProps {
    orderInfo: PrunedOrder;
    order: Order;
    isFetching: boolean;
    dispatch?: redux.Dispatch<RootState>
}

type MergedProps = StoreProps & RouteComponentProps<any>;

const mapStateToProps = (state: RootState, ownProps: MergedProps): StoreProps => {
    let orderInfo = null;
    const orderId = parseInt(ownProps.match.params.orderId, 10);
    if (orderId) {
        for (let info of state.orderList.orders) {
            if (info.id === orderId) {
                orderInfo = info;
            }
        }
    }

    const { activeOrder } = state;
    const order = (activeOrder.order && activeOrder.order.id === orderId) ? state.activeOrder.order : null;

    return {
        isFetching: state.activeOrder.isFetching || state.orderList.isFetching,
        orderInfo,
        order
    }
}

class OrderViewImpl extends React.Component<MergedProps, {}> {

    constructor(props) {
        super(props);

        this._handleLoginFormSubmit = this._handleLoginFormSubmit.bind(this);
    }

    public render(): JSX.Element {

        if (this.props.isFetching) {
            return <div>Loading...</div>;
        }

        if (!this.props.order) {
            return (
                <div>
                    <div>Time to log in</div>
                    <LoginForm onSubmit={this._handleLoginFormSubmit} />
                </div>
            )
        }

        const lists = this.props.order.lists.map(list => {
            return (
                <div className="col col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <List key={list.id} list={list} currencyMultiplier={this.props.order.currencyMultiplier} />
                </div>
            );
        });

        return (
            <div className="container">
                <div className="row">
                    {lists}
                </div>
            </div>
        )

    }

    public componentWillMount() {
        const orderId = parseInt(this.props.match.params.orderId, 10);
        this.props.dispatch(fetchActiveOrder(orderId));
    }

    private _handleLoginFormSubmit(password: string) {
        const orderId = parseInt(this.props.match.params.orderId, 10);
        this.props.dispatch(loginActiveOrder(orderId, password));
    }
}

export const OrderView = connect<StoreProps, any, any>(mapStateToProps)(OrderViewImpl);