import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
    <div className="text-center">
      <div className="list-group">
        <NavLink to="/dashboard/admin" end className="list-group-item list-group-item-action">
          Dashboard Home
        </NavLink>
        <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-item-action">
          Create Category
        </NavLink>
        <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-item-action">
          Create Product
        </NavLink>
        <NavLink to="/dashboard/admin/products" className="list-group-item list-group-item-action">
          Manage Products
        </NavLink>
        <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-item-action">
          Manage Orders
        </NavLink>
      </div>
    </div>
    </>

  );
};
export default AdminMenu;