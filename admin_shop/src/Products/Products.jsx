import React, { useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import Pagination from "./Component/Pagination";

function Products() {
  const [products, setProducts] = useState([]);
  const [temp, setTemp] = useState([]);

  const [pagination, setPagination] = useState({
    page: "1",
    count: "8",
    search: "",
    category: "all",
  });

  const [totalPage, setTotalPage] = useState();

  const onChangeText = (e) => {
    const value = e.target.value;
    setPagination({ ...pagination, search: value });

    if (!value) {
      setProducts(temp);
      return;
    }

    const searchProducts = temp.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );

    setProducts(searchProducts);
  };

  // 🔄 CHANGE PAGE
  const handlerChangePage = (value) => {
    setPagination({
      ...pagination,
      page: value,
    });
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      await ProductAPI.deleteProduct(id);
      alert("Xóa thành công!");
      fetchAllData(); // reload lại list
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      const params = {
        page: pagination.page,
        count: pagination.count,
        category: pagination.category,
      };

      const query = "?" + queryString.stringify(params);

      const { products, total } = await ProductAPI.getPagination(query);

      setProducts(products);
      setTemp(products);

      const totalPage = Math.ceil(parseInt(total) / parseInt(pagination.count));
      setTotalPage(totalPage);
    } catch (err) {
      console.error(err);
    }
  }, [pagination.page, pagination.count, pagination.category]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Products Manage
            </h4>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Products</h4>

            <div className="d-flex justify-content-between">
              <input
                className="form-control w-25"
                onChange={onChangeText}
                placeholder="Enter Search!"
              />

              <a
                href={`/products/view-edit`}
                style={{ cursor: "pointer", color: "white" }}
                className="btn btn-success"
              >
                Create Product
              </a>
            </div>

            <br />

            <div className="table-responsive">
              <table className="table table-striped table-bordered no-wrap">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Edit</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((value) => (
                    <tr key={value._id}>
                      <td>{value._id}</td>
                      <td>{value.name}</td>
                      <td>{value.price}</td>

                      <td>
                        <img
                          src={value.img1}
                          style={{ height: "60px", width: "60px" }}
                          alt=""
                        />
                      </td>

                      <td>
                        <div title={value.description}>
                          {value.description && value.description.length > 50
                            ? value.description.substring(0, 50) + "..."
                            : value.description}
                        </div>
                      </td>

                      <td>
                        {typeof value.category === "object"
                          ? value.category.name
                          : value.category}
                      </td>

                      <td>
                        <a
                          href={`/products/view-edit?id=${value._id}`}
                          style={{ cursor: "pointer", color: "white" }}
                          className="btn btn-success"
                        >
                          Update
                        </a>
                        &nbsp;
                        {/* ✅ DELETE */}
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(value._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                pagination={pagination}
                handlerChangePage={handlerChangePage}
                totalPage={totalPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
