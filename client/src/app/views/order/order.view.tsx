import * as React from "react";
import { connect } from "react-redux";
import * as redux from "redux";
import { RouteComponentProps } from "react-router-dom";

import { fetchActiveOrder, loginActiveOrder, addListActiveOrder } from "../../actions/active-order";
import { RootState, PrunedOrder, Order } from "../../types";

import { TextInput } from "../../components/text-input";
import { Container, Col, Row } from "../../components/grid";
import { LoginForm } from "./components/login-form";
import { List } from "./components/list";

interface StoreProps {
    orderInfo: PrunedOrder;
    order: Order;
    isFetching: boolean;
    dispatch?: redux.Dispatch<RootState>
}

interface OwnState {
    newListName: string;
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

class OrderViewImpl extends React.Component<MergedProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            newListName: ""
        }

        this._handleLoginFormSubmit = this._handleLoginFormSubmit.bind(this);
        this._handleNewListNameOnChange = this._handleNewListNameOnChange.bind(this);
        this._handleAddNewListClick = this._handleAddNewListClick.bind(this);
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
                <Col key={index} lg={6} xl={6}>
                    <List list={list} order={this.props.order} dispatch={this.props.dispatch} />
                </Col>
            );
        });

        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <div className="mt-1">
                                <form>
                                    <div className="form-row align-items-center">
                                        <div className="col-auto">
                                            <TextInput
                                                name="listName"
                                                required={true}
                                                placeholder="Name for the new list"
                                                onChange={this._handleNewListNameOnChange}
                                                marginBottom={0} />
                                        </div>
                                        <div className="col-auto">
                                            <button
                                                type="submit"
                                                disabled={!this.state.newListName}
                                                onClick={this._handleAddNewListClick}
                                                className="btn btn-primary">Add new list</button>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </Col>
                    </Row>
                </Container>

                <Container>
                    <Row>
                        {lists}
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

    private _handleNewListNameOnChange(value: string) {
        this.setState({
            newListName: value
        });
    }

    private _handleAddNewListClick() {
        const { newListName } = this.state;
        if (newListName) {
            this.props.dispatch(addListActiveOrder(this.props.order.id, newListName));
        }
    }
}

export const OrderView = connect<StoreProps, any, any>(mapStateToProps)(OrderViewImpl);