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
    console.log(state);
    return {
        isFetching: state.orderList.isFetching,
        orders: state.orderList.orders
    }
}

class HomeViewImpl extends React.Component<StoreProps, {}> {

    public render(): JSX.Element {

        console.log(this.props);

        const links = this.props.orders.map(order => {
            return <div><Link to={`/${order.id}`}>{order.name}</Link></div>
        });

        return (
            <div>
                {links}
            </div>
        )
    }

}

export const HomeView = connect<StoreProps, any, any>(mapStateToProps)(HomeViewImpl)