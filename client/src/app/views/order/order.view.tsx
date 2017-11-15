import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import { RouteComponentProps } from "react-router-dom";

import { fetchActiveOrder, loginActiveOrder, addListActiveOrder } from "../../actions/active-order";
import { RootState, PrunedOrder, Order } from "../../types";

import { TextInput } from "../../components/text-input";
import { Container, Col, Row } from "../../components/grid";
import { LoginForm } from "./components/login-form";
import { AddNewListForm } from "./components/add-new-list-form";
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
        this._handleAddNewListFormSubmit = this._handleAddNewListFormSubmit.bind(this);
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

        const lists = this.props.order.lists.map((list, index) => {
            return (
                <List key={index} list={list} order={this.props.order} dispatch={this.props.dispatch} />
            );
        });

        const oddLists = lists.filter((list, index) => index % 2 === 1);
        const evenLists = lists.filter((list, index) => index % 2 === 0);

        const listCols = [
            <Col key={0} lg={6} xl={6}>{evenLists}</Col>,
            <Col key={1} lg={6} xl={6}>{oddLists}</Col>
        ]

        return (
            <div>
                <Container className="mt-5">
                    <Row>
                        <Col>
                            <AddNewListForm onSubmit={this._handleAddNewListFormSubmit} />
                        </Col>
                    </Row>
                </Container>

                <Container className="mt-5">
                    <Row>
                        {listCols}
                    </Row>
                </Container>

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

    private _handleAddNewListFormSubmit(newListName: string) {
        if (newListName) {
            this.props.dispatch(addListActiveOrder(this.props.order.id, newListName));
        }
    }

}

export const OrderView = connect<StoreProps, any, any>(mapStateToProps)(OrderViewImpl);