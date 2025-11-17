/**
 *
 * Homepage (Myntra-inspired)
 *
 */

import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import actions from "../../actions";
import banners from "./banners.json";
import CarouselSlider from "../../components/Common/CarouselSlider";
import { responsiveOneItemCarousel } from "../../components/Common/CarouselSlider/utils";


class Homepage extends React.PureComponent {
  render() {
    return (
      <div className="homepage">
        {/* Hero Banner Slider */}
        <div className="home-carousel mb-5">
          <CarouselSlider
            swipeable
            showDots
            infinite
            autoPlay
            slides={banners}
            responsive={responsiveOneItemCarousel}
          >
            {banners.map((item, index) => (
              <img
                key={index}
                src={item.imageUrl}
                alt={`Banner ${index + 1}`}
                className="img-fluid w-100 rounded shadow-sm"
              />
            ))}
          </CarouselSlider>
        </div>

        {/* Shop by Category */}
        <section className="categories mb-5">
          <h2 className="text-center mb-4 fw-bold">Shop by Category</h2>
          <Row className="g-4 justify-content-center">
            {[
              { name: "Men", img: "/images/men.jpg" },
              { name: "Unisex", img: "/images/unisex.jpg" },
              { name: "Women", img: "/images/women.jpg"},
            ].map((cat, index) => (
              <Col key={index} xs="6" md="4" lg="3" className="d-flex justify-content-center">
                <a
                  href={cat.link}
                  className="category-tile text-center text-decoration-none d-block p-3 rounded shadow-sm"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                  <p className="mt-3 fw-semibold fs-5 text-dark">{cat.name}</p>
                </a>
              </Col>
            ))}
          </Row>
        </section>


        {/* Promotional Banner Strip */}
        <section className="promo-banner mb-5 text-center">
          <img
            src="/images/banners/sale-banner.jpg"
            alt="Seasonal Sale"
            className="img-fluid rounded shadow-sm"
          />
        </section>

        {/* Featured Products
        <section className="featured mb-5">
          <h2 className="text-center mb-4 fw-bold">Trending Now</h2>
          <Row className="g-3">
            {[1, 2, 3, 4, 5, 6].map((p, index) => (
              <Col key={index} xs="6" md="4" lg="2">
                <div className="product-card text-center p-2 rounded shadow-sm hover-zoom">
                  <img
                    src={`/images/products/product-${p}.jpg`}
                    alt={`Product ${p}`}
                    className="img-fluid rounded"
                  />
                  <p className="mt-2">Product {p}</p>
                  <p className="fw-bold text-danger">₹{ }</p>
                </div>
              </Col>
            ))}
          </Row>
        </section> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, actions)(Homepage);
