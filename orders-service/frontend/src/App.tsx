import { useEffect, useState } from "react";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "./api/orders";
import type { Order } from "./types/order";

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProduct("");
    setPrice("");
    setQuantity("1");
    setEditingOrderId(null);
    setError("");
  };

  const handleCreateOrUpdate = async () => {
    if (!product.trim()) {
      setError("Product name is required.");
      return;
    }

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Price must be a valid number greater than 0.");
      return;
    }

    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be a valid number greater than 0.");
      return;
    }

    try {
      setError("");

      const orderPayload: Order = {
        product: product.trim(),
        price: parsedPrice,
        quantity: parsedQuantity,
      };

      if (editingOrderId) {
        await updateOrder(editingOrderId, orderPayload);
      } else {
        await createOrder(orderPayload);
      }

      resetForm();
      await loadOrders();
    } catch (err) {
      console.error(err);
      setError("Failed to save order.");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      setError("");
      const order = await getOrderById(id);

      setProduct(order.product);
      setPrice(String(order.price));
      setQuantity(String(order.quantity));
      setEditingOrderId(id);
    } catch (err) {
      console.error(err);
      setError("Failed to load order for editing.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError("");
      await deleteOrder(id);

      if (editingOrderId === id) {
        resetForm();
      }

      await loadOrders();
    } catch (err) {
      console.error(err);
      setError("Failed to delete order.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1>Prasad Test Order Management</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <h2>{editingOrderId ? "Edit Order" : "Create Order"}</h2>

        <div style={{ marginBottom: "12px" }}>
          <label>Product</label>
          <br />
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Enter product name"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Price</label>
          <br />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Quantity</label>
          <br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button onClick={handleCreateOrUpdate} style={{ padding: "10px 16px", marginRight: "8px" }}>
          {editingOrderId ? "Update Order" : "Create Order"}
        </button>

        {editingOrderId && (
          <button onClick={resetForm} style={{ padding: "10px 16px" }}>
            Cancel Edit
          </button>
        )}
      </div>

      <div>
        <h2>Orders List</h2>

        {loading && <p>Loading orders...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && orders.length === 0 && <p>No orders found.</p>}

        {orders.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "12px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Product</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id ?? index}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {order.product}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    ${order.price}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {order.quantity}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {order.id && (
                      <>
                        <button
                          onClick={() => handleEdit(order.id!)}
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(order.id!)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;