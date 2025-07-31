import { useEffect, useState } from 'react';
import '../orders.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    document.title = 'Shopfusion | My Orders';

    const savedOrders = JSON.parse(
      localStorage.getItem(`orders_${userInfo.email}`) || '[]'
    );
    setOrders(savedOrders);
    setLoading(false);
  }, [userInfo.email]);

  if (!userInfo.name) {
    return <p className="order-error">❌ Please log in to view your orders.</p>;
  }

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const downloadPDF = (pdfId, orderIndex) => {
    const input = document.getElementById(pdfId);
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Order_${orderIndex + 1}.pdf`);
    });
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">📜 My Orders</h2>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-btn"
        >
          ⬅ Prev
        </button>
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-btn"
        >
          Next ➡
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">You have not placed any orders yet.</p>
      ) : (
        <>
          <div id="orders-section">
            {currentOrders.map((order, index) => {
              const orderIndex = indexOfFirstOrder + index;
              const pdfId = `order-pdf-${orderIndex}`;

              return (
                <div key={orderIndex} className="order-card-wrapper">
                  {/* 👇 Only this section gets captured */}
                  <div id={pdfId} className="order-card">
                    <h3 className="order-id">🧾 Order #{orderIndex + 1}</h3>
                    <p className="order-date">📅 Placed on: {order.date}</p>
                    <p className="order-status">
                      🚚 Status: <strong>{order.status || 'Pending'}</strong>
                    </p>

                    <div className="items-wrapper">
                      {order.items.map((item) => (
                        <div key={item.slug} className="order-item row-view">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="product-image"
                          />
                          <div className="row-details">
                            <div className="col name">{item.name}</div>
                            <div className="col qty">Qty: {item.quantity}</div>
                            <div className="col price">
                              Price: ₹{item.price}
                            </div>
                            <div className="col subtotal">
                              Subtotal: ₹{item.price * item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.deliveryInfo && (
                      <div className="shipping-info">
                        <strong>Shipping To:</strong>
                        <br />
                        {order.deliveryInfo.fullName}
                        <br />
                        {order.deliveryInfo.address},{' '}
                        {order.deliveryInfo.landmark}, {order.deliveryInfo.city}
                        , {order.deliveryInfo.state} - {order.deliveryInfo.pin}
                        <br />
                        Phone: {order.deliveryInfo.phone}
                      </div>
                    )}

                    <div className="order-total">
                      <strong>Total: ₹{order.total}</strong>
                    </div>
                  </div>

                  {/* 👇 Button excluded from PDF */}
                  <button
                    onClick={() => downloadPDF(pdfId, orderIndex)}
                    className="download-btn order-btn"
                  >
                    ⬇ Download PDF
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              ⬅ Prev
            </button>
            <span className="page-indicator">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MyOrdersScreen;
