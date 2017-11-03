import * as React from "react";
import * as redux from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { RootState, PrunedOrder } from "../../types";

interface StoreProps {
    isFetching: boolean;
    orders: PrunedOrder[];
    dispatch?: redux.Dispatch<RootState>;
}

const mapStateToProps = (state: RootState): StoreProps => {
    return {
        isFetching: state.orderList.isFetching,
        orders: state.orderList.orders
    }
}

class HomeViewImpl extends React.Component<StoreProps, {}> {

    public render(): JSX.Element {
        const links = this.props.orders.map((order, index) => {
            return <div key={index}><Link to={`/${order.id}`}>{order.name}</Link></div>
        });

        return (
            <div>
                <h2>Orders</h2>
                <div>
                    {links}
                </div>
            </div>
        )
    }

}

export const HomeView = connect<StoreProps, any, any>(mapStateToProps)(HomeViewImpl)