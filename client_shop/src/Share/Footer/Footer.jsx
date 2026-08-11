import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container py-4">
        <div className="row py-5">

          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Customer services</h6>

            <ul className="list-unstyled mb-0">
              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Help &amp; Contact Us
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Returns &amp; Refunds
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Online Stores
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>


          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="text-uppercase mb-3">Company</h6>

            <ul className="list-unstyled mb-0">
              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  What We Do
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Available Services
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Latest Posts
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>


          <div className="col-md-4">
            <h6 className="text-uppercase mb-3">Social media</h6>

            <ul className="list-unstyled mb-0">
              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Twitter
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Instagram
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Tumblr
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="footer-link border-0 bg-transparent p-0"
                >
                  Pinterest
                </button>
              </li>
            </ul>
          </div>
        </div>


        <div
          className="border-top pt-4"
          style={{
            borderColor: "#1d1d1d",
          }}
        >
          <div className="row">
            <div className="col-lg-6">
              <p className="small text-muted mb-0">
                &copy; 2026 All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
